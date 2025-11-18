# Frontend Codebase Exploration Report
## Real Estate Management System - React Frontend

### Executive Summary
The frontend is a React-based application using Asgardeo for authentication, with 7 main feature modules managing properties, owners, tenants, leases, payments, and maintenance requests. All data is persisted via a RESTful API backend with base URL configured as `/api`.

---

## 1. Architecture Overview

### Technology Stack
- **Framework**: React with TypeScript
- **Authentication**: Asgardeo (OIDC) + Custom Auth Context
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **UI Framework**: MUI (Material-UI)
- **Base URL**: Configured in `/src/config.json` as `/api`

### Project Structure
```
src/
├── pages/           # Page components (Dashboard, Properties, Tenants, etc.)
├── components/      # Reusable form components
├── services/        # API service layer
├── layouts/         # Layout components
├── types/           # TypeScript type definitions
├── constants/       # Error constants
└── config.json      # Configuration file
```

---

## 2. Page Components Analysis

### 2.1 Dashboard Page (`/src/pages/dashboard.tsx`)

**Route**: `/dashboard`

**Features**:
- Authentication gate (checks both Asgardeo and custom auth)
- Navigation menu with links to all modules
- Statistics display (static hardcoded values)
- Recent activity log (static table)

**Statistics Displayed** (Currently Hardcoded):
- Total Properties: 24
- Total Tenants: 42
- Active Leases: 18
- Pending Maintenance: 7

**API Calls**: None (dashboard is static)

**UI Components**:
- Navigation menu with logout
- Stats grid with 4 cards
- Recent Activity table

---

### 2.2 Properties Page (`/src/pages/properties.tsx`)

**Route**: `/properties`

**Data Fields Managed**:
```
Property Object {
  propertyId: number
  addressLine1: string (required)
  city: string (required)
  stateProvince: string
  zipCode: string (required)
  country: string
  propertyType: string (required) - Apartment|House|Condo|Townhouse|Office|Retail
  sizeSqFt: number
  bedrooms: number
  bathrooms: number
  rentAmount: number (required, LKR)
  ownerId: number
  owner?: Owner object
  status?: string - Default: "Available"
}
```

**CRUD Operations**:
- **GET** `/properties` - Fetch all properties
- **POST** `/properties` - Create new property
- **PUT** `/properties/{id}` - Update property
- **DELETE** `/properties/{id}` - Delete property

**Form Component**: `PropertyForm`
- Address (text, required)
- City (text, required)
- Zip Code (text, required)
- State/Province (text, optional)
- Country (text, default: "Sri Lanka")
- Property Type (dropdown, required)
- Rent Amount in LKR (number, required)
- Bedrooms (number, optional)
- Bathrooms (number, optional)
- Size in sq ft (number, optional)
- Owner (dropdown, optional)

**UI Components**:
- Table displaying properties with columns: Name, Address, Type, Bedrooms, Bathrooms, Size, Rent (LKR), Owner, Status, Actions
- Add/Edit/Delete buttons

---

### 2.3 Owners Page (`/src/pages/owners.tsx`)

**Route**: `/owners`

**Data Fields Managed**:
```
Owner Object {
  ownerId: number
  firstName: string (required)
  lastName: string (required)
  email: string (required, validated format)
  phone: string (optional)
}
```

**CRUD Operations**:
- **GET** `/owners` - Fetch all owners
- **POST** `/owners` - Create new owner
- **PUT** `/owners/{id}` - Update owner (passes ownerId in body)
- **DELETE** `/owners/{id}` - Delete owner

**Form Component**: `OwnerForm`
- First Name (text, required)
- Last Name (text, required)
- Email (email, required, regex validated)
- Phone (text, optional)

**UI Components**:
- Table displaying owners with columns: Name, Email, Phone, Properties Owned, Actions
- Add/Edit/Delete buttons

---

### 2.4 Tenants Page (`/src/pages/tenants.tsx`)

**Route**: `/tenants`

**Data Fields Managed**:
```
Tenant Object {
  tenantId: number
  firstName: string (required)
  lastName: string (required)
  email: string (required, validated format)
  phone: string (optional)
  property?: string
  leaseStart?: date
  leaseEnd?: date
}
```

**CRUD Operations**:
- **GET** `/tenants` - Fetch all tenants
- **POST** `/tenants` - Create new tenant
- **PUT** `/tenants/{id}` - Update tenant (passes tenantId in body)
- **DELETE** `/tenants/{id}` - Delete tenant

**Form Component**: `TenantForm`
- First Name (text, required)
- Last Name (text, required)
- Email (email, required, regex validated)
- Phone (text, optional)

