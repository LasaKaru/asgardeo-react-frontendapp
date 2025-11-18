# Property Service

## Overview

The **Property Service** is responsible for managing property listings, property details, search functionality, and owner relationships in the real estate management system.

## Port

**5001**

## Database

**Database Name:** `real_estate_property_db`

**Tables:**
- `properties` - Property listings and details
- `property_images` - Property images (optional)

## Features

✅ **Property Management**
- Create new property listings
- Update property details
- Delete properties
- View property details
- List all properties

✅ **Property Search**
- Search by city, state, zip code
- Filter by property type
- Filter by bedrooms/bathrooms
- Filter by rent amount range
- Filter by availability status

✅ **Owner Relationship**
- Link properties to owners
- Track owner_id for each property
- Multi-property ownership support

✅ **Property Types**
- Single Family Home
- Apartment
- Condo
- Townhouse
- Multi-Family

✅ **Status Management**
- Available
- Rented
- Under Maintenance
- Unavailable

## API Endpoints

### Property Management

#### GET `/api/properties`
Get all properties

**Query Parameters:**
- `city` - Filter by city
- `state` - Filter by state
- `propertyType` - Filter by type
- `minRent` - Minimum rent amount
- `maxRent` - Maximum rent amount
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms
- `status` - Property status

**Response:**
```json
[
  {
    "id": 1,
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "squareFeet": 1200,
    "rentAmount": 3500.00,
    "status": "Available",
    "ownerId": 1,
    "description": "Beautiful 2BR apartment in downtown SF",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### GET `/api/properties/{id}`
Get property by ID

**Response:**
```json
{
  "id": 1,
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "propertyType": "Apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "squareFeet": 1200,
  "rentAmount": 3500.00,
  "status": "Available",
  "ownerId": 1,
  "description": "Beautiful 2BR apartment in downtown SF",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### POST `/api/properties`
Create new property (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "propertyType": "Single Family Home",
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "rentAmount": 4200.00,
  "status": "Available",
  "ownerId": 2,
  "description": "Spacious 3BR home with backyard"
}
```

**Response:**
```json
{
  "id": 16,
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "propertyType": "Single Family Home",
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "rentAmount": 4200.00,
  "status": "Available",
  "ownerId": 2,
  "description": "Spacious 3BR home with backyard",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:30:00Z"
}
```

#### PUT `/api/properties/{id}`
Update property (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "propertyType": "Single Family Home",
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "rentAmount": 4500.00,
  "status": "Rented",
  "ownerId": 2,
  "description": "Spacious 3BR home with backyard"
}
```

**Response:**
```json
{
  "id": 16,
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "propertyType": "Single Family Home",
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "rentAmount": 4500.00,
  "status": "Rented",
  "ownerId": 2,
  "description": "Spacious 3BR home with backyard",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:35:00Z"
}
```

#### DELETE `/api/properties/{id}`
Delete property (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Property deleted successfully"
}
```

#### GET `/api/properties/owner/{ownerId}`
Get all properties by owner ID

**Response:**
```json
[
  {
    "id": 1,
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "squareFeet": 1200,
    "rentAmount": 3500.00,
    "status": "Available",
    "ownerId": 1,
    "description": "Beautiful 2BR apartment in downtown SF"
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
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_property_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp"
  },
  "ServiceUrls": {
    "OwnerService": "http://localhost:5002"
  }
}
```

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_property_db` created and migrated
- AuthService running (for authentication)

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < property/01_create_property_db.sql
mysql -u root -p < property/02_insert_sample_properties.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd PropertyService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5001**

### Verify Service is Running

```bash
curl http://localhost:5001/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5001/swagger**

## Testing

### Test Get All Properties (with cURL)

```bash
curl -X GET http://localhost:5001/api/properties
```

### Test Get Property by ID

```bash
curl -X GET http://localhost:5001/api/properties/1
```

### Test Search Properties

```bash
# Search by city
curl -X GET "http://localhost:5001/api/properties?city=San%20Francisco"

# Search by property type
curl -X GET "http://localhost:5001/api/properties?propertyType=Apartment"

# Search by rent range
curl -X GET "http://localhost:5001/api/properties?minRent=2000&maxRent=4000"

# Search by bedrooms
curl -X GET "http://localhost:5001/api/properties?bedrooms=2"
```

### Test Create Property

```bash
curl -X POST http://localhost:5001/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "address": "789 Pine St",
    "city": "Seattle",
    "state": "WA",
    "zipCode": "98101",
    "propertyType": "Condo",
    "bedrooms": 2,
    "bathrooms": 1,
    "squareFeet": 1000,
    "rentAmount": 2800.00,
    "status": "Available",
    "ownerId": 3,
    "description": "Modern condo in downtown Seattle"
  }'
```

### Test Update Property

```bash
curl -X PUT http://localhost:5001/api/properties/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "squareFeet": 1200,
    "rentAmount": 3800.00,
    "status": "Rented",
    "ownerId": 1,
    "description": "Beautiful 2BR apartment in downtown SF"
  }'
```

### Test Delete Property

```bash
curl -X DELETE http://localhost:5001/api/properties/15 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/PropertiesController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/PropertyService.cs**
   - Business logic for property management
   - Property search and filtering
   - Validation logic

3. **Data/PropertyDbContext.cs**
   - Entity Framework database context
   - Database access

4. **Models/**
   - Property.cs - Property entity

## Database Schema

### properties table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| address | VARCHAR(500) | Property street address |
| city | VARCHAR(100) | City |
| state | VARCHAR(50) | State |
| zip_code | VARCHAR(20) | ZIP/Postal code |
| property_type | VARCHAR(50) | Type of property |
| bedrooms | INT | Number of bedrooms |
| bathrooms | DECIMAL(3,1) | Number of bathrooms |
| square_feet | INT | Property size in sq ft |
| rent_amount | DECIMAL(10,2) | Monthly rent amount |
| status | VARCHAR(50) | Property status |
| owner_id | INT | Foreign key to Owner Service |
| description | TEXT | Property description |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Sample Data

The database includes 15 sample properties:
- **5 properties** in San Francisco, CA
- **5 properties** in Los Angeles, CA
- **3 properties** in Seattle, WA
- **2 properties** in Austin, TX

Property types:
- Apartments
- Single Family Homes
- Condos
- Townhouses

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
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_property_db';"
```

### No Properties Returned

**Error:** Empty array returned from GET /api/properties

**Solution:**
```bash
# Check if sample data is loaded
mysql -u root -p real_estate_property_db -e "SELECT COUNT(*) FROM properties;"

# Load sample data if needed
mysql -u root -p < database/property/02_insert_sample_properties.sql
```

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
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>
```

### Owner Not Found

**Error:** Invalid owner_id

**Solution:**
1. Verify owner exists in OwnerService
2. Check owner_id is valid
3. Ensure OwnerService is running on port 5002

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_property_db;..."
export JwtSettings__Secret="your-production-secret"
export ServiceUrls__OwnerService="https://owner-service.example.com"
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
- Property creation rate
- Search query performance
- Database query performance
- Average response time

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/properties/*`
- **OwnerService** (Port 5002) - Validates owner_id references
- **LeaseService** (Port 5004) - Links properties to leases
- **MaintenanceService** (Port 5006) - Links properties to maintenance requests
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
