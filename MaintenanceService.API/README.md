# Maintenance Service

## Overview

The **Maintenance Service** is responsible for managing maintenance requests, work orders, priority tracking, and property maintenance history in the real estate management system.

## Port

**5006**

## Database

**Database Name:** `real_estate_maintenance_db`

**Tables:**
- `maintenance_requests` - Maintenance requests and work orders

## Features

✅ **Maintenance Request Management**
- Create new maintenance requests
- Update request details
- Delete maintenance records
- View request details
- List all maintenance requests

✅ **Priority Tracking**
- Low priority
- Medium priority
- High priority
- Emergency priority

✅ **Status Management**
- Open requests
- In Progress work orders
- Completed maintenance
- Cancelled requests

✅ **Property Integration**
- Link maintenance to properties
- Track maintenance history per property
- Property maintenance analytics

✅ **Assignment Management**
- Assign to maintenance staff
- Track assigned technicians
- Work order management

## API Endpoints

### Maintenance Request Management

#### GET `/api/maintenance`
Get all maintenance requests

**Query Parameters:**
- `propertyId` - Filter by property
- `status` - Filter by status
- `priority` - Filter by priority
- `assignedTo` - Filter by assigned technician

**Response:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "title": "Leaking Faucet",
    "description": "Kitchen faucet is dripping continuously",
    "status": "Completed",
    "priority": "Medium",
    "reportedDate": "2024-11-01",
    "completedDate": "2024-11-02",
    "assignedTo": "John Plumber",
    "notes": "Replaced faucet washer",
    "createdAt": "2024-11-01T00:00:00Z",
    "updatedAt": "2024-11-02T00:00:00Z"
  }
]
```

#### GET `/api/maintenance/{id}`
Get maintenance request by ID

**Response:**
```json
{
  "id": 1,
  "propertyId": 1,
  "title": "Leaking Faucet",
  "description": "Kitchen faucet is dripping continuously",
  "status": "Completed",
  "priority": "Medium",
  "reportedDate": "2024-11-01",
  "completedDate": "2024-11-02",
  "assignedTo": "John Plumber",
  "notes": "Replaced faucet washer",
  "createdAt": "2024-11-01T00:00:00Z",
  "updatedAt": "2024-11-02T00:00:00Z"
}
```

#### POST `/api/maintenance`
Create new maintenance request (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "propertyId": 5,
  "title": "Broken Window",
  "description": "Living room window cracked, needs replacement",
  "status": "Open",
  "priority": "High",
  "reportedDate": "2025-01-18",
  "completedDate": null,
  "assignedTo": null,
  "notes": "Tenant reported during inspection"
}
```

**Response:**
```json
{
  "id": 21,
  "propertyId": 5,
  "title": "Broken Window",
  "description": "Living room window cracked, needs replacement",
  "status": "Open",
  "priority": "High",
  "reportedDate": "2025-01-18",
  "completedDate": null,
  "assignedTo": null,
  "notes": "Tenant reported during inspection",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:30:00Z"
}
```

#### PUT `/api/maintenance/{id}`
Update maintenance request (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "propertyId": 5,
  "title": "Broken Window",
  "description": "Living room window cracked, needs replacement",
  "status": "In Progress",
  "priority": "High",
  "reportedDate": "2025-01-18",
  "completedDate": null,
  "assignedTo": "Mike Handyman",
  "notes": "Assigned to Mike - Window ordered"
}
```

**Response:**
```json
{
  "id": 21,
  "propertyId": 5,
  "title": "Broken Window",
  "description": "Living room window cracked, needs replacement",
  "status": "In Progress",
  "priority": "High",
  "reportedDate": "2025-01-18",
  "completedDate": null,
  "assignedTo": "Mike Handyman",
  "notes": "Assigned to Mike - Window ordered",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T11:00:00Z"
}
```

#### DELETE `/api/maintenance/{id}`
Delete maintenance request (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Maintenance request deleted successfully"
}
```

#### GET `/api/maintenance/property/{propertyId}`
Get all maintenance requests for a property

