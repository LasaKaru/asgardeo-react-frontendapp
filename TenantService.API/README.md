# Tenant Service

## Overview

The **Tenant Service** is responsible for managing tenant profiles, contact information, emergency contacts, and tenant-related data in the real estate management system.

## Port

**5003**

## Database

**Database Name:** `real_estate_tenant_db`

**Tables:**
- `tenants` - Tenant profile and emergency contact information

## Features

✅ **Tenant Management**
- Create new tenant profiles
- Update tenant information
- Delete tenant records
- View tenant details
- List all tenants

✅ **Contact Information**
- Store complete contact details
- Email addresses
- Phone numbers
- Emergency contact information

✅ **Emergency Contacts**
- Emergency contact name
- Emergency contact phone
- Critical for safety compliance

✅ **Profile Validation**
- Email format validation
- Phone number validation
- Unique email enforcement
- Required field validation

✅ **Lease Integration**
- Track tenant-lease relationships
- Support multiple leases per tenant
- Historical lease data

## API Endpoints

### Tenant Management

#### GET `/api/tenants`
Get all tenants

**Query Parameters:**
- `email` - Filter by email
- `lastName` - Filter by last name
- `phone` - Filter by phone

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phone": "(555) 101-1001",
    "emergencyContact": "Bob Johnson",
    "emergencyPhone": "(555) 101-1002",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### GET `/api/tenants/{id}`
Get tenant by ID

**Response:**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "(555) 101-1001",
  "emergencyContact": "Bob Johnson",
  "emergencyPhone": "(555) 101-1002",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### POST `/api/tenants`
Create new tenant (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "firstName": "Emily",
  "lastName": "Davis",
  "email": "emily.davis@example.com",
  "phone": "(555) 201-2001",
  "emergencyContact": "James Davis",
  "emergencyPhone": "(555) 201-2002"
}
```

**Response:**
```json
{
  "id": 13,
  "firstName": "Emily",
  "lastName": "Davis",
  "email": "emily.davis@example.com",
  "phone": "(555) 201-2001",
  "emergencyContact": "James Davis",
  "emergencyPhone": "(555) 201-2002",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:30:00Z"
}
```

#### PUT `/api/tenants/{id}`
Update tenant (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "firstName": "Emily",
  "lastName": "Davis",
  "email": "emily.d@example.com",
  "phone": "(555) 201-2001",
  "emergencyContact": "James Davis",
  "emergencyPhone": "(555) 201-2003"
}
```

**Response:**
```json
{
  "id": 13,
  "firstName": "Emily",
  "lastName": "Davis",
  "email": "emily.d@example.com",
  "phone": "(555) 201-2001",
  "emergencyContact": "James Davis",
  "emergencyPhone": "(555) 201-2003",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:35:00Z"
}
```

#### DELETE `/api/tenants/{id}`
Delete tenant (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Tenant deleted successfully"
}
```

#### GET `/api/tenants/email/{email}`
Get tenant by email

**Response:**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phone": "(555) 101-1001",
  "emergencyContact": "Bob Johnson",
  "emergencyPhone": "(555) 101-1002",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
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
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_tenant_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp"
  },
  "ServiceUrls": {
    "LeaseService": "http://localhost:5004"
  }
}
```

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_tenant_db` created and migrated
- AuthService running (for authentication)

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < tenant/01_create_tenant_db.sql
mysql -u root -p < tenant/02_insert_sample_tenants.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd TenantService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5003**

### Verify Service is Running

```bash
curl http://localhost:5003/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5003/swagger**

## Testing

### Test Get All Tenants (with cURL)

```bash
curl -X GET http://localhost:5003/api/tenants
```

### Test Get Tenant by ID

```bash
curl -X GET http://localhost:5003/api/tenants/1
```

### Test Get Tenant by Email

```bash
curl -X GET http://localhost:5003/api/tenants/email/alice.johnson@example.com
```

### Test Search Tenants

```bash
# Search by last name
curl -X GET "http://localhost:5003/api/tenants?lastName=Johnson"

# Search by email
curl -X GET "http://localhost:5003/api/tenants?email=alice.johnson@example.com"

# Search by phone
curl -X GET "http://localhost:5003/api/tenants?phone=(555)%20101-1001"
```

### Test Create Tenant

```bash
curl -X POST http://localhost:5003/api/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Robert",
    "lastName": "Martinez",
    "email": "robert.martinez@example.com",
    "phone": "(555) 301-3001",
    "emergencyContact": "Maria Martinez",
    "emergencyPhone": "(555) 301-3002"
  }'
```

### Test Update Tenant

```bash
curl -X PUT http://localhost:5003/api/tenants/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.j.updated@example.com",
    "phone": "(555) 101-1001",
    "emergencyContact": "Bob Johnson",
    "emergencyPhone": "(555) 101-1002"
  }'
```

### Test Delete Tenant

```bash
curl -X DELETE http://localhost:5003/api/tenants/12 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/TenantsController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/TenantService.cs**
   - Business logic for tenant management
   - Validation logic
   - Email uniqueness checks

3. **Data/TenantDbContext.cs**
   - Entity Framework database context
   - Database access

4. **Models/**
   - Tenant.cs - Tenant entity

## Database Schema

### tenants table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| first_name | VARCHAR(100) | Tenant's first name |
| last_name | VARCHAR(100) | Tenant's last name |
| email | VARCHAR(255) | Email address (unique) |
| phone | VARCHAR(20) | Phone number |
| emergency_contact | VARCHAR(200) | Emergency contact name |
| emergency_phone | VARCHAR(20) | Emergency contact phone |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Sample Data

The database includes 12 sample tenants:
- Complete contact information
- Valid email addresses
- Phone numbers
- Emergency contact details
- Ready for lease assignments

Tenant diversity:
- Various first and last names
- Different contact information
- Emergency contacts provided

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
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_tenant_db';"
```

### No Tenants Returned

**Error:** Empty array returned from GET /api/tenants

**Solution:**
```bash
# Check if sample data is loaded
mysql -u root -p real_estate_tenant_db -e "SELECT COUNT(*) FROM tenants;"

# Load sample data if needed
mysql -u root -p < database/tenant/02_insert_sample_tenants.sql
```

### Duplicate Email Error

**Error:** Email already exists

**Solution:**
1. Each tenant must have a unique email address
2. Check if email is already registered
3. Use different email or update existing tenant

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
# Find process using port 5003
lsof -i :5003

# Kill the process
kill -9 <PID>
```

### Missing Emergency Contact

**Error:** Emergency contact required

**Solution:**
1. Emergency contact name is required
2. Emergency contact phone is required
3. Both fields must be provided for safety compliance

### Invalid Email Format

**Error:** Email validation failed

**Solution:**
1. Ensure email follows format: user@domain.com
2. Check for special characters
3. Verify email length is within limits

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_tenant_db;..."
export JwtSettings__Secret="your-production-secret"
export ServiceUrls__LeaseService="https://lease-service.example.com"
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
- Tenant creation rate
- Email uniqueness violations
- Database query performance
- Average response time

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/tenants/*`
- **LeaseService** (Port 5004) - References tenants via tenant_id
- **AuthService** (Port 5000) - Provides authentication

## Support

For issues:
1. Check logs in console
2. Verify configuration in `appsettings.json`
3. Test with Swagger UI
4. Check database connectivity
5. Verify sample data is loaded
6. Ensure emergency contact information is complete

---

**Service Status:** ✅ Production Ready

**Last Updated:** January 2025
