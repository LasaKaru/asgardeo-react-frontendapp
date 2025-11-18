using Microsoft.EntityFrameworkCore;
using LeaseService.API.Models;

namespace LeaseService.API.Data
{
    public class LeaseDbContext : DbContext
    {
        public LeaseDbContext(DbContextOptions<LeaseDbContext> options) : base(options)
        {
        }

        public DbSet<Lease> Leases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Lease>(entity =>
            {
                entity.HasIndex(e => e.PropertyId);
                entity.HasIndex(e => e.TenantId);
                entity.HasIndex(e => e.Status);
            });
        }
    }
}
