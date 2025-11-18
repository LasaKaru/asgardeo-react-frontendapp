using Microsoft.EntityFrameworkCore;
using PropertyService.API.Models;

namespace PropertyService.API.Data
{
    public class PropertyDbContext : DbContext
    {
        public PropertyDbContext(DbContextOptions<PropertyDbContext> options) : base(options)
        {
        }

        public DbSet<Property> Properties { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Property>(entity =>
            {
                entity.HasIndex(e => e.OwnerId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.City);
            });
        }
    }
}
