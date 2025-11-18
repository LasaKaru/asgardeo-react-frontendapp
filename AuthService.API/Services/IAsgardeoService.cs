using AuthService.API.DTOs;

namespace AuthService.API.Services;

public interface IAsgardeoService
{
    Task<AsgardeoUserInfo?> GetUserInfoAsync(string accessToken);
    Task<bool> ValidateTokenAsync(string accessToken);
}
