# Architecture & Flow Diagrams

## 1. Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React SPA (Port 3001)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  src/app.tsx                              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ AuthProvider (Asgardeo OAuth)                       │ │ │
│  │  │ ┌────────────────────────────────────────────────┐  │ │ │
│  │  │ │ BrowserRouter (React Router v6)                │  │ │ │
│  │  │ │ ┌──────────────────────────────────────────────┐ │ │ │
│  │  │ │ │ CustomAuthContext.Provider                   │ │ │ │
│  │  │ │ │ ┌────────────────────────────────────────────┐│ │ │ │
│  │  │ │ │ │ Routes (9 Routes)                          ││ │ │ │
│  │  │ │ │ │ - / → HomePage (redirects to /login)       ││ │ │ │
│  │  │ │ │ │ - /login → LoginPage                       ││ │ │ │
│  │  │ │ │ │ - /dashboard → DashboardPage               ││ │ │ │
│  │  │ │ │ │ - /properties → PropertiesPage             ││ │ │ │
│  │  │ │ │ │ - /tenants → TenantsPage                   ││ │ │ │
│  │  │ │ │ │ - /owners → OwnersPage                     ││ │ │ │
│  │  │ │ │ │ - /leases → LeasesPage                     ││ │ │ │
│  │  │ │ │ │ - /payments → PaymentsPage                 ││ │ │ │
│  │  │ │ │ │ - /maintenance → MaintenancePage           ││ │ │ │
│  │  │ │ │ │ - /* → NotFoundPage                        ││ │ │ │
│  │  │ │ │ └────────────────────────────────────────────┘│ │ │ │
│  │  │ │ └──────────────────────────────────────────────┘ │ │ │
│  │  │ └────────────────────────────────────────────────┘  │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────────┐    │
│  │  DefaultLayout      │  │  Pages & Components          │    │
│  ├─────────────────────┤  ├──────────────────────────────┤    │
│  │ Header              │  │ PropertyForm                 │    │
│  │ ├─ App Title        │  │ OwnerForm                    │    │
│  │ ├─ User Profile     │  │ TenantForm                   │    │
│  │ └─ Logout Button    │  │ LeaseForm                    │    │
│  │                     │  │ PaymentForm                  │    │
│  │ Main Content        │  │ MaintenanceRequestForm       │    │
│  │ (Page Component)    │  │                              │    │
│  │                     │  │ error-boundary.tsx           │    │
│  │ Footer              │  │ authentication-response.tsx  │    │
│  └─────────────────────┘  └──────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                           │
         │                           │
         ▼                           ▼
  ┌──────────────┐        ┌──────────────────┐
  │ Asgardeo     │        │ API Service      │
  │ OAuth        │        │ (Axios Client)   │
  │ (OIDC Flow)  │        │ src/services/    │
  └──────────────┘        │ api.ts           │
         │                │                  │
         │                │ Request          │
         │                │ Interceptors     │
         │                │ Response         │
         │                │ Interceptors     │
         │                └──────────────────┘
         │                       │
         ▼                       ▼
    ┌─────────────────────────────────┐
    │  Webpack Dev Server             │
    │  (Port 3001)                    │
    │  - HMR                          │
    │  - Proxy: /api/* →              │
    │    https://localhost:7049       │
    │  - History API Fallback         │
    └─────────────────────────────────┘
         │                    │
         │                    │
         └────────┬───────────┘
                  │
         ┌────────▼─────────┐
         │ External Services│
         ├──────────────────┤
         │ Asgardeo Tenant  │
         │ (OAuth Provider) │
         │ .NET Backend     │
         │ (API Server)     │
         └──────────────────┘
```

---

## 2. Authentication Flow

### Asgardeo OAuth (OIDC) Flow

```
User                App                  Asgardeo Tenant
  │                  │                         │
  │─ Click Login ───▶│                         │
  │                  │ Initiates OAuth Flow    │
  │                  │────────────────────────▶│
  │                  │                         │ (Redirects to login)
  │◀─────────────────────────────────────────  │
  │ (Browser redirects to Asgardeo login)      │
  │                                            │
  │ (User enters credentials at Asgardeo)      │
  │─────────────────────────────────────────▶  │
  │                                            │
  │ (Asgardeo validates & generates tokens)    │
  │◀─────────────────────────────────────────  │
  │ (Redirects to app with authorization code) │
  │                                            │
  │─ /dashboard (with code) ─────────────────▶│
  │                  │ Exchange code for token │
  │                  │────────────────────────▶│
  │                  │◀─ ID Token, Access Tok.│
  │                  │ Store in authContext    │
  │                  │                         │
  │◀─ Authenticated ─│                         │
  │   Dashboard      │                         │

Logout Flow:
  │                                            │
  │─ Click Logout ───────────────────────────▶│
  │                  │ signOut() method        │
  │                  │────────────────────────▶│
  │                  │ (OIDC logout)           │
  │                  │◀─ Clear session         │
  │◀─ Redirect to    │                         │
  │   Home/Login     │                         │
```

### Custom Auth Flow

```
User                App              Backend (Mock)
  │                  │                     │
  │─ Fill Form ─────▶│                     │
  │  username        │ customAuth.login()  │
  │  password        │                     │
  │                  │ (Demo: accept any)  │
  │                  │ if (username && pwd) │
  │                  │   setCustomAuth({   │
  │                  │     authenticated,  │
  │                  │     user            │
  │                  │   })                │
  │◀─ Authenticated ─│                     │
  │   Dashboard      │                     │

Logout Flow:
  │                                         
  │─ Click Logout ───────────────────────▶  
  │                  │ customAuth.logout()   
  │                  │ Clear auth state      
  │◀─ Redirect to    │                       
  │   Home/Login     │                       
```

---

## 3. Component Dependency Tree

```
src/app.tsx (Main)
├── AuthProvider (Asgardeo)
│   └── AppWithAsgardeo
│       ├── CustomAuthContext.Provider
│       │   ├── Router
│       │   │   └── Routes
│       │   │       ├── Route "/" → HomePage
│       │   │       ├── Route "/login" → LoginPage
│       │   │       │   ├── useAuthContext() [Asgardeo]
│       │   │       │   └── useContext(CustomAuthContext)
│       │   │       ├── Route "/dashboard" → DashboardPage
│       │   │       │   ├── useAuthContext() [Asgardeo]
│       │   │       │   ├── useContext(CustomAuthContext)
│       │   │       │   └── DefaultLayout
│       │   │       │       ├── Header (with logout)
│       │   │       │       ├── Main Content
│       │   │       │       └── Footer
│       │   │       ├── Route "/properties" → PropertiesPage
│       │   │       │   ├── PropertyForm (component)
│       │   │       │   │   ├── Form validation
│       │   │       │   │   ├── Input handlers
│       │   │       │   │   └── Submit handler
│       │   │       │   ├── apiService.getProperties()
│       │   │       │   ├── apiService.createProperty()
│       │   │       │   └── apiService.updateProperty()
│       │   │       ├── Route "/tenants" → TenantsPage
│       │   │       │   ├── TenantForm (component)
│       │   │       │   ├── apiService.getTenants()
│       │   │       │   ├── apiService.createTenant()
│       │   │       │   └── apiService.updateTenant()
│       │   │       ├── Route "/owners" → OwnersPage
│       │   │       │   ├── OwnerForm (component)
│       │   │       │   ├── apiService.getOwners()
│       │   │       │   ├── apiService.createOwner()
│       │   │       │   └── apiService.updateOwner()
│       │   │       ├── Route "/leases" → LeasesPage
│       │   │       │   ├── LeaseForm (component)
│       │   │       │   ├── apiService.getLeases()
│       │   │       │   ├── apiService.createLease()
│       │   │       │   └── apiService.updateLease()
│       │   │       ├── Route "/payments" → PaymentsPage
│       │   │       │   ├── PaymentForm (component)
│       │   │       │   ├── apiService.getPayments()
│       │   │       │   ├── apiService.createPayment()
│       │   │       │   └── apiService.updatePayment()
│       │   │       ├── Route "/maintenance" → MaintenancePage
│       │   │       │   ├── MaintenanceRequestForm (component)
│       │   │       │   ├── apiService.getMaintenanceRequests()
│       │   │       │   ├── apiService.createMaintenanceRequest()
│       │   │       │   └── apiService.updateMaintenanceRequest()
│       │   │       └── Route "/*" → NotFoundPage
│       │   │
│       │   └── Services
│       │       └── apiService (axios client)
│       │           ├── Request Interceptor
│       │           │   └── (Ready for token injection)
│       │           └── Response Interceptor
│       │               ├── 401 → redirect to /login
│       │               └── Error handling
│       │
│       └── ErrorBoundary (error-boundary.tsx)
│           └── Maps Asgardeo error codes to error pages
│
└── Constants
    └── errors.ts (USER_DENIED_LOGOUT)
```

---

## 4. Data Flow (Example: Properties Page)

```
User navigates to /properties
         │
         ▼
PropertiesPage Component Mounted
         │
         ├─ Check Authentication
         │  ├─ useAuthContext() from Asgardeo
         │  └─ useContext(CustomAuthContext)
         │
         ├─ If NOT authenticated → Redirect to /login
         │
         └─ If Authenticated
            │
            ├─ useEffect() → fetchData()
            │  │
            │  ├─ apiService.getOwners()
            │  │  │
            │  │  └─ axios.get('/api/owners')
            │  │     │
            │  │     └─ Request Interceptor
            │  │        (adds headers, tokens, etc.)
            │  │
            │  ├─ Response Handler
            │  │  ├─ Set owners state
            │  │  └─ Log to console
            │  │
            │  ├─ apiService.getProperties()
            │  │  │
            │  │  └─ axios.get('/api/properties')
            │  │     │
            │  │     ├─ Webpack Dev Server Proxy
            │  │     │  (from /api to https://localhost:7049)
            │  │     │
            │  │     ├─ .NET Backend
            │  │     │  └─ returns property data
            │  │     │
            │  │     └─ Response Interceptor
            │  │        ├─ Check status
            │  │        ├─ 401? → redirect /login
            │  │        └─ 200? → transform data
            │  │
            │  ├─ Transform Data
            │  │  propertyId → id
            │  │  addressLine1, city → name
            │  │  ... (map fields)
            │  │
            │  └─ Set properties state
            │
            ├─ Render Table/List
            │  └─ For each property:
            │     ├─ Display property details
            │     ├─ Edit Button → Show PropertyForm
            │     └─ Delete Button → apiService.deleteProperty()
            │
            └─ Handle User Interactions
               ├─ Add Property
               │  └─ PropertyForm
               │     └─ apiService.createProperty()
               │
               ├─ Edit Property
               │  └─ PropertyForm (with existing data)
               │     └─ apiService.updateProperty()
               │
               └─ Delete Property
                  └─ apiService.deleteProperty()
```

---

## 5. API Request/Response Flow

```
React Component (PropertiesPage)
         │
         ▼
apiService.getProperties()
         │
         ▼
axios.get('/api/properties')
         │
         ▼
Request Interceptor
  ├─ Get config
  ├─ Add headers
  │  └─ Content-Type: application/json
  ├─ (Ready to add: Authorization header)
  └─ Return config
         │
         ▼
Webpack Dev Server (Port 3001)
  ├─ Receives: GET /api/properties
  ├─ Matches proxy rule: /api/* → https://localhost:7049
  └─ Proxies request with:
     ├─ changeOrigin: true
     ├─ secure: false (for self-signed certs)
     └─ pathRewrite: /api → /api
         │
         ▼
.NET Backend API (Port 7049)
  ├─ Receives: GET https://localhost:7049/api/properties
  ├─ Database Query
  │  └─ Entity Framework Core
  ├─ Transform to JSON
  └─ Send Response:
     ├─ Status: 200 OK
     └─ Body: [
             {
               propertyId: 1,
               addressLine1: "123 Main St",
               city: "NYC",
               ...
             },
             ...
           ]
         │
         ▼
Response back through proxy
         │
         ▼
axios Response Handler
         │
         ▼
Response Interceptor
  ├─ Check response
  ├─ Status 200?
  │  └─ Return response
  ├─ Status 401?
  │  └─ Redirect to /login
  └─ Other error?
     └─ Return rejected promise
         │
         ▼
Back in apiService.getProperties()
         │
         ▼
Component receives data
  ├─ propertiesResponse.data = [...]
  └─ Transform data
         │
         ▼
setProperties(transformedData)
         │
         ▼
React re-renders with new data
         │
         ▼
Display properties table/list
```

---

## 6. File Organization

```
src/
├── app.tsx ..................... Main App component, AuthProvider wrapper, routes
├── app.css ..................... Global styles
├── index.html .................. Entry HTML
├── config.json ................. Asgardeo & API configuration
├── error-boundary.tsx .......... Error handler for Asgardeo errors
│
├── components/
│   ├── PropertyForm.tsx ........ Form for creating/editing properties
│   ├── OwnerForm.tsx ........... Form for creating/editing owners
│   ├── TenantForm.tsx .......... Form for creating/editing tenants
│   ├── LeaseForm.tsx ........... Form for creating/editing leases
│   ├── PaymentForm.tsx ......... Form for creating/editing payments
│   ├── MaintenanceRequestForm.tsx ... Form for maintenance requests
│   ├── authentication-response.tsx .. Auth response display
│   ├── LogoutRequestDenied.tsx ..... Error when logout denied
│   └── index.tsx ............... Component exports
│
├── pages/
│   ├── home.tsx ................ Redirects to /login
│   ├── login.tsx ............... Dual auth page (Asgardeo + custom)
│   ├── dashboard.tsx ........... Main dashboard with navigation
│   ├── properties.tsx .......... Properties management
│   ├── tenants.tsx ............. Tenants management
│   ├── owners.tsx .............. Owners management
│   ├── leases.tsx .............. Leases management
│   ├── payments.tsx ............ Payments management
│   ├── maintenance.tsx ......... Maintenance requests
│   ├── auth-callback.tsx ....... OAuth callback handler
│   ├── 404.tsx ................. Not found
│   ├── AuthenticationFailure.tsx
│   ├── InvalidSystemTime.tsx
│   ├── IssuerClaimValidationFailure.tsx
│   ├── VerifyIDTokenFailure.tsx
│   └── index.tsx ............... Page exports
│
├── layouts/
│   └── default.tsx ............. Header/footer wrapper
│
├── services/
│   └── api.ts .................. Axios client + API methods
│
├── constants/
│   └── errors.ts ............... Error messages
│
└── types/
    └── imports.d.ts ............ TypeScript definitions
```

---

## Summary Flowchart

```
User Access App
     │
     ▼
Is Authenticated?
     │
  ┌──┴──┐
  │     │
 NO    YES
  │     │
  ▼     └─▶ Show Protected Page
 Login    ├─ DefaultLayout (header/footer)
  Page    ├─ Page Component
  │       │  ├─ Fetch Data (apiService)
  │       │  │  └─ Axios → Webpack Proxy
  │       │  │     → .NET Backend
  │       │  │     → Transform & Display
  │       │  └─ Form Handler
  │       │     ├─ Validate
  │       │     └─ Create/Update/Delete
  │       └─ Logout Button
  │          ├─ Asgardeo: signOut()
  │          └─ Custom: logout()
  │
  ├─ Asgardeo OAuth?
  │  └─ Click "Login with Asgardeo"
  │     ├─ Redirect to Asgardeo
  │     ├─ User authenticates
  │     └─ Redirect back with tokens
  │
  ├─ Custom Login?
  │  └─ Enter username/password
  │     └─ Validate locally
  │
  └─ Demo Login?
     └─ Auto-login with admin/admin123
         │
         ▼
    Redirect to Dashboard
```
