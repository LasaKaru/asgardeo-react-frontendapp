using AuthService.API.Models;

namespace AuthService.API.Services;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    int GetUserId(string token);
    bool ValidateToken(string token);
}
