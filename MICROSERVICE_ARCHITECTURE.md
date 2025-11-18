# Real Estate Management System - Microservice Architecture

## Architecture Overview

This document outlines the complete microservice architecture for the Real Estate Management System.

## Services Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Frontend (React)                               │
│                        http://localhost:3001                            │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     API Gateway         │
                    │  http://localhost:8080  │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
    ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐
    │  Auth  │  │Property│  │ Owner  │  │ Tenant │  │ Lease  │  │Payment │  │Maintain│
    │Service │  │Service │  │Service │  │Service │  │Service │  │Service │  │Service │
    │:5000   │  │:5001   │  │:5002   │  │:5003   │  │:5004   │  │:5005   │  │:5006   │
    └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘
         │           │           │           │           │           │           │
    ┌────▼─────┬────▼─────┬─────▼─────┬─────▼─────┬─────▼─────┬─────▼─────┬─────▼─────┐
    │  auth_db │property_ │  owner_db │  tenant_  │  lease_db │  payment_ │maintenance│
    │          │    db    │           │    db     │           │    db     │    _db    │
    └──────────┴──────────┴───────────┴───────────┴───────────┴───────────┴───────────┘
```

## Services Breakdown

### 1. Auth Service (Port: 5000)
- **Database**: `auth_db`
- **Responsibilities**: User authentication, JWT token management, Asgardeo integration
- **Tables**: users, auth_tokens, refresh_tokens
- **Status**: ✅ Implemented

### 2. Property Service (Port: 5001)
- **Database**: `property_db`
- **Responsibilities**: Property CRUD, property search, property statistics
- **Tables**: properties
- **Fields**: Address, Type, Size, Bedrooms, Bathrooms, Rent, Status, Owner ID
- **Status**: 🔨 Creating

### 3. Owner Service (Port: 5002)
- **Database**: `owner_db`
- **Responsibilities**: Owner profile management, owner statistics
- **Tables**: owners
- **Fields**: Name, Email, Phone, Address
- **Status**: 🔨 Creating

### 4. Tenant Service (Port: 5003)
- **Database**: `tenant_db`
- **Responsibilities**: Tenant profile management, tenant history
- **Tables**: tenants
- **Fields**: Name, Email, Phone, Emergency Contact
- **Status**: 🔨 Creating

### 5. Lease Service (Port: 5004)
- **Database**: `lease_db`
- **Responsibilities**: Lease agreements, lease status tracking
- **Tables**: leases
- **Fields**: Property ID, Tenant ID, Start Date, End Date, Rent, Security Deposit, Status
- **Status**: 🔨 Creating

### 6. Payment Service (Port: 5005)
- **Database**: `payment_db`
- **Responsibilities**: Payment tracking, payment history, payment reminders
- **Tables**: payments
- **Fields**: Lease ID, Amount, Due Date, Paid Date, Status, Method
- **Status**: 🔨 Creating

### 7. Maintenance Service (Port: 5006)
- **Database**: `maintenance_db`
- **Responsibilities**: Maintenance requests, work orders, status tracking
- **Tables**: maintenance_requests
- **Fields**: Property ID, Title, Description, Status, Priority, Reported Date
- **Status**: 🔨 Creating

## Database Architecture

Each service has its own MySQL database:

```sql
-- 7 Separate Databases
real_estate_auth_db        -- Auth Service
real_estate_property_db    -- Property Service
real_estate_owner_db       -- Owner Service
real_estate_tenant_db      -- Tenant Service
real_estate_lease_db       -- Lease Service
real_estate_payment_db     -- Payment Service
real_estate_maintenance_db -- Maintenance Service
```

## Port Allocation

| Service | Port | Database | API Path |
|---------|------|----------|----------|
| Auth Service | 5000 | auth_db | /api/auth/* |
| Property Service | 5001 | property_db | /api/properties/* |
| Owner Service | 5002 | owner_db | /api/owners/* |
| Tenant Service | 5003 | tenant_db | /api/tenants/* |
| Lease Service | 5004 | lease_db | /api/leases/* |
| Payment Service | 5005 | payment_db | /api/payments/* |
| Maintenance Service | 5006 | maintenance_db | /api/maintenance/* |
| API Gateway | 8080 | - | /api/* |

## Communication Patterns

### Synchronous (REST)
- Frontend → API Gateway → Microservices
- Service-to-Service calls for immediate data needs

### Asynchronous (Events) - Future
- RabbitMQ/Kafka for event-driven communication
- Events: PropertyCreated, LeaseCreated, PaymentReceived, etc.

## Data Relationships

```
Owner (1) ──────< (M) Property
Property (1) ────< (M) Lease ────> (1) Tenant
Lease (1) ───────< (M) Payment
Property (1) ────< (M) MaintenanceRequest
```

**Note**: Relationships are managed via IDs, not foreign keys across databases.

## API Gateway Routes

The API Gateway will route requests to appropriate services:

```javascript
/api/auth/*        → Auth Service (5000)
/api/properties/*  → Property Service (5001)
/api/owners/*      → Owner Service (5002)
/api/tenants/*     → Tenant Service (5003)
/api/leases/*      → Lease Service (5004)
/api/payments/*    → Payment Service (5005)
/api/maintenance/* → Maintenance Service (5006)
```

## Technology Stack

### Backend
- .NET 8.0 Web API
- Entity Framework Core 8.0
- MySQL with Pomelo driver
- JWT Bearer authentication
- Swagger/OpenAPI documentation

### Database
- MySQL 8.0+
- Separate database per service
- Connection pooling
- Indexed queries for performance

### Frontend
- React 18.2.0
- TypeScript
- Axios for HTTP
- React Router
- Asgardeo OIDC

## Deployment Strategy

### Development
```bash
# Start all services in separate terminals
cd AuthService.API && dotnet run
cd PropertyService.API && dotnet run
cd OwnerService.API && dotnet run
cd TenantService.API && dotnet run
cd LeaseService.API && dotnet run
cd PaymentService.API && dotnet run
cd MaintenanceService.API && dotnet run
```

### Production
- Docker containers for each service
- Docker Compose for orchestration
- Nginx as reverse proxy
- MySQL replicas for scalability

## Security

### Authentication Flow
1. User logs in via Asgardeo (Auth Service)
2. Auth Service returns JWT token
3. Frontend includes JWT in all requests
4. API Gateway validates JWT
5. Gateway forwards authenticated requests to services

### Authorization
- JWT contains user ID and roles
- Each service validates permissions
- Admin-only operations protected

## Monitoring & Logging

- Centralized logging with Serilog
- Health checks on each service
- Metrics collection (requests, latency, errors)
- Swagger UI for API documentation

## Next Steps

1. ✅ Auth Service implemented
2. 🔨 Implement remaining 6 microservices
3. 🔨 Create API Gateway with YARP
4. 🔨 Add dummy data to all databases
5. 🔨 Improve dashboard UI
6. 🔨 Add inter-service communication
7. 🔨 Implement Docker containers
8. 🔨 Add monitoring and logging

## File Structure

```
asgardeo-react-frontendapp/
├── AuthService.API/              ✅ Done
├── PropertyService.API/          🔨 Creating
├── OwnerService.API/             🔨 Creating
├── TenantService.API/            🔨 Creating
├── LeaseService.API/             🔨 Creating
├── PaymentService.API/           🔨 Creating
├── MaintenanceService.API/       🔨 Creating
├── APIGateway/                   🔨 Creating
├── database/
│   ├── auth/                     ✅ Done
│   ├── property/                 🔨 Creating
│   ├── owner/                    🔨 Creating
│   ├── tenant/                   🔨 Creating
│   ├── lease/                    🔨 Creating
│   ├── payment/                  🔨 Creating
│   └── maintenance/              🔨 Creating
└── src/                          (React Frontend)
```

## Benefits of This Architecture

✅ **Scalability**: Each service can scale independently
✅ **Maintainability**: Clear separation of concerns
✅ **Resilience**: Failure in one service doesn't affect others
✅ **Technology Flexibility**: Each service can use different tech if needed
✅ **Team Organization**: Teams can work on services independently
✅ **Deployment**: Deploy services independently
✅ **Database Isolation**: No shared database, better data security
