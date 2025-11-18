using System.ComponentModel.DataAnnotations;

namespace AuthService.API.DTOs;

public class LoginRequest
{
    [Required]
    public string AuthorizationCode { get; set; } = string.Empty;

    public string? RedirectUri { get; set; }
}
