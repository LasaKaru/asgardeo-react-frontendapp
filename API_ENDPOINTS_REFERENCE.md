# API Endpoints Reference

## Quick Reference Guide for All Frontend API Calls

---

## Authentication

### Asgardeo Configuration
```
Client ID: 7ECNndE2MeBYuyhGquKQcbAKGvAa
Base URL: https://api.asgardeo.io/t/googlextech
Redirect URL: http://localhost:3001/dashboard
Scope: openid, profile
```

---

## Base Configuration
```
API Base URL: /api
Timeout: 10 seconds
Content-Type: application/json
CORS: withCredentials enabled
```

---

## Properties Endpoints

### List All Properties
```
GET /api/properties
Response: Property[]
```

**Frontend Usage**:
```typescript
apiService.getProperties()
```

### Get Single Property
```
GET /api/properties/{id}
Response: Property
```

**Frontend Usage**:
```typescript
apiService.getProperty(id)
```

### Create Property
```
POST /api/properties
Content-Type: application/json

Request Body:
{
  propertyId: 0,
  addressLine1: string (required),
  city: string (required),
  stateProvince: string,
  zipCode: string (required),
  country: string (default: "Sri Lanka"),
  propertyType: Enum[Apartment|House|Condo|Townhouse|Office|Retail] (required),
  sizeSqFt: number,
  bedrooms: number,
  bathrooms: number,
  rentAmount: number (required),
  ownerId: number
}

Response: Property
```

**Frontend Usage**:
```typescript
apiService.createProperty(propertyData)
```

### Update Property
```
PUT /api/properties/{id}
Content-Type: application/json

Request Body: Property object (same as create)
Response: Property
```

**Frontend Usage**:
```typescript
apiService.updateProperty(id, propertyData)
```

### Delete Property
```
DELETE /api/properties/{id}
Response: Success message
```

**Frontend Usage**:
```typescript
apiService.deleteProperty(id)
```

---

## Owners Endpoints

### List All Owners
```
GET /api/owners
Response: Owner[]
```

**Frontend Usage**:
```typescript
apiService.getOwners()
```

### Get Single Owner
```
GET /api/owners/{id}
Response: Owner
```

**Frontend Usage**:
```typescript
apiService.getOwner(id)
```

### Create Owner
```
POST /api/owners
Content-Type: application/json

Request Body:
{
  firstName: string (required),
  lastName: string (required),
  email: string (required, validated),
  phone: string (optional)
}

Response: Owner { ownerId, firstName, lastName, email, phone }
```

**Frontend Usage**:
```typescript
apiService.createOwner(ownerData)
```

### Update Owner
```
PUT /api/owners/{id}
Content-Type: application/json

Request Body:
{
  ownerId: number,
  firstName: string (required),
  lastName: string (required),
  email: string (required, validated),
  phone: string (optional)
}

Response: Owner
```

**Frontend Usage**:
```typescript
apiService.updateOwner(id, ownerData)
```

### Delete Owner
```
DELETE /api/owners/{id}
Response: Success message
```

**Frontend Usage**:
```typescript
apiService.deleteOwner(id)
```

---

## Tenants Endpoints

### List All Tenants
```
GET /api/tenants
Response: Tenant[]
```

**Frontend Usage**:
```typescript
apiService.getTenants()
```

### Get Single Tenant
```
GET /api/tenants/{id}
Response: Tenant
```

**Frontend Usage**:
```typescript
apiService.getTenant(id)
```

### Create Tenant
```
POST /api/tenants
Content-Type: application/json

Request Body:
{
  firstName: string (required),
  lastName: string (required),
  email: string (required, validated),
  phone: string (optional)
}

Response: Tenant { tenantId, firstName, lastName, email, phone }
```

**Frontend Usage**:
```typescript
apiService.createTenant(tenantData)
```

### Update Tenant
```
PUT /api/tenants/{id}
Content-Type: application/json

Request Body:
{
  tenantId: number,
  firstName: string (required),
  lastName: string (required),
  email: string (required, validated),
  phone: string (optional)
}

Response: Tenant
```