**Response:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "title": "Leaking Faucet",
    "description": "Kitchen faucet is dripping continuously",
    "status": "Completed",
    "priority": "Medium",
    "reportedDate": "2024-11-01",
    "completedDate": "2024-11-02",
    "assignedTo": "John Plumber",
    "notes": "Replaced faucet washer"
  }
]
```

#### GET `/api/maintenance/status/{status}`
Get all maintenance requests by status

**Response:**
```json
[
  {
    "id": 15,
    "propertyId": 8,
    "title": "HVAC Not Working",
    "description": "Heating system not turning on",
    "status": "Open",
    "priority": "Emergency",
    "reportedDate": "2024-12-15",
    "completedDate": null,
    "assignedTo": null,
    "notes": "Urgent - Winter season"
  }
]
```

#### GET `/api/maintenance/priority/{priority}`
Get all maintenance requests by priority

**Response:**
```json
[
  {
    "id": 15,
    "propertyId": 8,
    "title": "HVAC Not Working",
    "description": "Heating system not turning on",
    "status": "Open",
    "priority": "Emergency",
    "reportedDate": "2024-12-15",
    "completedDate": null,
    "assignedTo": null,
    "notes": "Urgent - Winter season"
  }
]
```

#### GET `/api/maintenance/open`
Get all open maintenance requests

**Response:**
```json
[
  {
    "id": 15,
    "propertyId": 8,
    "title": "HVAC Not Working",
    "description": "Heating system not turning on",
    "status": "Open",
    "priority": "Emergency",
    "reportedDate": "2024-12-15",
    "completedDate": null,
    "assignedTo": null,
    "notes": "Urgent - Winter season"
  }
]
```

#### GET `/api/maintenance/assigned/{technician}`
Get all maintenance requests assigned to a technician

**Response:**
```json
[
  {
    "id": 10,
    "propertyId": 5,
    "title": "Broken Window",
    "description": "Living room window cracked",
    "status": "In Progress",
    "priority": "High",
    "reportedDate": "2024-12-01",
    "completedDate": null,
    "assignedTo": "Mike Handyman",
    "notes": "Window replacement in progress"
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
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_maintenance_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp"
  },
  "ServiceUrls": {
    "PropertyService": "http://localhost:5001"
  },
  "MaintenanceSettings": {
    "EmergencyResponseTime": 2,
    "HighPriorityResponseTime": 24,
    "MediumPriorityResponseTime": 72,
    "LowPriorityResponseTime": 168
  }
}
```

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_maintenance_db` created and migrated
- AuthService running (for authentication)
- PropertyService running (for property validation)

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < maintenance/01_create_maintenance_db.sql
mysql -u root -p < maintenance/02_insert_sample_maintenance.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd MaintenanceService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5006**

### Verify Service is Running

```bash
curl http://localhost:5006/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5006/swagger**

## Testing

### Test Get All Maintenance Requests (with cURL)

```bash
curl -X GET http://localhost:5006/api/maintenance
```

### Test Get Maintenance Request by ID

```bash
curl -X GET http://localhost:5006/api/maintenance/1
```

### Test Get Maintenance by Property

```bash
curl -X GET http://localhost:5006/api/maintenance/property/1
```

### Test Get Open Maintenance Requests

```bash
curl -X GET http://localhost:5006/api/maintenance/open
```

### Test Get Maintenance by Status

```bash
# Get all open requests
curl -X GET http://localhost:5006/api/maintenance/status/Open

# Get all in-progress requests
curl -X GET http://localhost:5006/api/maintenance/status/In%20Progress

# Get all completed requests
curl -X GET http://localhost:5006/api/maintenance/status/Completed
```

### Test Get Maintenance by Priority

```bash
# Get emergency requests
curl -X GET http://localhost:5006/api/maintenance/priority/Emergency

# Get high priority requests
curl -X GET http://localhost:5006/api/maintenance/priority/High

# Get medium priority requests
curl -X GET http://localhost:5006/api/maintenance/priority/Medium

# Get low priority requests
curl -X GET http://localhost:5006/api/maintenance/priority/Low
```

### Test Get Maintenance by Technician

```bash
curl -X GET http://localhost:5006/api/maintenance/assigned/John%20Plumber
```

### Test Search Maintenance

```bash
# Search by property
curl -X GET "http://localhost:5006/api/maintenance?propertyId=1"

# Search by status
curl -X GET "http://localhost:5006/api/maintenance?status=Open"

# Search by priority
curl -X GET "http://localhost:5006/api/maintenance?priority=High"

# Search by assigned technician
curl -X GET "http://localhost:5006/api/maintenance?assignedTo=Mike%20Handyman"
```

### Test Create Maintenance Request

```bash
curl -X POST http://localhost:5006/api/maintenance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "propertyId": 3,
    "title": "Clogged Drain",
    "description": "Bathroom sink draining very slowly",
    "status": "Open",
    "priority": "Low",
    "reportedDate": "2025-01-18",
    "completedDate": null,
    "assignedTo": null,
    "notes": "Non-urgent repair needed"
  }'
