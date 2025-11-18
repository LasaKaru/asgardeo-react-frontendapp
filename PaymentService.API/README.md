# Payment Service

## Overview

The **Payment Service** is responsible for managing rent payments, payment tracking, payment history, revenue calculations, and financial transaction records in the real estate management system.

## Port

**5005**

## Database

**Database Name:** `real_estate_payment_db`

**Tables:**
- `payments` - Payment records and transaction details

## Features

✅ **Payment Management**
- Create new payment records
- Update payment details
- Delete payment records
- View payment details
- List all payments

✅ **Payment Tracking**
- Track payment status (Paid, Pending, Overdue)
- Due date management
- Paid date tracking
- Payment history

✅ **Payment Methods**
- Credit Card
- Bank Transfer
- Check
- Cash
- Online Payment

✅ **Financial Reporting**
- Revenue calculations
- Payment history by lease
- Overdue payment tracking
- Payment analytics

✅ **Lease Integration**
- Link payments to leases
- Auto-generate payment schedules
- Track lease payment history

## API Endpoints

### Payment Management

#### GET `/api/payments`
Get all payments

**Query Parameters:**
- `leaseId` - Filter by lease
- `status` - Filter by payment status
- `paymentMethod` - Filter by payment method
- `startDate` - Filter by due date start
- `endDate` - Filter by due date end

