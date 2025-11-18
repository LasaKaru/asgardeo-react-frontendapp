using Microsoft.EntityFrameworkCore;
using PaymentService.API.Models;

namespace PaymentService.API.Data
{
    public class PaymentDbContext : DbContext
    {
        public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options)
        {
        }

        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasIndex(e => e.LeaseId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.DueDate);
            });
        }
    }
}