```

### Test Update Maintenance Request

```bash
curl -X PUT http://localhost:5006/api/maintenance/15 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "propertyId": 8,
    "title": "HVAC Not Working",
    "description": "Heating system not turning on",
    "status": "Completed",
    "priority": "Emergency",
    "reportedDate": "2024-12-15",
    "completedDate": "2024-12-15",
    "assignedTo": "HVAC Specialist",
    "notes": "Fixed thermostat wiring - System operational"
  }'
```

### Test Delete Maintenance Request

```bash
curl -X DELETE http://localhost:5006/api/maintenance/20 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/MaintenanceController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/MaintenanceService.cs**
   - Business logic for maintenance management
   - Priority tracking
   - Status management
   - Assignment logic

3. **Data/MaintenanceDbContext.cs**
   - Entity Framework database context
   - Database access

4. **Models/**
   - MaintenanceRequest.cs - Maintenance request entity

## Database Schema

### maintenance_requests table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| property_id | INT | Foreign key to Property Service |
| title | VARCHAR(200) | Request title/summary |
| description | TEXT | Detailed description |
| status | VARCHAR(50) | Request status |
| priority | VARCHAR(50) | Priority level |
| reported_date | DATE | Date reported |
| completed_date | DATE | Date completed (nullable) |
| assigned_to | VARCHAR(200) | Assigned technician (nullable) |
| notes | TEXT | Additional notes |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Sample Data

The database includes 20 sample maintenance requests:
- **10 Completed requests** - Historical data
- **5 In Progress requests** - Active work orders
- **5 Open requests** - Pending assignment

Priority Distribution:
- **2 Emergency** - Immediate response required
- **5 High** - 24-hour response time
- **8 Medium** - 72-hour response time
- **5 Low** - 1-week response time

Common Request Types:
- Plumbing issues (leaks, clogs)
- HVAC problems (heating, cooling)
- Electrical issues (outlets, lights)
- Appliance repairs (dishwasher, etc.)
- Structural issues (doors, windows)
- General maintenance (painting, cleaning)

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
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_maintenance_db';"
```

### No Maintenance Requests Returned

**Error:** Empty array returned from GET /api/maintenance

**Solution:**
```bash
# Check if sample data is loaded
mysql -u root -p real_estate_maintenance_db -e "SELECT COUNT(*) FROM maintenance_requests;"

# Load sample data if needed
mysql -u root -p < database/maintenance/02_insert_sample_maintenance.sql
```

### Invalid Property ID

**Error:** Property not found

**Solution:**
1. Ensure PropertyService is running on port 5001
2. Verify property_id exists in PropertyService
3. Check property is valid

### Invalid Status

**Error:** Invalid status value

**Solution:**
Valid status values:
- Open
- In Progress
- Completed
- Cancelled

### Invalid Priority

**Error:** Invalid priority value

**Solution:**
Valid priority values:
- Emergency
- High
- Medium
- Low

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
# Find process using port 5006
lsof -i :5006

# Kill the process
kill -9 <PID>
```

### Date Validation Error

**Error:** Invalid dates

**Solution:**
1. Reported date is required
2. Completed date can be null for open/in-progress requests
3. Completed date should not be before reported date
4. Date format: YYYY-MM-DD

### Assignment Not Found

**Error:** No requests for technician

**Solution:**
1. Check technician name spelling
2. Verify technician has assigned requests
3. Check assignment is not null

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_maintenance_db;..."
export JwtSettings__Secret="your-production-secret"
export ServiceUrls__PropertyService="https://property-service.example.com"
export MaintenanceSettings__EmergencyResponseTime="2"
export MaintenanceSettings__HighPriorityResponseTime="24"
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
- Maintenance request creation rate
- Open request count
- Emergency request count
- Average completion time
- Response time by priority
- Technician workload
- Database query performance
- Average response time

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/maintenance/*`
- **PropertyService** (Port 5001) - Validates property_id references, provides property details
- **AuthService** (Port 5000) - Provides authentication

## Support

For issues:
1. Check logs in console
2. Verify configuration in `appsettings.json`
3. Test with Swagger UI
4. Check database connectivity
5. Verify sample data is loaded
6. Ensure PropertyService is running
7. Validate priority and status values
8. Check technician assignments

---

**Service Status:** ✅ Production Ready

**Last Updated:** January 2025
