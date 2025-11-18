# API Gateway - Real Estate Management System

## Overview

The **API Gateway** is the central entry point for all client requests in the Real Estate Management System. It routes requests to the appropriate microservices using **YARP (Yet Another Reverse Proxy)**.

## Architecture

```
┌─────────────────┐
│  Frontend       │
│  (React App)    │
│  localhost:3001 │
└────────┬────────┘
         │
         │ All API requests
         ↓
┌─────────────────┐
│  API Gateway    │
│  YARP Proxy     │
│  localhost:8080 │
└────────┬────────┘
         │
         ├──→ /api/auth/*        → Auth Service (5000)
         ├──→ /api/properties/*  → Property Service (5001)
         ├──→ /api/owners/*      → Owner Service (5002)
         ├──→ /api/tenants/*     → Tenant Service (5003)
         ├──→ /api/leases/*      → Lease Service (5004)
         ├──→ /api/payments/*    → Payment Service (5005)
         └──→ /api/maintenance/* → Maintenance Service (5006)
```

## Why API Gateway?

### Benefits

1. **Single Entry Point**
   - Frontend only needs to know one URL (http://localhost:8080)
   - Simplifies client configuration

2. **Request Routing**
   - Automatically routes requests to correct microservice
   - Based on URL path matching

3. **Load Balancing** (Future)
   - Can distribute load across multiple instances
   - Health checks and failover

4. **Security** (Future)
   - Centralized authentication/authorization
   - Rate limiting
   - API key validation

5. **Monitoring**
   - Single point to monitor all API traffic
   - Logging and metrics collection

6. **Service Discovery** (Future)
   - Dynamic service registration
   - Automatic routing updates

## Gateway Configuration

The gateway is configured in `appsettings.json`:

```json
{
  "ReverseProxy": {
    "Routes": {
      "auth-route": {
        "ClusterId": "auth-cluster",
        "Match": {
          "Path": "/api/auth/{**catch-all}"
        }
      },
      // ... more routes
    },
    "Clusters": {
      "auth-cluster": {
        "Destinations": {
          "auth-service": {
            "Address": "http://localhost:5000"
          }
        }
      },
      // ... more clusters
    }
  }
}
```

## Routes

| Route Pattern | Service | Port | Description |
|--------------|---------|------|-------------|
| `/api/auth/**` | Auth Service | 5000 | Authentication endpoints |
| `/api/properties/**` | Property Service | 5001 | Property management |
| `/api/owners/**` | Owner Service | 5002 | Owner management |
| `/api/tenants/**` | Tenant Service | 5003 | Tenant management |
| `/api/leases/**` | Lease Service | 5004 | Lease agreements |
| `/api/payments/**` | Payment Service | 5005 | Payment tracking |
| `/api/maintenance/**` | Maintenance Service | 5006 | Maintenance requests |

## Gateway Endpoints

### Health Check
```
GET http://localhost:8080/health
```

**Response:**
```json
{
  "status": "healthy",
  "gateway": "API Gateway",
  "timestamp": "2025-01-18T10:30:00Z",
  "message": "API Gateway is running and ready to route requests"
}
```

### Gateway Info
```
GET http://localhost:8080/gateway-info
```

**Response:**
```json
{
  "gateway": "Real Estate API Gateway",
  "version": "1.0.0",
  "services": [
    {
      "name": "Auth Service",
      "port": 5000,
      "route": "/api/auth/*"
    },
    // ... more services
  ],
  "documentation": {
    "swagger": "http://localhost:8080/swagger",
    "healthCheck": "http://localhost:8080/health",
    "gatewayInfo": "http://localhost:8080/gateway-info"
  }
}
```

### Services Status
```
GET http://localhost:8080/api/gateway/services-status
```

**Response:**
```json
{
  "gatewayStatus": "healthy",
  "timestamp": "2025-01-18T10:30:00Z",
  "summary": {
    "healthy": 7,
    "total": 7,
    "percentage": 100
  },
  "services": [
    {
      "name": "Auth Service",
      "port": 5000,
      "status": "healthy",
      "statusCode": 200,
      "url": "http://localhost:5000/health"
    },
    // ... more services
  ]
}
```

### Routes Configuration
```
GET http://localhost:8080/api/gateway/routes
```

**Response:**
```json
{
  "gateway": "http://localhost:8080",
  "totalRoutes": 7,
  "routes": [
    {
      "path": "/api/auth/*",
      "service": "Auth Service",
      "destination": "http://localhost:5000",
      "description": "Authentication and authorization endpoints"
    },
    // ... more routes
  ]
}
```

## Usage

### Starting the Gateway

**Manually:**
```bash
cd APIGateway
dotnet run
```

**With all services:**
```bash
# Linux/Mac
./start-all-services.sh

# Windows
.\start-all-services.ps1
```

The gateway will start on **http://localhost:8080**

### Frontend Configuration

Update `src/config.json`:

```json
{
  "apiBaseUrl": "http://localhost:8080/api"
}
```

Now all API calls from frontend go through the gateway:

```typescript
// Example: Get all properties
// Frontend calls: http://localhost:8080/api/properties
// Gateway routes to: http://localhost:5001/api/properties

const response = await axios.get('http://localhost:8080/api/properties');
```

## Request Flow

### Example: Get Properties

1. **Frontend Request:**
   ```
   GET http://localhost:8080/api/properties
   ```

2. **Gateway Processing:**
   - Receives request on port 8080
   - Matches path `/api/properties` to `properties-route`
   - Finds cluster `properties-cluster`
   - Forwards to `http://localhost:5001/api/properties`

3. **Microservice:**
   - Property Service receives request on port 5001
   - Processes request
   - Returns data

4. **Gateway Response:**
   - Receives response from Property Service
   - Forwards response to frontend

5. **Frontend:**
   - Receives data
   - Updates UI

## Monitoring

### View Gateway Logs

The gateway logs all requests and responses:

```
info: Yarp.ReverseProxy.Forwarder.HttpForwarder[9]
      Proxying to http://localhost:5001/api/properties
info: Yarp.ReverseProxy.Forwarder.HttpForwarder[6]
      Received HTTP/1.1 200 OK from http://localhost:5001/api/properties
```

### Health Checks

Use the services status endpoint to monitor all microservices:

```bash
curl http://localhost:8080/api/gateway/services-status
```

## CORS Configuration

The gateway is configured to allow requests from:
- http://localhost:3001 (React frontend)
- http://localhost:3000 (alternative frontend port)

CORS policy in `Program.cs`:

```csharp
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
```

## Swagger Documentation

Access the gateway's Swagger UI:

```
http://localhost:8080/swagger
```

This shows:
- Gateway health endpoint
- Gateway info endpoint
- Gateway controller endpoints (services status, routes)

## Future Enhancements

### 1. Authentication Middleware
```csharp
// Validate JWT tokens before forwarding
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { ... });
```

### 2. Rate Limiting
```csharp
// Limit requests per client
builder.Services.AddRateLimiter(options => { ... });
```

### 3. Caching
```csharp
// Cache responses for performance
builder.Services.AddResponseCaching();
```

### 4. Load Balancing
```json
{
  "properties-cluster": {
    "LoadBalancingPolicy": "RoundRobin",
    "Destinations": {
      "property-service-1": { "Address": "http://localhost:5001" },
      "property-service-2": { "Address": "http://localhost:5011" }
    }
  }
}
```

### 5. Service Discovery
- Integration with Consul or Eureka
- Automatic service registration
- Dynamic routing updates

### 6. Circuit Breaker
```csharp
// Prevent cascade failures
builder.Services.AddHttpClient()
    .AddTransientHttpErrorPolicy(p =>
        p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));
```

## Troubleshooting

### Gateway Not Starting

**Check port availability:**
```bash
lsof -i :8080
```

**Kill process using port:**
```bash
kill -9 <PID>
```

### Routes Not Working

**Verify configuration:**
```bash
# Check appsettings.json syntax
cat APIGateway/appsettings.json | jq .
```

**Check gateway logs:**
- Gateway logs show which route was matched
- Shows destination URL
- Shows response status

### Service Unreachable

**Check service status:**
```bash
curl http://localhost:8080/api/gateway/services-status
```

**Verify service is running:**
```bash
curl http://localhost:5001/health
```

### CORS Errors

**Verify CORS policy:**
- Check `Program.cs` has correct origins
- Ensure `app.UseCors("AllowReactApp")` is before `app.MapReverseProxy()`

## Development Tips

### Testing Routes

Use cURL to test routes:

```bash
# Test auth route
curl http://localhost:8080/api/auth/validate

# Test properties route
curl http://localhost:8080/api/properties

# Test with headers
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/api/properties
```

### Adding New Routes

1. Add route in `appsettings.json`:
```json
{
  "new-service-route": {
    "ClusterId": "new-service-cluster",
    "Match": {
      "Path": "/api/newservice/{**catch-all}"
    }
  }
}
```

2. Add cluster:
```json
{
  "new-service-cluster": {
    "Destinations": {
      "new-service": {
        "Address": "http://localhost:5007"
      }
    }
  }
}
```

3. Restart gateway

## Summary

The API Gateway:
- ✅ Provides single entry point (port 8080)
- ✅ Routes requests to 7 microservices
- ✅ Supports health checking
- ✅ Includes Swagger documentation
- ✅ Handles CORS for frontend
- ✅ Logs all traffic
- ✅ Monitors service health
- ✅ Extensible for future features

**Gateway URL:** http://localhost:8080

**All frontend API calls now go through the gateway!**