**Frontend Usage**:
```typescript
apiService.updateTenant(id, tenantData)
```

### Delete Tenant
```
DELETE /api/tenants/{id}
Response: Success message
```

**Frontend Usage**:
```typescript
apiService.deleteTenant(id)
```

---

## Leases Endpoints

### List All Leases
```
GET /api/leases
Response: Lease[]

Returned data includes nested:
  - property: { propertyId, addressLine1, city, ... }
  - tenant: { tenantId, firstName, lastName, ... }
```

**Frontend Usage**:
```typescript
apiService.getLeases()
```

### Get Single Lease
```
GET /api/leases/{id}
Response: Lease (with nested property and tenant)
```

**Frontend Usage**:
```typescript
apiService.getLease(id)
```

### Create Lease
```
POST /api/leases
Content-Type: application/json

Request Body:
{
  leaseId: 0,
  propertyId: number (required),
  tenantId: number (required),
  startDate: ISO date string (required),
  endDate: ISO date string (required, must be after startDate),
  monthlyRent: number (required, LKR),
  securityDeposit: number (optional, LKR),
  status: Enum[Active|Expired|Terminated] (default: Active)
}

Response: Lease
```

**Frontend Usage**:
```typescript
apiService.createLease(leaseData)
```

### Update Lease
```
PUT /api/leases/{id}
Content-Type: application/json

Request Body: Lease object (same as create)
Response: Lease
```

**Frontend Usage**:
```typescript
apiService.updateLease(id, leaseData)
```

### Delete Lease
```
DELETE /api/leases/{id}
Response: Success message
```

**Frontend Usage**:
```typescript
apiService.deleteLease(id)
```

---

## Payments Endpoints

### List All Payments
```
GET /api/payments
Response: Payment[]

Returned data includes nested:
  - lease: { 
      leaseId, 
      property: { propertyId, addressLine1, city, ... },
      tenant: { tenantId, firstName, lastName, ... }
    }
```

**Frontend Usage**:
```typescript
apiService.getPayments()
```

### Get Single Payment
```
GET /api/payments/{id}
Response: Payment (with nested lease, property, tenant)
```

**Frontend Usage**:
```typescript
apiService.getPayment(id)
```

### Create Payment
```
POST /api/payments
Content-Type: application/json

Request Body:
{
  paymentId: 0,
  leaseId: number (required),
  amount: number (required, LKR, must be > 0),
  paymentDate: ISO date string (required),
  paymentMethod: Enum[Bank Transfer|Cash|Check|Credit Card|Online Payment] (required),
  status: Enum[Pending|Completed|Failed|Refunded] (default: Completed),
  notes: string (optional)
}

Response: Payment
```

**Frontend Usage**:
```typescript
apiService.createPayment(paymentData)
```

### Update Payment
```
PUT /api/payments/{id}
Content-Type: application/json

Request Body: Payment object (same as create)
Response: Payment
```

**Frontend Usage**:
```typescript
apiService.updatePayment(id, paymentData)
```

### Delete Payment
```
DELETE /api/payments/{id}
Response: Success message
```

**Frontend Usage**:
```typescript
apiService.deletePayment(id)
```

---

## Maintenance Requests Endpoints

### List All Maintenance Requests
```
GET /api/requests
Response: MaintenanceRequest[]

Returned data includes nested:
  - property: { propertyId, addressLine1, city, ... }
```

**Frontend Usage**:
```typescript
apiService.getMaintenanceRequests()
```

### Get Single Request
```
GET /api/requests/{id}
Response: MaintenanceRequest (with nested property)
```

**Frontend Usage**:
```typescript
apiService.getMaintenanceRequest(id)
```

### Create Maintenance Request
```
POST /api/requests
Content-Type: application/json

Request Body:
{
  requestId: 0,
  propertyId: number (required),
  title: string (required),
  description: string (required),
  status: Enum[Submitted|In Progress|Completed|Cancelled] (default: Submitted),
  priority: Enum[Low|Medium|High|Urgent] (default: Medium),
  resolutionNotes: string (optional)
}

Response: MaintenanceRequest
```