**UI Components**:
- Table displaying tenants with columns: Name, Email, Phone, Property, Lease Period, Actions
- Add/Edit/Delete buttons

---

### 2.5 Leases Page (`/src/pages/leases.tsx`)

**Route**: `/leases`

**Data Fields Managed**:
```
Lease Object {
  leaseId: number
  propertyId: number (required)
  tenantId: number (required)
  startDate: date (required, ISO string)
  endDate: date (required, ISO string)
  monthlyRent: number (required, LKR)
  securityDeposit: number (optional, LKR)
  status: string - Active|Expired|Terminated
  property?: Property object
  tenant?: Tenant object
}
```

**CRUD Operations**:
- **GET** `/leases` - Fetch all leases
- **POST** `/leases` - Create new lease
- **PUT** `/leases/{id}` - Update lease
- **DELETE** `/leases/{id}` - Delete lease

**Dependencies**:
- Requires Properties and Tenants data for dropdown selection

**Form Component**: `LeaseForm`
- Property (dropdown, required)
- Tenant (dropdown, required)
- Start Date (date picker, required)
- End Date (date picker, required) - must be after start date
- Monthly Rent in LKR (number, required)
- Security Deposit in LKR (number, optional)
- Status (dropdown) - Active|Expired|Terminated

**UI Components**:
- Table displaying leases with columns: Property, Tenant, Start Date, End Date, Monthly Rent, Security Deposit, Status, Actions
- Add/Edit/Delete buttons
- Validation: End date must be after start date

---

### 2.6 Payments Page (`/src/pages/payments.tsx`)

**Route**: `/payments`

**Data Fields Managed**:
```
Payment Object {
  paymentId: number
  leaseId: number (required)
  amount: number (required, LKR)
  paymentDate: date (required, ISO string)
  paymentMethod: string - Bank Transfer|Cash|Check|Credit Card|Online Payment
  status: string - Pending|Completed|Failed|Refunded
  notes: string (optional)
  lease?: Lease object (nested with property and tenant)
}
```

**CRUD Operations**:
- **GET** `/payments` - Fetch all payments
- **POST** `/payments` - Create new payment
- **PUT** `/payments/{id}` - Update payment
- **DELETE** `/payments/{id}` - Delete payment

**Dependencies**:
- Requires Leases data (which includes Property and Tenant info)

**Form Component**: `PaymentForm`
- Lease (dropdown, required) - displays Property and Tenant info
- Amount in LKR (number, required, must be > 0)
- Payment Date (date picker, required)
- Payment Method (dropdown, required) - Bank Transfer, Cash, Check, Credit Card, Online Payment
- Status (dropdown) - Pending, Completed, Failed, Refunded
- Notes (textarea, optional)

**UI Components**:
- Table displaying payments with columns: Lease, Date, Amount, Payment Method, Status, Actions
- Add/Edit/Delete buttons
- Nested data display: Property Address - Tenant Name

---

### 2.7 Maintenance Page (`/src/pages/maintenance.tsx`)

**Route**: `/maintenance`

**Data Fields Managed**:
```
MaintenanceRequest Object {
  requestId: number
  propertyId: number (required)
  title: string (required)
  description: string (required)
  status: string - Submitted|In Progress|Completed|Cancelled
  priority: string - Low|Medium|High|Urgent
  resolutionNotes: string (optional)
  requestedDate?: date
  completionDate?: date
  property?: Property object
}
```

**CRUD Operations**:
- **GET** `/requests` - Fetch all maintenance requests (endpoint is `/requests`, not `/maintenance`)
- **POST** `/requests` - Create new maintenance request
- **PUT** `/requests/{id}` - Update maintenance request
- **DELETE** `/requests/{id}` - Delete maintenance request

**Dependencies**:
- Requires Properties data for dropdown selection

**Form Component**: `MaintenanceRequestForm`
- Property (dropdown, required)
- Title (text, required)
- Description (textarea, required)
- Status (dropdown) - Submitted, In Progress, Completed, Cancelled
- Priority (dropdown) - Low, Medium, High, Urgent
- Resolution Notes (textarea, optional)

**UI Components**:
- Table displaying requests with columns: Property, Title, Description, Status, Priority, Requested Date, Actions
- Add/Edit/Delete buttons

---

## 3. API Service Implementation (`/src/services/api.ts`)

### Client Configuration
```typescript
const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,  // Configured as "/api"
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
```

### Request Interceptor
- Currently has placeholder for authentication token
- Not actively adding auth headers (commented out)

### Response Interceptor
- Handles CORS errors
- Redirects to `/login` on 401 (Unauthorized)

