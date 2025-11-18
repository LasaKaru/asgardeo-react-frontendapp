using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LeaseService.API.Data;
using LeaseService.API.Models;

namespace LeaseService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeasesController : ControllerBase
    {
        private readonly LeaseDbContext _context;

        public LeasesController(LeaseDbContext context)
        {
            _context = context;
        }

        // GET: api/Leases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lease>>> GetLeases()
        {
            return await _context.Leases.ToListAsync();
        }

        // GET: api/Leases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lease>> GetLease(int id)
        {
            var lease = await _context.Leases.FindAsync(id);

            if (lease == null)
            {
                return NotFound();
            }

            return lease;
        }

        // POST: api/Leases
        [HttpPost]
        public async Task<ActionResult<Lease>> PostLease(Lease lease)
        {
            lease.CreatedAt = DateTime.UtcNow;
            lease.UpdatedAt = DateTime.UtcNow;

            _context.Leases.Add(lease);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLease), new { id = lease.Id }, lease);
        }

        // PUT: api/Leases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLease(int id, Lease lease)
        {
            if (id != lease.Id)
            {
                return BadRequest();
            }

            lease.UpdatedAt = DateTime.UtcNow;
            _context.Entry(lease).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Leases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLease(int id)
        {
            var lease = await _context.Leases.FindAsync(id);
            if (lease == null)
            {
                return NotFound();
            }

            _context.Leases.Remove(lease);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaseExists(int id)
        {
            return _context.Leases.Any(e => e.Id == id);
        }
    }
}
