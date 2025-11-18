using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MaintenanceService.API.Data;
using MaintenanceService.API.Models;

namespace MaintenanceService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceController : ControllerBase
    {
        private readonly MaintenanceDbContext _context;

        public MaintenanceController(MaintenanceDbContext context)
        {
            _context = context;
        }

        // GET: api/Maintenance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceRequest>>> GetMaintenanceRequests()
        {
            return await _context.MaintenanceRequests.ToListAsync();
        }

        // GET: api/Maintenance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceRequest>> GetMaintenanceRequest(int id)
        {
            var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(id);

            if (maintenanceRequest == null)
            {
                return NotFound();
            }

            return maintenanceRequest;
        }

        // POST: api/Maintenance
        [HttpPost]
        public async Task<ActionResult<MaintenanceRequest>> PostMaintenanceRequest(MaintenanceRequest maintenanceRequest)
        {
            maintenanceRequest.CreatedAt = DateTime.UtcNow;
            maintenanceRequest.UpdatedAt = DateTime.UtcNow;
            maintenanceRequest.ReportedDate = DateTime.UtcNow;

            _context.MaintenanceRequests.Add(maintenanceRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenanceRequest), new { id = maintenanceRequest.Id }, maintenanceRequest);
        }

        // PUT: api/Maintenance/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaintenanceRequest(int id, MaintenanceRequest maintenanceRequest)
        {
            if (id != maintenanceRequest.Id)
            {
                return BadRequest();
            }

            maintenanceRequest.UpdatedAt = DateTime.UtcNow;
            _context.Entry(maintenanceRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceRequestExists(id))
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

        // DELETE: api/Maintenance/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenanceRequest(int id)
        {
            var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(id);
            if (maintenanceRequest == null)
            {
                return NotFound();
            }

            _context.MaintenanceRequests.Remove(maintenanceRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceRequestExists(int id)
        {
            return _context.MaintenanceRequests.Any(e => e.Id == id);
        }
    }
}
