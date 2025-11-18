# Owner Service

## Overview

The **Owner Service** is responsible for managing property owner profiles, contact information, and owner-related data in the real estate management system.

## Port

**5002**

## Database

**Database Name:** `real_estate_owner_db`

**Tables:**
- `owners` - Owner profile information

## Features

✅ **Owner Management**
- Create new owner profiles
- Update owner information
- Delete owner records
- View owner details
- List all owners

✅ **Contact Information**
- Store complete contact details
- Email addresses
- Phone numbers
- Physical addresses

✅ **Profile Validation**
- Email format validation
- Phone number validation
- Unique email enforcement
- Required field validation

✅ **Multi-Property Support**
- Single owner can own multiple properties
- Track all properties per owner
- Owner-property relationship management

## API Endpoints

### Owner Management

#### GET `/api/owners`
Get all owners

**Query Parameters:**
- `email` - Filter by email
- `lastName` - Filter by last name
- `city` - Filter by city
- `state` - Filter by state

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "(555) 123-4567",
    "address": "789 Owner Blvd, San Francisco, CA 94105",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### GET `/api/owners/{id}`
Get owner by ID

**Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "(555) 123-4567",
  "address": "789 Owner Blvd, San Francisco, CA 94105",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### POST `/api/owners`
Create new owner (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "(555) 987-6543",
  "address": "456 Property Lane, Los Angeles, CA 90001"
}
```

**Response:**
```json
{
  "id": 11,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "(555) 987-6543",
  "address": "456 Property Lane, Los Angeles, CA 90001",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:30:00Z"
}
```

#### PUT `/api/owners/{id}`
Update owner (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.j@example.com",
  "phone": "(555) 987-6543",
  "address": "789 New Address St, Los Angeles, CA 90001"
}
```

**Response:**
```json
{
  "id": 11,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.j@example.com",
  "phone": "(555) 987-6543",
  "address": "789 New Address St, Los Angeles, CA 90001",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:35:00Z"
}
```

#### DELETE `/api/owners/{id}`
Delete owner (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Owner deleted successfully"
}
```

#### GET `/api/owners/email/{email}`
Get owner by email

**Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "(555) 123-4567",
  "address": "789 Owner Blvd, San Francisco, CA 94105",
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
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_owner_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp"
  }
}
```

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_owner_db` created and migrated
- AuthService running (for authentication)

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < owner/01_create_owner_db.sql
mysql -u root -p < owner/02_insert_sample_owners.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd OwnerService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5002**

### Verify Service is Running

```bash
curl http://localhost:5002/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5002/swagger**

## Testing

### Test Get All Owners (with cURL)

```bash
curl -X GET http://localhost:5002/api/owners
```

### Test Get Owner by ID

```bash
curl -X GET http://localhost:5002/api/owners/1
```

### Test Get Owner by Email

```bash
curl -X GET http://localhost:5002/api/owners/email/john.smith@example.com
```

### Test Search Owners

```bash
# Search by last name
curl -X GET "http://localhost:5002/api/owners?lastName=Smith"

# Search by email
curl -X GET "http://localhost:5002/api/owners?email=john.smith@example.com"
```

### Test Create Owner

```bash
curl -X POST http://localhost:5002/api/owners \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Michael",
    "lastName": "Brown",
    "email": "michael.brown@example.com",
    "phone": "(555) 111-2222",
    "address": "123 Main St, Seattle, WA 98101"
  }'
```

### Test Update Owner

```bash
curl -X PUT http://localhost:5002/api/owners/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith.updated@example.com",
    "phone": "(555) 123-4567",
    "address": "789 Owner Blvd, San Francisco, CA 94105"
  }'
```

### Test Delete Owner

```bash
curl -X DELETE http://localhost:5002/api/owners/10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/OwnersController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/OwnerService.cs**
   - Business logic for owner management
   - Validation logic
   - Email uniqueness checks

3. **Data/OwnerDbContext.cs**
   - Entity Framework database context
   - Database access

4. **Models/**
   - Owner.cs - Owner entity

## Database Schema

### owners table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| first_name | VARCHAR(100) | Owner's first name |
| last_name | VARCHAR(100) | Owner's last name |
| email | VARCHAR(255) | Email address (unique) |
| phone | VARCHAR(20) | Phone number |
| address | VARCHAR(500) | Physical address |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Sample Data

The database includes 10 sample owners:
- **4 owners** in San Francisco, CA
- **3 owners** in Los Angeles, CA
- **2 owners** in Seattle, WA
- **1 owner** in Austin, TX

All owners have:
- Complete contact information
- Valid email addresses
- Phone numbers
- Physical addresses

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
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_owner_db';"
```

### No Owners Returned

**Error:** Empty array returned from GET /api/owners

**Solution:**
```bash
# Check if sample data is loaded
mysql -u root -p real_estate_owner_db -e "SELECT COUNT(*) FROM owners;"

# Load sample data if needed
mysql -u root -p < database/owner/02_insert_sample_owners.sql
```

### Duplicate Email Error

**Error:** Email already exists

**Solution:**
1. Each owner must have a unique email address
2. Check if email is already registered
3. Use different email or update existing owner

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
# Find process using port 5002
lsof -i :5002

# Kill the process
kill -9 <PID>
```

### Invalid Email Format

**Error:** Email validation failed

**Solution:**
1. Ensure email follows format: user@domain.com
2. Check for special characters
3. Verify email length is within limits

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_owner_db;..."
export JwtSettings__Secret="your-production-secret"
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
- Owner creation rate
- Email uniqueness violations
- Database query performance
- Average response time

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/owners/*`
- **PropertyService** (Port 5001) - References owners via owner_id
- **AuthService** (Port 5000) - Provides authentication

## Support

For issues:
1. Check logs in console
2. Verify configuration in `appsettings.json`
3. Test with Swagger UI
4. Check database connectivity
5. Verify sample data is loaded

---

**Service Status:** ✅ Production Ready

**Last Updated:** January 2025