**Response:**
```json
[
  {
    "id": 1,
    "leaseId": 1,
    "amount": 3500.00,
    "dueDate": "2024-01-01",
    "paidDate": "2024-01-01",
    "status": "Paid",
    "paymentMethod": "Bank Transfer",
    "notes": "First month's rent",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET `/api/payments/{id}`
Get payment by ID

**Response:**
```json
{
  "id": 1,
  "leaseId": 1,
  "amount": 3500.00,
  "dueDate": "2024-01-01",
  "paidDate": "2024-01-01",
  "status": "Paid",
  "paymentMethod": "Bank Transfer",
  "notes": "First month's rent",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### POST `/api/payments`
Create new payment (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "leaseId": 5,
  "amount": 4200.00,
  "dueDate": "2025-02-01",
  "paidDate": null,
  "status": "Pending",
  "paymentMethod": "Credit Card",
  "notes": "February 2025 rent"
}
```

**Response:**
```json
{
  "id": 26,
  "leaseId": 5,
  "amount": 4200.00,
  "dueDate": "2025-02-01",
  "paidDate": null,
  "status": "Pending",
  "paymentMethod": "Credit Card",
  "notes": "February 2025 rent",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-01-18T10:30:00Z"
}
```

#### PUT `/api/payments/{id}`
Update payment (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Request:**
```json
{
  "leaseId": 5,
  "amount": 4200.00,
  "dueDate": "2025-02-01",
  "paidDate": "2025-02-01",
  "status": "Paid",
  "paymentMethod": "Credit Card",
  "notes": "February 2025 rent - Paid on time"
}
```

**Response:**
```json
{
  "id": 26,
  "leaseId": 5,
  "amount": 4200.00,
  "dueDate": "2025-02-01",
  "paidDate": "2025-02-01",
  "status": "Paid",
  "paymentMethod": "Credit Card",
  "notes": "February 2025 rent - Paid on time",
  "createdAt": "2025-01-18T10:30:00Z",
  "updatedAt": "2025-02-01T09:15:00Z"
}
```

#### DELETE `/api/payments/{id}`
Delete payment (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Payment deleted successfully"
}
```

#### GET `/api/payments/lease/{leaseId}`
Get all payments for a lease

**Response:**
```json
[
  {
    "id": 1,
    "leaseId": 1,
    "amount": 3500.00,
    "dueDate": "2024-01-01",
    "paidDate": "2024-01-01",
    "status": "Paid",
    "paymentMethod": "Bank Transfer",
    "notes": "First month's rent"
  }
]
```

#### GET `/api/payments/overdue`
Get all overdue payments

**Response:**
```json
[
  {
    "id": 15,
    "leaseId": 8,
    "amount": 2200.00,
    "dueDate": "2024-12-01",
    "paidDate": null,
    "status": "Overdue",
    "paymentMethod": "Check",
    "notes": "December 2024 rent - OVERDUE"
  }
]
```

#### GET `/api/payments/pending`
Get all pending payments

**Response:**
```json
[
  {
    "id": 20,
    "leaseId": 3,
    "amount": 2600.00,
    "dueDate": "2025-02-01",
    "paidDate": null,
    "status": "Pending",
    "paymentMethod": "Bank Transfer",
    "notes": "February 2025 rent"
  }
]
```

#### GET `/api/payments/revenue`
Calculate total revenue

**Query Parameters:**
- `startDate` - Start date for revenue calculation
- `endDate` - End date for revenue calculation

**Response:**
```json
{
  "totalRevenue": 85000.00,
  "paidAmount": 72000.00,
  "pendingAmount": 10000.00,
  "overdueAmount": 3000.00,
  "paymentCount": 25,
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
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
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_payment_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp"
  },
  "ServiceUrls": {
    "LeaseService": "http://localhost:5004"
  },
  "PaymentSettings": {
    "OverdueDays": 5,
    "SendReminders": true,
    "ReminderDaysBefore": 3
  }
}
```

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_payment_db` created and migrated
- AuthService running (for authentication)
- LeaseService running (for lease validation)

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < payment/01_create_payment_db.sql
mysql -u root -p < payment/02_insert_sample_payments.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd PaymentService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5005**

### Verify Service is Running

```bash
curl http://localhost:5005/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5005/swagger**

## Testing

### Test Get All Payments (with cURL)

```bash
curl -X GET http://localhost:5005/api/payments
```

### Test Get Payment by ID

```bash
curl -X GET http://localhost:5005/api/payments/1
```

### Test Get Payments by Lease

```bash
curl -X GET http://localhost:5005/api/payments/lease/1
```

### Test Get Overdue Payments

```bash
curl -X GET http://localhost:5005/api/payments/overdue
```

### Test Get Pending Payments

```bash
curl -X GET http://localhost:5005/api/payments/pending
```

### Test Revenue Calculation

```bash
curl -X GET "http://localhost:5005/api/payments/revenue?startDate=2024-01-01&endDate=2024-12-31"
```

### Test Search Payments

```bash
# Search by status
curl -X GET "http://localhost:5005/api/payments?status=Paid"

# Search by lease
curl -X GET "http://localhost:5005/api/payments?leaseId=1"

# Search by payment method
curl -X GET "http://localhost:5005/api/payments?paymentMethod=Bank%20Transfer"

# Search by date range
curl -X GET "http://localhost:5005/api/payments?startDate=2024-01-01&endDate=2024-12-31"
```

### Test Create Payment

```bash
curl -X POST http://localhost:5005/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "leaseId": 3,
    "amount": 2600.00,
    "dueDate": "2025-03-01",
    "paidDate": null,
    "status": "Pending",
    "paymentMethod": "Online Payment",
    "notes": "March 2025 rent"
  }'
```

### Test Update Payment (Mark as Paid)

```bash
curl -X PUT http://localhost:5005/api/payments/20 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "leaseId": 3,
    "amount": 2600.00,
    "dueDate": "2025-02-01",
    "paidDate": "2025-02-01",
    "status": "Paid",
    "paymentMethod": "Bank Transfer",
    "notes": "February 2025 rent - Paid"
  }'
```

### Test Delete Payment

```bash
curl -X DELETE http://localhost:5005/api/payments/25 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/PaymentsController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/PaymentService.cs**
   - Business logic for payment management
   - Payment status tracking
   - Revenue calculations
   - Overdue payment detection

3. **Data/PaymentDbContext.cs**
   - Entity Framework database context
   - Database access

4. **Models/**
   - Payment.cs - Payment entity

## Database Schema

### payments table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| lease_id | INT | Foreign key to Lease Service |
| amount | DECIMAL(10,2) | Payment amount |
| due_date | DATE | Payment due date |
| paid_date | DATE | Actual payment date (nullable) |
| status | VARCHAR(50) | Payment status |
| payment_method | VARCHAR(50) | Method of payment |
| notes | TEXT | Additional notes |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Sample Data

The database includes 25 sample payments:
- **15 Paid payments** - Completed transactions
- **7 Pending payments** - Awaiting payment
- **3 Overdue payments** - Past due date

Payment characteristics:
- Various amounts ($2,200 - $4,800)
- Different payment methods
- Monthly payment schedules
- Complete payment history

Payment Methods Distribution:
- Bank Transfer: 10 payments
- Credit Card: 8 payments
- Check: 4 payments
- Cash: 2 payments
- Online Payment: 1 payment

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
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_payment_db';"
```

### No Payments Returned

**Error:** Empty array returned from GET /api/payments

**Solution:**
```bash
# Check if sample data is loaded
mysql -u root -p real_estate_payment_db -e "SELECT COUNT(*) FROM payments;"

# Load sample data if needed
mysql -u root -p < database/payment/02_insert_sample_payments.sql
```

### Invalid Lease ID

**Error:** Lease not found

**Solution:**
1. Ensure LeaseService is running on port 5004
2. Verify lease_id exists in LeaseService
3. Check lease is active

### Invalid Payment Amount

**Error:** Amount must be greater than 0

**Solution:**
1. Payment amount must be positive
2. Check decimal precision (2 decimal places)
3. Verify amount matches lease rent

### Date Validation Error

**Error:** Invalid payment dates

**Solution:**
1. Due date is required
2. Paid date can be null for pending payments
3. Date format should be YYYY-MM-DD
4. Paid date should not be before due date in most cases

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
# Find process using port 5005
lsof -i :5005

# Kill the process
kill -9 <PID>
```

### Revenue Calculation Error

**Error:** Invalid date range

**Solution:**
1. Provide valid start and end dates
2. Start date must be before end date
3. Date format: YYYY-MM-DD

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_payment_db;..."
export JwtSettings__Secret="your-production-secret"
export ServiceUrls__LeaseService="https://lease-service.example.com"
export PaymentSettings__OverdueDays="5"
export PaymentSettings__SendReminders="true"
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
- Payment creation rate
- Payment success rate
- Overdue payment count
- Revenue totals
- Payment method distribution
- Database query performance
- Average response time

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/payments/*`
- **LeaseService** (Port 5004) - Validates lease_id references, provides lease details
- **AuthService** (Port 5000) - Provides authentication

## Support

For issues:
1. Check logs in console
2. Verify configuration in `appsettings.json`
3. Test with Swagger UI
4. Check database connectivity
5. Verify sample data is loaded
6. Ensure LeaseService is running
7. Validate payment amounts and dates

---

**Service Status:** ✅ Production Ready

**Last Updated:** January 2025
