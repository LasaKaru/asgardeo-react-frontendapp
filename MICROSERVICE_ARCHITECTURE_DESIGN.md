# Microservice Architecture Design Guide
## Based on Frontend Codebase Analysis

---

## 1. Proposed Microservice Breakdown

### Service 1: Property Management Service
**Responsibility**: Manage property data and metadata

**Data Model**:
```typescript
Property {
  propertyId: number
  addressLine1: string
  city: string
  stateProvince: string
  zipCode: string
  country: string
  propertyType: Enum[Apartment|House|Condo|Townhouse|Office|Retail]
  sizeSqFt: number
  bedrooms: number
  bathrooms: number
  rentAmount: number (LKR)
  ownerId: number (FK to Owner Service)
  status: Enum[Available|Occupied|Maintenance]
  createdAt: timestamp
  updatedAt: timestamp
}
```

**API Endpoints**:
```
GET    /api/properties                    - List all properties
POST   /api/properties                    - Create property
GET    /api/properties/{id}               - Get property details
PUT    /api/properties/{id}               - Update property
DELETE /api/properties/{id}               - Delete property
GET    /api/properties?status=Available   - Filter by status
GET    /api/properties?owner={ownerId}    - Filter by owner
```

**Events Published**:
- `PropertyCreated` - When new property is created
- `PropertyUpdated` - When property is modified
- `PropertyDeleted` - When property is deleted
- `PropertyStatusChanged` - When property status changes

**Events Consumed**:
- `OwnerDeleted` - To handle cascading deletes

---

### Service 2: Owner Management Service
**Responsibility**: Manage owner profiles and information

