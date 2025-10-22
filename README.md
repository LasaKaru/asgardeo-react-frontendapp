# Real Estate Management System

A comprehensive frontend application for managing real estate properties, tenants, owners, leases, payments, and maintenance requests.

## Features

- User authentication and authorization
- Property management (list, view, add, edit, delete)
- Tenant management
- Owner management
- Lease management
- Payment tracking
- Maintenance request handling
- Dashboard with statistics and recent activity

## Getting Started

### Prerequisites

- Node.js (version 12 or above)
- Real Estate Backend API (.NET 8 with Entity Framework)

### Backend Setup

Make sure you have the Real Estate Backend running:

1. Database Setup
The .NET backend uses Entity Framework with Code First approach. The database will be created automatically when you run the application for the first time.

2. Configuration
Update `appsettings.json` if needed:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RealEstateDB;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

3. Run the Application
```bash
dotnet run
```

The backend will run on https://localhost:7049

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app should open at [`http://localhost:3001`](http://localhost:3001)

### Default Credentials

- Username: admin
- Password: admin123

## API Endpoints

The frontend communicates with the backend via these endpoints:

### Properties
- GET /api/properties - List all properties
- GET /api/properties/{id} - Get property by ID
- POST /api/properties - Create new property
- PUT /api/properties/{id} - Update property
- DELETE /api/properties/{id} - Delete property

### Tenants
- GET /api/tenants - List all tenants
- GET /api/tenants/{id} - Get tenant by ID
- POST /api/tenants - Create new tenant
- PUT /api/tenants/{id} - Update tenant
- DELETE /api/tenants/{id} - Delete tenant

### Owners
- GET /api/owners - List all owners
- GET /api/owners/{id} - Get owner by ID
- POST /api/owners - Create new owner
- PUT /api/owners/{id} - Update owner
- DELETE /api/owners/{id} - Delete owner

### Leases
- GET /api/leases - List all leases
- GET /api/leases/{id} - Get lease by ID
- POST /api/leases - Create new lease
- PUT /api/leases/{id} - Update lease
- DELETE /api/leases/{id} - Delete lease

### Payments
- GET /api/payments - List all payments
- GET /api/payments/{id} - Get payment by ID
- POST /api/payments - Create new payment
- PUT /api/payments/{id} - Update payment
- DELETE /api/payments/{id} - Delete payment

### Maintenance Requests
- GET /api/requests - List all maintenance requests
- GET /api/requests/{id} - Get maintenance request by ID
- POST /api/requests - Create new maintenance request
- PUT /api/requests/{id} - Update maintenance request
- DELETE /api/requests/{id} - Delete maintenance request

### Authentication
The API uses HTTP Basic Authentication for protected endpoints.

## License

This project is licensed under the MIT License.