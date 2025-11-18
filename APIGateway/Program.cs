using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Configure CORS to allow React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3001", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add YARP Reverse Proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Real Estate API Gateway",
        Version = "v1",
        Description = "Central API Gateway for Real Estate Management System Microservices"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gateway V1");
        c.RoutePrefix = "swagger";
    });
}

// Enable CORS
app.UseCors("AllowReactApp");

// Map controllers
app.MapControllers();

// Map YARP Reverse Proxy
app.MapReverseProxy();

// Gateway health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    gateway = "API Gateway",
    timestamp = DateTime.UtcNow,
    message = "API Gateway is running and ready to route requests"
}));

// Gateway info endpoint
app.MapGet("/gateway-info", () => Results.Ok(new
{
    gateway = "Real Estate API Gateway",
    version = "1.0.0",
    services = new[]
    {
        new { name = "Auth Service", port = 5000, route = "/api/auth/*" },
        new { name = "Property Service", port = 5001, route = "/api/properties/*" },
        new { name = "Owner Service", port = 5002, route = "/api/owners/*" },
        new { name = "Tenant Service", port = 5003, route = "/api/tenants/*" },
        new { name = "Lease Service", port = 5004, route = "/api/leases/*" },
        new { name = "Payment Service", port = 5005, route = "/api/payments/*" },
        new { name = "Maintenance Service", port = 5006, route = "/api/maintenance/*" }
    },
    documentation = new
    {
        swagger = "http://localhost:8080/swagger",
        healthCheck = "http://localhost:8080/health",
        gatewayInfo = "http://localhost:8080/gateway-info"
    }
}));

Console.WriteLine("========================================");
Console.WriteLine("Real Estate API Gateway");
Console.WriteLine("========================================");
Console.WriteLine("Gateway URL: http://localhost:8080");
Console.WriteLine("Swagger UI: http://localhost:8080/swagger");
Console.WriteLine("Health Check: http://localhost:8080/health");
Console.WriteLine("Gateway Info: http://localhost:8080/gateway-info");
Console.WriteLine("========================================");
Console.WriteLine("Routing Configuration:");
Console.WriteLine("  /api/auth/*        → http://localhost:5000");
Console.WriteLine("  /api/properties/*  → http://localhost:5001");
Console.WriteLine("  /api/owners/*      → http://localhost:5002");
Console.WriteLine("  /api/tenants/*     → http://localhost:5003");
Console.WriteLine("  /api/leases/*      → http://localhost:5004");
Console.WriteLine("  /api/payments/*    → http://localhost:5005");
Console.WriteLine("  /api/maintenance/* → http://localhost:5006");
Console.WriteLine("========================================");

app.Run();