**Frontend Usage**:
```typescript
apiService.createMaintenanceRequest(requestData)
```

### Update Maintenance Request
```
PUT /api/requests/{id}
Content-Type: application/json

Request Body: MaintenanceRequest object (same as create)
Response: MaintenanceRequest
```

**Frontend Usage**:
```typescript
apiService.updateMaintenanceRequest(id, requestData)
```

### Delete Maintenance Request
```
DELETE /api/requests/{id}
Response: Success message
```

**Frontend Usage**:
```typescript
apiService.deleteMaintenanceRequest(id)
```

---

## Error Responses

### HTTP Status Codes
```
200 OK              - Request successful
201 Created         - Resource created
400 Bad Request     - Invalid input
401 Unauthorized    - Authentication required
403 Forbidden       - Authorization failed
404 Not Found       - Resource not found
409 Conflict        - Resource conflict (duplicate, etc.)
500 Server Error    - Internal server error
```

### Error Response Format
```json
{
  "message": "Error description",
  "status": 400,
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

### Frontend Error Handling
```typescript
// Interceptor handles 401 redirects to /login
// CORS errors logged to console
// Generic error messages shown in UI
```

---

## Data Type Reference

### Enums

**PropertyType**:
- Apartment
- House
- Condo
- Townhouse
- Office
- Retail

**LeaseStatus**:
- Active
- Expired
- Terminated

**PaymentMethod**:
- Bank Transfer
- Cash
- Check
- Credit Card
- Online Payment

**PaymentStatus**:
- Pending
- Completed
- Failed
- Refunded

**MaintenanceStatus**:
- Submitted
- In Progress
- Completed
- Cancelled

**MaintenancePriority**:
- Low
- Medium
- High
- Urgent

---

## Data Transformation Notes

### Frontend transforms API responses:

**Property Display**:
```
API returns: propertyId, addressLine1, city, ...
Frontend displays: Name (address line + city), full address
```

**Person Display** (Owner/Tenant):
```
API returns: firstName, lastName
Frontend displays: "firstName lastName"
```

**Date Display**:
```
API returns: ISO string (2023-06-15T10:30:00Z)
Frontend displays: Formatted date (6/15/2023)
Amount displays: With currency symbol (LKR ...)
```

---

## Testing Endpoints

### Using curl:

```bash
# Get all properties
curl -X GET http://localhost:3001/api/properties

# Create owner
curl -X POST http://localhost:3001/api/owners \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }'

# Update property
curl -X PUT http://localhost:3001/api/properties/1 \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": 1,
    "addressLine1": "123 Main St",
    "city": "Colombo",
    ...
  }'

# Delete lease
curl -X DELETE http://localhost:3001/api/leases/1
```

---

## API Service Methods (`/src/services/api.ts`)

All exported methods:

```typescript
// Properties
apiService.getProperties()
apiService.getProperty(id)
apiService.createProperty(property)
apiService.updateProperty(id, property)
apiService.deleteProperty(id)

// Owners
apiService.getOwners()
apiService.getOwner(id)
apiService.createOwner(owner)
apiService.updateOwner(id, owner)
apiService.deleteOwner(id)

// Tenants
apiService.getTenants()
apiService.getTenant(id)
apiService.createTenant(tenant)
apiService.updateTenant(id, tenant)
apiService.deleteTenant(id)

// Leases
apiService.getLeases()
apiService.getLease(id)
apiService.createLease(lease)
apiService.updateLease(id, lease)
apiService.deleteLease(id)

// Payments
apiService.getPayments()
apiService.getPayment(id)
apiService.createPayment(payment)
apiService.updatePayment(id, payment)
apiService.deletePayment(id)

// Maintenance
apiService.getMaintenanceRequests()
apiService.getMaintenanceRequest(id)
apiService.createMaintenanceRequest(request)
apiService.updateMaintenanceRequest(id, request)
apiService.deleteMaintenanceRequest(id)
```