### API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/properties` | Fetch all properties |
| GET | `/properties/{id}` | Fetch single property |
| POST | `/properties` | Create property |
| PUT | `/properties/{id}` | Update property |
| DELETE | `/properties/{id}` | Delete property |
| GET | `/owners` | Fetch all owners |
| GET | `/owners/{id}` | Fetch single owner |
| POST | `/owners` | Create owner |
| PUT | `/owners/{id}` | Update owner |
| DELETE | `/owners/{id}` | Delete owner |
| GET | `/tenants` | Fetch all tenants |
| GET | `/tenants/{id}` | Fetch single tenant |
| POST | `/tenants` | Create tenant |
| PUT | `/tenants/{id}` | Update tenant |
| DELETE | `/tenants/{id}` | Delete tenant |
| GET | `/leases` | Fetch all leases |
| GET | `/leases/{id}` | Fetch single lease |
| POST | `/leases` | Create lease |
| PUT | `/leases/{id}` | Update lease |
| DELETE | `/leases/{id}` | Delete lease |
| GET | `/payments` | Fetch all payments |
| GET | `/payments/{id}` | Fetch single payment |
| POST | `/payments` | Create payment |
| PUT | `/payments/{id}` | Update payment |
| DELETE | `/payments/{id}` | Delete payment |
| GET | `/requests` | Fetch all maintenance requests |
| GET | `/requests/{id}` | Fetch single request |
| POST | `/requests` | Create maintenance request |
| PUT | `/requests/{id}` | Update maintenance request |
| DELETE | `/requests/{id}` | Delete maintenance request |

---

## 4. Data Models & Relationships

### Entity Relationship Diagram (Logical)

```
Owner (1) -------- (Many) Property
                        |
                        |
                    (1) |
                        |
Tenant (1) ----------- (Many) Lease
Property (1)  |
              |
              |--- (1) |
                  |
              Payment
              
Property (1) -------- (Many) MaintenanceRequest
```

### Key Field Relationships

**Property to Owner**:
- Property.ownerId -> Owner.ownerId
- Backend returns nested Owner object

**Lease to Property**:
- Lease.propertyId -> Property.propertyId
- Backend returns nested Property object

**Lease to Tenant**:
- Lease.tenantId -> Tenant.tenantId
- Backend returns nested Tenant object

**Payment to Lease**:
- Payment.leaseId -> Lease.leaseId
- Backend returns nested Lease (with Property and Tenant)

**MaintenanceRequest to Property**:
- MaintenanceRequest.propertyId -> Property.propertyId
- Backend returns nested Property object

---

## 5. Form Components Summary

### Common Form Patterns

All forms follow this pattern:
1. State management for each field
2. useEffect to populate form when editing
3. Validation function checking required fields and formats
4. Submit handler that transforms data and calls onSave callback
5. Modal overlay UI with header, form, and action buttons

### Validation Rules

**Owner/Tenant Forms**:
- firstName: Required, non-empty string
- lastName: Required, non-empty string
- email: Required, must match email regex pattern
- phone: Optional

**Property Form**:
- addressLine1: Required
- city: Required
- zipCode: Required
- propertyType: Required, must be one of enum values
- rentAmount: Required, must be number > 0
- bedrooms: Optional, must be number >= 0
- bathrooms: Optional, must be number >= 0
- sizeSqFt: Optional, must be number >= 0

**Lease Form**:
- propertyId: Required
- tenantId: Required
- startDate: Required
- endDate: Required, must be after startDate
- monthlyRent: Required, must be number > 0
- securityDeposit: Optional, must be number >= 0

**Payment Form**:
- leaseId: Required
- amount: Required, must be number > 0
- paymentDate: Required
- paymentMethod: Required

**MaintenanceRequest Form**:
- propertyId: Required
- title: Required
- description: Required
- status: Optional, default "Submitted"
- priority: Optional, default "Medium"

---

## 6. Authentication System

### Dual Authentication Support
The application supports two authentication methods:

1. **Asgardeo (OIDC)**:
   - Uses `@asgardeo/auth-react`
   - Configuration in `/src/config.json`
   - Redirect URL: `http://localhost:3001/dashboard`

2. **Custom Auth**:
   - Implemented in CustomAuthContext
   - Fallback authentication method
   - Managed in React Context

### Authentication Checks
- Every page checks both auth sources: `asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated`
- Redirects to `/login` if not authenticated
- Logout supported via both methods

---

## 7. Data Transformation & Display

### Frontend Display vs API Response
The frontend transforms API responses for display:

