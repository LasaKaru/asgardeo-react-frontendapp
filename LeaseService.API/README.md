# Lease Service

## Overview

The **Lease Service** is responsible for managing lease agreements, property-tenant relationships, lease terms, and rental contract data in the real estate management system.

## Port

**5004**

## Database

**Database Name:** `real_estate_lease_db`

**Tables:**
- `leases` - Lease agreements and contract details

## Features

✅ **Lease Management**
- Create new lease agreements
- Update lease details
- Delete lease records
- View lease details
- List all leases

✅ **Property-Tenant Relationships**
- Link properties to tenants
- Track active leases
- Historical lease data
- Lease term management

✅ **Financial Terms**
- Monthly rent amount
- Security deposit tracking
- Payment schedule
- Lease amount calculations

✅ **Lease Status**
- Active leases
- Expired leases
- Terminated leases
- Pending leases

✅ **Date Management**
- Lease start date
- Lease end date
- Auto-expiration tracking
- Lease renewal support

## API Endpoints

### Lease Management

#### GET `/api/leases`
Get all leases

**Query Parameters:**
- `propertyId` - Filter by property
- `tenantId` - Filter by tenant
- `status` - Filter by lease status
- `startDate` - Filter by start date
- `endDate` - Filter by end date

**Response:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "tenantId": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "rentAmount": 3500.00,
    "securityDeposit": 7000.00,
    "status": "Active",
    "terms": "12-month lease. Rent due on 1st of each month. No pets allowed.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET `/api/leases/{id}`
Get lease by ID

**Response:**
```json
{
  "id": 1,
  "propertyId": 1,
  "tenantId": 1,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "rentAmount": 3500.00,
  "securityDeposit": 7000.00,
  "status": "Active",
  "terms": "12-month lease. Rent due on 1st of each month. No pets allowed.",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### POST `/api/leases`
Create new lease (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "propertyId": 5,
  "tenantId": 8,
  "startDate": "2025-02-01",
  "endDate": "2026-01-31",
  "rentAmount": 4200.00,
  "securityDeposit": 8400.00,
  "status": "Pending",
  "terms": "12-month lease. Utilities included. No smoking."
}
```

**Response:**
```json
{
  "id": 11,
  "propertyId": 5,
  "tenantId": 8,
  "startDate": "2025-02-01",
  "endDate": "2026-01-31",
  "rentAmount": 4200.00,
  "securityDeposit": 8400.00,
  "status": "Pending",
  "terms": "12-month lease. Utilities included. No smoking.",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:30:00Z"
}
```

#### PUT `/api/leases/{id}`
Update lease (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "propertyId": 5,
  "tenantId": 8,
  "startDate": "2025-02-01",
  "endDate": "2026-01-31",
  "rentAmount": 4500.00,
  "securityDeposit": 9000.00,
  "status": "Active",
  "terms": "12-month lease. Utilities included. No smoking."
}
```

**Response:**
```json
{
  "id": 11,
  "propertyId": 5,
  "tenantId": 8,
  "startDate": "2025-02-01",
  "endDate": "2026-01-31",
  "rentAmount": 4500.00,
  "securityDeposit": 9000.00,
  "status": "Active",
  "terms": "12-month lease. Utilities included. No smoking.",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:35:00Z"
}
```

#### DELETE `/api/leases/{id}`
Delete lease (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Lease deleted successfully"
}
```

#### GET `/api/leases/property/{propertyId}`
Get all leases for a property

**Response:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "tenantId": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "rentAmount": 3500.00,
    "securityDeposit": 7000.00,
    "status": "Active",
    "terms": "12-month lease. Rent due on 1st of each month."
  }
]
```

#### GET `/api/leases/tenant/{tenantId}`
Get all leases for a tenant

**Response:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "tenantId": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "rentAmount": 3500.00,
    "securityDeposit": 7000.00,
    "status": "Active",
    "terms": "12-month lease. Rent due on 1st of each month."
  }
]
```

#### GET `/api/leases/active`
Get all active leases

**Response:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "tenantId": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "rentAmount": 3500.00,
    "securityDeposit": 7000.00,
    "status": "Active",
    "terms": "12-month lease. Rent due on 1st of each month."
  }
]
```

#### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

## Configuration

### Required Settings

Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_lease_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp"
  },
  "ServiceUrls": {
    "PropertyService": "http://localhost:5001",
    "TenantService": "http://localhost:5003",
    "PaymentService": "http://localhost:5005"
  }
}
```

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_lease_db` created and migrated
- AuthService running (for authentication)
- PropertyService running (for property validation)
- TenantService running (for tenant validation)

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < lease/01_create_lease_db.sql
mysql -u root -p < lease/02_insert_sample_leases.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd LeaseService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5004**

### Verify Service is Running

```bash
curl http://localhost:5004/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5004/swagger**

## Testing

### Test Get All Leases (with cURL)

```bash
curl -X GET http://localhost:5004/api/leases
```

### Test Get Lease by ID

```bash
curl -X GET http://localhost:5004/api/leases/1
```

### Test Get Active Leases

```bash
curl -X GET http://localhost:5004/api/leases/active
```

### Test Get Leases by Property

```bash
curl -X GET http://localhost:5004/api/leases/property/1
```

### Test Get Leases by Tenant

