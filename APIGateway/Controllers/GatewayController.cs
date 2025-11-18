using Microsoft.AspNetCore.Mvc;

namespace APIGateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GatewayController : ControllerBase
{
    private readonly ILogger<GatewayController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public GatewayController(ILogger<GatewayController> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Get the status of all microservices
    /// </summary>
    [HttpGet("services-status")]
    public async Task<IActionResult> GetServicesStatus()
    {
        var services = new[]
        {
            new { Name = "Auth Service", Url = "http://localhost:5000/health", Port = 5000 },
            new { Name = "Property Service", Url = "http://localhost:5001/health", Port = 5001 },
            new { Name = "Owner Service", Url = "http://localhost:5002/health", Port = 5002 },
            new { Name = "Tenant Service", Url = "http://localhost:5003/health", Port = 5003 },
            new { Name = "Lease Service", Url = "http://localhost:5004/health", Port = 5004 },
            new { Name = "Payment Service", Url = "http://localhost:5005/health", Port = 5005 },
            new { Name = "Maintenance Service", Url = "http://localhost:5006/health", Port = 5006 }
        };

        var statuses = new List<object>();
        var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(3) };

        foreach (var service in services)
        {
            try
            {
                var response = await httpClient.GetAsync(service.Url);
                statuses.Add(new
                {
                    name = service.Name,
                    port = service.Port,
                    status = response.IsSuccessStatusCode ? "healthy" : "unhealthy",
                    statusCode = (int)response.StatusCode,
                    url = service.Url
                });
            }
            catch (Exception ex)
            {
                statuses.Add(new
                {
                    name = service.Name,
                    port = service.Port,
                    status = "unreachable",
                    error = ex.Message,
                    url = service.Url
                });
            }
        }

        var healthyCount = statuses.Count(s => ((dynamic)s).status == "healthy");
        var totalCount = statuses.Count;

        return Ok(new
        {
            gatewayStatus = "healthy",
            timestamp = DateTime.UtcNow,
            summary = new
            {
                healthy = healthyCount,
                total = totalCount,
                percentage = (healthyCount * 100.0 / totalCount)
            },
            services = statuses
        });
    }

    /// <summary>
    /// Get routing configuration
    /// </summary>
    [HttpGet("routes")]
    public IActionResult GetRoutes()
    {
        var routes = new[]
        {
            new
            {
                path = "/api/auth/*",
                service = "Auth Service",
                destination = "http://localhost:5000",
                description = "Authentication and authorization endpoints"
            },
            new
            {
                path = "/api/properties/*",
                service = "Property Service",
                destination = "http://localhost:5001",
                description = "Property management endpoints"
            },
            new
            {
                path = "/api/owners/*",
                service = "Owner Service",
                destination = "http://localhost:5002",
                description = "Property owner management endpoints"
            },
            new
            {
                path = "/api/tenants/*",
                service = "Tenant Service",
                destination = "http://localhost:5003",
                description = "Tenant management endpoints"
            },
            new
            {
                path = "/api/leases/*",
                service = "Lease Service",
                destination = "http://localhost:5004",
                description = "Lease agreement endpoints"
            },
            new
            {
                path = "/api/payments/*",
                service = "Payment Service",
                destination = "http://localhost:5005",
                description = "Payment tracking endpoints"
            },
            new
            {
                path = "/api/maintenance/*",
                service = "Maintenance Service",
                destination = "http://localhost:5006",
                description = "Maintenance request endpoints"
            }
        };

        return Ok(new
        {
            gateway = "http://localhost:8080",
            totalRoutes = routes.Length,
            routes
        });
    }
}
