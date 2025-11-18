using System.ComponentModel.DataAnnotations;

namespace AuthService.API.DTOs;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
