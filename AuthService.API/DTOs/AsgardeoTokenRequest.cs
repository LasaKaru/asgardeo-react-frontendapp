namespace AuthService.API.DTOs;

public class AsgardeoTokenRequest
{
    public string Code { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public string? IdToken { get; set; }
    public string? RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public string? Scope { get; set; }
}