**Properties Example**:
```typescript
// API Response
{ propertyId, addressLine1, city, stateProvince, zipCode, propertyType, 
  bedrooms, bathrooms, sizeSqFt, rentAmount, owner: {...} }

// Display Transformation
{ id: propertyId, 
  name: `${addressLine1}, ${city}`,
  address: `${addressLine1}, ${city}, ${stateProvince} ${zipCode}`,
  type: propertyType,
  bedrooms, bathrooms, size: `${sizeSqFt} sq ft`,
  rentAmount, owner: `${owner.firstName} ${owner.lastName}` }
```

Similar transformations applied to:
- Tenants (combine firstName/lastName to name)
- Leases (format dates, display Property/Tenant info)
- Payments (format amounts with currency, display Lease/Property/Tenant info)
- Maintenance (format dates, display Property address)

---

## 8. Configuration File (`/src/config.json`)

```json
{
  "asgardeo": {
    "clientID": "7ECNndE2MeBYuyhGquKQcbAKGvAa",
    "baseUrl": "https://api.asgardeo.io/t/googlextech",
    "signInRedirectURL": "http://localhost:3001/dashboard",
    "signOutRedirectURL": "http://localhost:3001",
    "scope": ["openid", "profile"],
    "clientOrigin": "http://localhost:3001",
    "clientOriginCheck": true
  },
  "apiBaseUrl": "/api",
  "appName": "Real Estate Management System",
  "appUrl": "http://localhost:3001"
}
```

---

## 9. Current Issues & Gaps

### Missing Features
1. **Dashboard Statistics**: Currently hardcoded, should fetch from backend
2. **Activity Log**: Currently static, should be real data
3. **Search/Filter**: No search or filtering on any list pages
4. **Pagination**: No pagination on list views
5. **Sorting**: No column sorting on tables
6. **Real-time Updates**: No websocket or polling for live data updates

### API Authentication
- Request interceptor has authentication code commented out
- No auth token being sent with requests
- Works only because backend may not require auth or frontend is running on same origin

### Error Handling
- Basic error messages displayed
- No specific error code handling
- No retry logic for failed requests

### Validation
- Client-side only
- No server-side validation errors displayed
- Validation messages are generic

### State Management
- Using local React state only
- No global state management (Redux, Context for data persistence)
- State resets on page refresh

---

## 10. Key Observations for Microservice Architecture

### Data Granularity
The system has 7 independent entities that could be separate microservices:
1. **Property Service**: Properties, property images, property details
2. **Owner Service**: Owner management, owner preferences
3. **Tenant Service**: Tenant management, tenant documents
4. **Lease Service**: Lease management, lease terms
5. **Payment Service**: Payment processing, payment history
6. **Maintenance Service**: Maintenance requests, work orders
7. **Notification Service**: Email/SMS notifications for events

### Cross-Service Dependencies
- **Lease Service** depends on Property & Tenant services
- **Payment Service** depends on Lease service
- **Maintenance Service** depends on Property service
- **Dashboard** aggregates data from all services

### Current API Patterns
- RESTful endpoints follow resource hierarchy
- ID-based endpoints for single resources
- No filtering, pagination, or sorting at API level
- Nested objects returned in responses (could be optimized)

---

## 11. File Inventory

### Page Components
- `/src/pages/dashboard.tsx` - Dashboard with stats and activity
- `/src/pages/properties.tsx` - Property list and management
- `/src/pages/owners.tsx` - Owner list and management
- `/src/pages/tenants.tsx` - Tenant list and management
- `/src/pages/leases.tsx` - Lease list and management
- `/src/pages/payments.tsx` - Payment list and management
- `/src/pages/maintenance.tsx` - Maintenance request list and management

### Form Components
- `/src/components/PropertyForm.tsx` - Property add/edit form
- `/src/components/OwnerForm.tsx` - Owner add/edit form
- `/src/components/TenantForm.tsx` - Tenant add/edit form
- `/src/components/LeaseForm.tsx` - Lease add/edit form
- `/src/components/PaymentForm.tsx` - Payment add/edit form
- `/src/components/MaintenanceRequestForm.tsx` - Maintenance request form

### Services
- `/src/services/api.ts` - API client and service methods
- `/src/services/authBackendService.ts` - Backend authentication service

### Configuration
- `/src/config.json` - Application configuration
- `/src/app.tsx` - Main app component with routing
- `/src/index.html` - HTML entry point

---

## Recommendations for Microservice Transition

1. **API Gateway Layer**: Implement API gateway to route frontend requests to different microservices
2. **Authentication Token**: Add JWT token handling in request interceptor
3. **Service Registry**: Use service discovery for dynamic service location
4. **Event-Driven**: Implement event bus for cross-service communication
5. **Circuit Breaker**: Add resilience patterns for service failures
6. **Data Consistency**: Implement saga pattern for transactions across services
7. **API Versioning**: Plan for API versioning as services evolve independently

