using Microsoft.EntityFrameworkCore;
using AuthService.API.Data;
using AuthService.API.DTOs;
using AuthService.API.Models;

namespace AuthService.API.Services;

public class AuthService : IAuthService
{
    private readonly AuthDbContext _context;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IAsgardeoService _asgardeoService;
    private readonly IConfiguration _configuration;

    public AuthService(
        AuthDbContext context,
        IJwtTokenService jwtTokenService,
        IAsgardeoService asgardeoService,
        IConfiguration configuration)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
        _asgardeoService = asgardeoService;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> AuthenticateWithAsgardeoAsync(AsgardeoTokenRequest request)
    {
        try
        {
            // Validate Asgardeo token
            var isValid = await _asgardeoService.ValidateTokenAsync(request.AccessToken);
            if (!isValid)
            {
                return null;
            }

            // Get user info from Asgardeo
            var asgardeoUserInfo = await _asgardeoService.GetUserInfoAsync(request.AccessToken);
            if (asgardeoUserInfo == null)
            {
                return null;
            }

            // Find or create user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AsgardeoUserId == asgardeoUserInfo.Sub);

            if (user == null)
            {
                // Create new user
                user = new User
                {
                    AsgardeoUserId = asgardeoUserInfo.Sub,
                    Username = asgardeoUserInfo.Username,
                    Email = asgardeoUserInfo.Email,
                    FirstName = asgardeoUserInfo.GivenName,
                    LastName = asgardeoUserInfo.FamilyName,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Update existing user
                user.Email = asgardeoUserInfo.Email;
                user.Username = asgardeoUserInfo.Username;
                user.FirstName = asgardeoUserInfo.GivenName;
                user.LastName = asgardeoUserInfo.FamilyName;
                user.LastLogin = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            // Store Asgardeo token
            var authToken = new AuthToken
            {
                UserId = user.Id,
                AsgardeoAccessToken = request.AccessToken,
                AsgardeoIdToken = request.IdToken,
                TokenType = "Bearer",
                ExpiresIn = request.ExpiresIn,
                Scope = request.Scope,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddSeconds(request.ExpiresIn)
            };

            _context.AuthTokens.Add(authToken);

            // Generate our own JWT tokens
            var jwtAccessToken = _jwtTokenService.GenerateAccessToken(user);
            var jwtRefreshToken = _jwtTokenService.GenerateRefreshToken();

            var refreshTokenExpiryDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpiryDays"] ?? "7");

            // Store refresh token
            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = jwtRefreshToken,
                AsgardeoRefreshToken = request.RefreshToken,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpiryDays)
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return new LoginResponse
            {
                AccessToken = jwtAccessToken,
                RefreshToken = jwtRefreshToken,
                TokenType = "Bearer",
                ExpiresIn = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60") * 60,
                User = new UserInfo
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                }
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Authentication error: {ex.Message}");
            return null;
        }
    }

    public async Task<LoginResponse?> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken
                    && !rt.IsUsed
                    && !rt.IsRevoked
                    && rt.ExpiresAt > DateTime.UtcNow);

            if (storedToken == null)
            {
                return null;
            }

            // Mark old token as used
            storedToken.IsUsed = true;
            await _context.SaveChangesAsync();

            // Generate new tokens
            var jwtAccessToken = _jwtTokenService.GenerateAccessToken(storedToken.User);
            var jwtRefreshToken = _jwtTokenService.GenerateRefreshToken();

            var refreshTokenExpiryDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpiryDays"] ?? "7");

            // Store new refresh token
            var newRefreshToken = new RefreshToken
            {
                UserId = storedToken.UserId,
                Token = jwtRefreshToken,
                AsgardeoRefreshToken = storedToken.AsgardeoRefreshToken,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpiryDays)
            };

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            return new LoginResponse
            {
                AccessToken = jwtAccessToken,
                RefreshToken = jwtRefreshToken,
                TokenType = "Bearer",
                ExpiresIn = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60") * 60,
                User = new UserInfo
                {
                    Id = storedToken.User.Id,
                    Username = storedToken.User.Username,
                    Email = storedToken.User.Email,
                    FirstName = storedToken.User.FirstName,
                    LastName = storedToken.User.LastName
                }
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Refresh token error: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> RevokeTokenAsync(int userId)
    {
        try
        {
            // Revoke all active refresh tokens
            var activeTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();

            foreach (var token in activeTokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }

            // Revoke all auth tokens
            var authTokens = await _context.AuthTokens
                .Where(at => at.UserId == userId && !at.IsRevoked)
                .ToListAsync();

            foreach (var token in authTokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Revoke token error: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ValidateUserSessionAsync(int userId, string accessToken)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.IsActive)
            {
                return false;
            }

            return _jwtTokenService.ValidateToken(accessToken);
        }
        catch
        {
            return false;
        }
    }
}