**Data Model**:
```typescript
Owner {
  ownerId: number
  firstName: string
  lastName: string
  email: string (unique)
  phone: string
  address: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**API Endpoints**:
```
GET    /api/owners                        - List all owners
POST   /api/owners                        - Create owner
GET    /api/owners/{id}                   - Get owner details
PUT    /api/owners/{id}                   - Update owner
DELETE /api/owners/{id}                   - Delete owner
GET    /api/owners/{id}/properties        - Get owner's properties (calls Property Service)
```

**Events Published**:
- `OwnerCreated` - When new owner is created
- `OwnerUpdated` - When owner is modified
- `OwnerDeleted` - When owner is deleted
- `OwnerContactChanged` - When contact info updates

**Events Consumed**:
- None directly

---

### Service 3: Tenant Management Service
**Responsibility**: Manage tenant profiles and information

**Data Model**:
```typescript
Tenant {
  tenantId: number
  firstName: string
  lastName: string
  email: string (unique)
  phone: string
  address: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**API Endpoints**:
```
GET    /api/tenants                       - List all tenants
POST   /api/tenants                       - Create tenant
GET    /api/tenants/{id}                  - Get tenant details
PUT    /api/tenants/{id}                  - Update tenant
DELETE /api/tenants/{id}                  - Delete tenant
GET    /api/tenants/{id}/leases           - Get tenant's leases
GET    /api/tenants/{id}/payments         - Get tenant's payments
```

**Events Published**:
- `TenantCreated` - When new tenant is created
- `TenantUpdated` - When tenant is modified
- `TenantDeleted` - When tenant is deleted
- `TenantContactChanged` - When contact info updates

**Events Consumed**:
- `LeaseTerminated` - To track tenant status

---

### Service 4: Lease Management Service
**Responsibility**: Manage lease agreements and contracts

**Data Model**:
```typescript
Lease {
  leaseId: number
  propertyId: number (FK to Property Service)
  tenantId: number (FK to Tenant Service)
  startDate: date
  endDate: date
  monthlyRent: number (LKR)
  securityDeposit: number (LKR)
  status: Enum[Active|Expired|Terminated]
  createdAt: timestamp
  updatedAt: timestamp
}
```

**API Endpoints**:
```
GET    /api/leases                        - List all leases
POST   /api/leases                        - Create lease
GET    /api/leases/{id}                   - Get lease details
PUT    /api/leases/{id}                   - Update lease
DELETE /api/leases/{id}                   - Delete lease
GET    /api/leases?status=Active          - Get active leases
GET    /api/leases/{id}/payments          - Get payments for lease
GET    /api/leases/property/{propertyId}  - Get leases for property
GET    /api/leases/tenant/{tenantId}      - Get leases for tenant
```

**Service-to-Service Calls**:
- Property Service: Validate propertyId, get property details
- Tenant Service: Validate tenantId, get tenant details
- Payment Service: Get associated payments

**Events Published**:
- `LeaseCreated` - When new lease is created
- `LeaseUpdated` - When lease is modified
- `LeaseStatusChanged` - When lease status changes (Active/Expired/Terminated)
- `LeaseTerminated` - When lease ends
- `LeaseExpiringSoon` - 30 days before expiration

**Events Consumed**:
- `PropertyStatusChanged` - To update lease status if property becomes unavailable
- `TenantDeleted` - To handle cascading operations

---

### Service 5: Payment Management Service
**Responsibility**: Process and track rent payments

**Data Model**:
```typescript
Payment {
  paymentId: number
  leaseId: number (FK to Lease Service)
  amount: number (LKR)
  paymentDate: date
  paymentMethod: Enum[Bank Transfer|Cash|Check|Credit Card|Online Payment]
  status: Enum[Pending|Completed|Failed|Refunded]
  notes: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
  processedAt: timestamp (nullable)
}
```

**API Endpoints**:
```
GET    /api/payments                      - List all payments
POST   /api/payments                      - Create/record payment
GET    /api/payments/{id}                 - Get payment details
PUT    /api/payments/{id}                 - Update payment
DELETE /api/payments/{id}                 - Delete payment (admin only)
GET    /api/payments?status=Completed     - Get completed payments
GET    /api/payments/lease/{leaseId}      - Get payments for lease
GET    /api/payments?from=date&to=date    - Get payments by date range
```

**Service-to-Service Calls**:
- Lease Service: Validate leaseId, get lease details (property/tenant info)

**Events Published**:
- `PaymentCreated` - When payment is recorded
- `PaymentCompleted` - When payment is successfully processed
- `PaymentFailed` - When payment processing fails
- `PaymentRefunded` - When payment is refunded
- `RentPaid` - When payment is confirmed

**Events Consumed**:
- `LeaseTerminated` - To close related payments

---

### Service 6: Maintenance Management Service
**Responsibility**: Manage maintenance requests and work orders

**Data Model**:
```typescript
MaintenanceRequest {
  requestId: number
  propertyId: number (FK to Property Service)
  title: string
  description: string
  status: Enum[Submitted|In Progress|Completed|Cancelled]
  priority: Enum[Low|Medium|High|Urgent]
  resolutionNotes: string (optional)
  requestedDate: date
  completionDate: date (nullable)
  estimatedCost: number (LKR, optional)
  actualCost: number (LKR, optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**API Endpoints**:
```
GET    /api/requests                      - List all maintenance requests
POST   /api/requests                      - Create maintenance request
GET    /api/requests/{id}                 - Get request details
PUT    /api/requests/{id}                 - Update request
DELETE /api/requests/{id}                 - Delete request
GET    /api/requests?status=In Progress   - Filter by status
GET    /api/requests/property/{propertyId} - Get requests for property
GET    /api/requests?priority=High        - Filter by priority
```

**Service-to-Service Calls**:
- Property Service: Validate propertyId, get property details

**Events Published**:
- `MaintenanceRequested` - When request is submitted
- `MaintenanceStarted` - When work begins
- `MaintenanceCompleted` - When work is completed
- `MaintenanceCancelled` - When request is cancelled
- `UrgentMaintenanceNeeded` - For urgent requests

**Events Consumed**:
- `PropertyStatusChanged` - To update maintenance status

---

### Service 7: Notification Service
**Responsibility**: Send notifications across the system

**Events Consumed**:
- `LeaseCreated` - Send lease confirmation to tenant
- `LeaseTerminated` - Send lease termination notice
- `LeaseExpiringSoon` - Send renewal reminder
- `PaymentCreated` - Send payment receipt
- `PaymentFailed` - Send payment failure alert
- `MaintenanceRequested` - Send request confirmation
- `MaintenanceCompleted` - Send completion notification
- `PropertyStatusChanged` - Notify relevant parties

**Notification Methods**:
- Email
- SMS (optional)
- In-app notifications

---

### Service 8: Dashboard/Reporting Service (Optional)
**Responsibility**: Aggregate data from other services for dashboard display

**Data Aggregated**:
- Total Properties (from Property Service)
- Total Tenants (from Tenant Service)
- Active Leases (from Lease Service)
- Pending Maintenance (from Maintenance Service)
- Recent Payments (from Payment Service)
- Activity Log (from event stream)

**API Endpoints**:
```
GET    /api/dashboard/summary             - Get dashboard statistics
GET    /api/dashboard/activity            - Get recent activity
GET    /api/dashboard/reports/revenue     - Revenue reports
GET    /api/dashboard/reports/occupancy   - Occupancy rates
```

---

## 2. API Gateway Routing Configuration

```
Frontend Request -> API Gateway -> Route to appropriate microservice

/api/properties/*      -> Property Service (port 8001)
/api/owners/*          -> Owner Service (port 8002)
/api/tenants/*         -> Tenant Service (port 8003)
/api/leases/*          -> Lease Service (port 8004)
/api/payments/*        -> Payment Service (port 8005)
/api/requests/*        -> Maintenance Service (port 8006)
/api/dashboard/*       -> Dashboard Service (port 8007)
```

---

## 3. Data Flow Patterns

### Pattern 1: Property Creation Flow
```
Frontend
  |
  v
API Gateway: POST /api/properties
  |
  v
Property Service
  |
  +--> Validate input
  |
  +--> Save to database
  |
  +--> Publish: PropertyCreated event
  |
  v
Event Bus
  |
  +--> Dashboard Service (update stats)
  +--> Notification Service (optional)
```

### Pattern 2: Lease Creation Flow (Cross-Service)
```
Frontend
  |
  v
API Gateway: POST /api/leases
  |
  v
Lease Service
  |
  +--> Validate input
  |
  +--> Call Property Service: GET /properties/{propertyId}
  |
  +--> Call Tenant Service: GET /tenants/{tenantId}
  |
  +--> Save to database
  |
  +--> Publish: LeaseCreated event
  |
  v
Event Bus
  |
  +--> Notification Service (send confirmation to tenant)
  +--> Dashboard Service (update stats)
  +--> Payment Service (prepare for rent collection)
```

### Pattern 3: Payment Recording with Saga Pattern
```
Frontend
  |
  v
API Gateway: POST /api/payments
  |
  v
Payment Service (Saga Orchestrator)
  |
  +--> Create Payment record (status: Pending)
  |
  +--> Call Lease Service: GET /leases/{leaseId}
  |
  +--> Process Payment (call external payment gateway)
  |
  +--> If success:
  |    +--> Update Payment status: Completed
  |    +--> Publish: PaymentCompleted event
  |    +--> Call Notification Service: Send receipt
  |
  +--> If failure:
       +--> Update Payment status: Failed
       +--> Publish: PaymentFailed event
       +--> Call Notification Service: Send failure alert
```

---

## 4. Service-to-Service Communication

### Synchronous (REST/gRPC):
- Property Service -> Lease validation
- Tenant Service -> Lease validation
- Lease Service -> Payment validation
- Lease Service -> Maintenance updates

### Asynchronous (Event-Based):
- Property Service publishes PropertyCreated
- Lease Service publishes LeaseCreated
- Payment Service publishes PaymentCompleted
- Maintenance Service publishes MaintenanceCompleted
- All services subscribe to relevant domain events

---

## 5. Database Strategy

### Per-Service Database Pattern
Each microservice has its own database:

```
Property Service    -> properties_db
Owner Service       -> owners_db
Tenant Service      -> tenants_db
Lease Service       -> leases_db
Payment Service     -> payments_db
Maintenance Service -> maintenance_db
```

### Foreign Key References
- Use IDs only for foreign keys (no direct database joins)
- Use API calls or service-to-service queries for joins
- Denormalize data when performance requires

---

## 6. Resilience & Failure Handling

### Circuit Breaker Pattern
Implement for all inter-service calls:
```
- Open: Service is down, fail fast
- Half-Open: Try one request to test recovery
- Closed: Service is healthy, allow requests
```

### Retry Logic
```
- Exponential backoff: 100ms, 200ms, 400ms, 800ms
- Max retries: 3
- Apply to idempotent operations only
```

### Fallback Strategies
```
Property Service dependent calls:
  - Cache property data locally
  - Use stale data if service unavailable

Lease Service payments:
  - Queue payments for processing
  - Notify admin if service unavailable
```

---

## 7. Frontend Integration Changes

### Current State
```javascript
// Monolithic API calls
apiService.getProperties()
apiService.getLeases()
apiService.getPayments()
```

### Future State
```javascript
// API Gateway routes
GET /api/properties         -> Property Service
GET /api/leases             -> Lease Service
GET /api/payments           -> Payment Service

// Frontend makes calls to API Gateway
// API Gateway routes to appropriate service
```

### No Changes Required to Frontend Code
- Frontend continues to use same `/api/*` endpoints
- API Gateway handles routing transparently
- Frontend becomes service-agnostic

---

## 8. Monitoring & Observability

### Metrics to Track
- **Property Service**: Properties created/updated/deleted
- **Payment Service**: Payment volume, success rates
- **Lease Service**: Active leases, renewal rate
- **Maintenance Service**: Request volume, resolution time

### Distributed Tracing
- Trace requests across service boundaries
- Use correlation IDs for request tracking
- Log service-to-service calls

### Health Checks
```
/health              - Basic health check
/health/ready        - Readiness check
/health/live         - Liveness check
```

---

## 9. Deployment Architecture

### Service Deployment
```
Docker Containers:
  - Property Service Container
  - Owner Service Container
  - Tenant Service Container
  - Lease Service Container
  - Payment Service Container
  - Maintenance Service Container
  - API Gateway Container
  - Notification Service Container

Orchestration:
  - Kubernetes or Docker Swarm
  - Service mesh (Istio/Consul) optional
```

### Configuration Management
```
Environment Variables:
  - DATABASE_URL
  - MESSAGE_BROKER_URL
  - SERVICE_REGISTRY_URL
  - LOG_LEVEL
  - ENVIRONMENT (dev|staging|prod)
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. Set up API Gateway
2. Create base microservice template
3. Implement authentication/authorization
4. Set up event bus/message broker

### Phase 2: Core Services (Week 3-6)
1. Implement Property Service
2. Implement Owner Service
3. Implement Tenant Service
4. Set up inter-service communication

### Phase 3: Dependent Services (Week 7-10)
1. Implement Lease Service with orchestration
2. Implement Payment Service with saga pattern
3. Implement Maintenance Service

### Phase 4: Support Services (Week 11-12)
1. Implement Notification Service
2. Implement Dashboard Service
3. Testing and optimization

### Phase 5: Migration (Week 13+)
1. Deploy to production
2. Gradual traffic migration
3. Monitor and optimize

