using Microsoft.EntityFrameworkCore;
using OwnerService.API.Models;

namespace OwnerService.API.Data
{
    public class OwnerDbContext : DbContext
    {
        public OwnerDbContext(DbContextOptions<OwnerDbContext> options) : base(options)
        {
        }

        public DbSet<Owner> Owners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Owner>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
            });
        }
    }
}
