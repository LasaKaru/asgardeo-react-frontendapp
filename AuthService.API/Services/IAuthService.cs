using AuthService.API.DTOs;

namespace AuthService.API.Services;

public interface IAuthService
{
    Task<LoginResponse?> AuthenticateWithAsgardeoAsync(AsgardeoTokenRequest request);
    Task<LoginResponse?> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeTokenAsync(int userId);
    Task<bool> ValidateUserSessionAsync(int userId, string accessToken);
}
