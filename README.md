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
- Real Estate Backend API (Spring Boot with Kotlin)

### Backend Setup

Make sure you have the Real Estate Backend running:

1. Database Setup
```sql
CREATE DATABASE real_estate_db;
CREATE USER realestate_user WITH PASSWORD 'realestate_pass';
GRANT ALL PRIVILEGES ON DATABASE real_estate_db TO realestate_user;
```

2. Configuration
Update `src/main/resources/application.properties` if needed:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/real_estate_db
spring.datasource.username=realestate_user
spring.datasource.password=realestate_pass
```

3. Run the Application
```bash
./gradlew bootRun
```

The backend will run on http://localhost:8080

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app should open at [`http://localhost:3000`](http://localhost:3000)

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

### Authentication
The API uses HTTP Basic Authentication for protected endpoints.

## License

This project is licensed under the MIT License.