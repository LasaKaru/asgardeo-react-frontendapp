using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.API.Models;

[Table("auth_tokens")]
public class AuthToken
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("user_id")]
    public int UserId { get; set; }

    [Required]
    [Column("asgardeo_access_token", TypeName = "TEXT")]
    public string AsgardeoAccessToken { get; set; } = string.Empty;

    [Column("asgardeo_id_token", TypeName = "TEXT")]
    public string? AsgardeoIdToken { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("token_type")]
    public string TokenType { get; set; } = "Bearer";

    [Column("expires_in")]
    public int ExpiresIn { get; set; }

    [Column("scope")]
    public string? Scope { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("is_revoked")]
    public bool IsRevoked { get; set; } = false;

    [Column("revoked_at")]
    public DateTime? RevokedAt { get; set; }

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}