```bash
curl -X GET http://localhost:5004/api/leases/tenant/1
```

### Test Search Leases

```bash
# Search by status
curl -X GET "http://localhost:5004/api/leases?status=Active"

# Search by property
curl -X GET "http://localhost:5004/api/leases?propertyId=1"

# Search by tenant
curl -X GET "http://localhost:5004/api/leases?tenantId=1"
```

### Test Create Lease

```bash
curl -X POST http://localhost:5004/api/leases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "propertyId": 10,
    "tenantId": 5,
    "startDate": "2025-03-01",
    "endDate": "2026-02-28",
    "rentAmount": 2800.00,
    "securityDeposit": 5600.00,
    "status": "Pending",
    "terms": "12-month lease. Water and trash included."
  }'
```

### Test Update Lease

```bash
curl -X PUT http://localhost:5004/api/leases/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "propertyId": 1,
    "tenantId": 1,
    "startDate": "2024-01-01",
    "endDate": "2025-12-31",
    "rentAmount": 3700.00,
    "securityDeposit": 7400.00,
    "status": "Active",
    "terms": "24-month lease. Rent due on 1st of each month."
  }'
```

### Test Delete Lease

```bash
curl -X DELETE http://localhost:5004/api/leases/10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/LeasesController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/LeaseService.cs**
   - Business logic for lease management
   - Validation logic
   - Property-tenant relationship checks
   - Date validation

3. **Data/LeaseDbContext.cs**
   - Entity Framework database context
   - Database access

4. **Models/**
   - Lease.cs - Lease entity

## Database Schema

### leases table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| property_id | INT | Foreign key to Property Service |
| tenant_id | INT | Foreign key to Tenant Service |
| start_date | DATE | Lease start date |
| end_date | DATE | Lease end date |
| rent_amount | DECIMAL(10,2) | Monthly rent amount |
| security_deposit | DECIMAL(10,2) | Security deposit amount |
| status | VARCHAR(50) | Lease status |
| terms | TEXT | Lease terms and conditions |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Sample Data

The database includes 10 sample leases:
- **7 Active leases** - Currently in effect
- **2 Expired leases** - Past end date
- **1 Pending lease** - Not yet started

Lease characteristics:
- Various lease terms (6-24 months)
- Different rent amounts ($2,200 - $4,800)
- Security deposits (typically 2x rent)
- Detailed terms and conditions

## Troubleshooting

### Database Connection Failed

**Error:** Unable to connect to database

**Solution:**
```bash
# Check MySQL is running
systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_lease_db';"
```

### No Leases Returned

**Error:** Empty array returned from GET /api/leases

**Solution:**
```bash
# Check if sample data is loaded
mysql -u root -p real_estate_lease_db -e "SELECT COUNT(*) FROM leases;"

# Load sample data if needed
mysql -u root -p < database/lease/02_insert_sample_leases.sql
```

### Invalid Property ID

**Error:** Property not found

**Solution:**
1. Ensure PropertyService is running on port 5001
2. Verify property_id exists in PropertyService
3. Check property is available for lease

### Invalid Tenant ID

**Error:** Tenant not found

**Solution:**
1. Ensure TenantService is running on port 5003
2. Verify tenant_id exists in TenantService
3. Check tenant is eligible for lease

### Date Validation Error

**Error:** Invalid lease dates

**Solution:**
1. Start date must be before end date
2. End date must be in the future for new leases
3. Date format should be YYYY-MM-DD

### Authentication Failed

**Error:** 401 Unauthorized

**Solution:**
1. Ensure you have a valid JWT token from AuthService
2. Check Authorization header format: `Bearer {token}`
3. Verify token hasn't expired
4. Check JWT secret matches AuthService configuration

### Port Already in Use

**Error:** Address already in use

**Solution:**
```bash
# Find process using port 5004
lsof -i :5004

# Kill the process
kill -9 <PID>
```

### Overlapping Lease Error

**Error:** Property already leased for this period

**Solution:**
1. Check existing leases for the property
2. Ensure no date overlap with active leases
3. Terminate or expire old lease before creating new one

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_lease_db;..."
export JwtSettings__Secret="your-production-secret"
export ServiceUrls__PropertyService="https://property-service.example.com"
export ServiceUrls__TenantService="https://tenant-service.example.com"
export ServiceUrls__PaymentService="https://payment-service.example.com"
```

## Monitoring

### Logs

The service logs to console. In production, configure structured logging:

```csharp
builder.Logging.AddSerilog();
```

### Metrics

Monitor:
- Request count
- Lease creation rate
- Active lease count
- Expired lease count
- Date validation failures
- Database query performance
- Average response time

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/leases/*`
- **PropertyService** (Port 5001) - Validates property_id references
- **TenantService** (Port 5003) - Validates tenant_id references
- **PaymentService** (Port 5005) - Creates payment schedules based on leases
- **AuthService** (Port 5000) - Provides authentication

## Support

For issues:
1. Check logs in console
2. Verify configuration in `appsettings.json`
3. Test with Swagger UI
4. Check database connectivity
5. Verify sample data is loaded
6. Ensure PropertyService and TenantService are running
7. Validate lease dates are correct

---

**Service Status:** ✅ Production Ready

**Last Updated:** January 2025
