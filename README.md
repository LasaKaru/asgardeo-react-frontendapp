# Real Estate Management System - Microservice Architecture

<div align="center">

![Real Estate Management](https://img.shields.io/badge/Architecture-Microservices-blue)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**A complete enterprise-grade microservice architecture for real estate property management**

[Features](#features) • [Architecture](#architecture) • [Quick Start](#quick-start) • [Documentation](#documentation) • [API Reference](#api-endpoints)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Services](#services)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The **Real Estate Management System** is a comprehensive, production-ready microservice application for managing properties, tenants, owners, leases, payments, and maintenance requests. Built with modern technologies and best practices, it demonstrates a complete enterprise architecture.

### Key Highlights

- **8 Independent Services** - API Gateway + 7 domain microservices
- **7 Separate Databases** - MySQL with isolated data per service
- **92 Sample Records** - Ready-to-use test data
- **Modern React UI** - Responsive dashboard with real-time statistics
- **Complete CRUD Operations** - Full create, read, update, delete for all entities
- **Production Ready** - Authentication, monitoring, health checks, documentation

---

## ✨ Features

### Business Features

- **Property Management** - Complete property portfolio management
- **Tenant Management** - Tenant profiles with emergency contacts
- **Owner Management** - Property owner profiles and contact information
- **Lease Management** - Lease agreements and contract tracking
- **Payment Tracking** - Rent payment processing and history
- **Maintenance Requests** - Work order management with priorities
- **Dashboard Analytics** - Real-time statistics and financial overview
- **Activity Feed** - Recent activity tracking across all services

### Technical Features

- **Microservice Architecture** - Independent, scalable services
- **API Gateway** - Centralized request routing with YARP
- **OAuth2/OIDC Authentication** - Asgardeo integration
- **JWT Token Management** - Secure token-based authentication
- **RESTful APIs** - Complete REST endpoints with Swagger docs
- **Entity Framework Core** - Code-first database approach
- **Automated Health Checks** - Service monitoring and status tracking
- **CORS Support** - Configured for cross-origin requests
- **Responsive Design** - Mobile, tablet, and desktop support

---

## 🏗️ Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)                    │
│                         http://localhost:3001                        │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     API Gateway         │
                    │   YARP Reverse Proxy    │
                    │   http://localhost:8080 │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
    ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐  ┌───▼────┐
    │  Auth  │  │Property│  │ Owner  │  │ Tenant │  │ Lease  │  │Payment │  │Maintain│
    │:5000   │  │:5001   │  │:5002   │  │:5003   │  │:5004   │  │:5005   │  │:5006   │
    └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘
         │           │           │           │           │           │           │
    ┌────▼──────┬───▼──────┬────▼──────┬────▼──────┬────▼──────┬────▼──────┬────▼──────┐
    │  auth_db  │property_ │  owner_db │  tenant_  │  lease_db │  payment_ │maintenance│
    │           │    db    │           │    db     │           │    db     │    _db    │
    └───────────┴──────────┴───────────┴───────────┴───────────┴───────────┴───────────┘
```

### Technology Stack

**Frontend:**
- React 18.2.0
- TypeScript
- React Router 6
- Axios HTTP client
- Asgardeo Auth React SDK

**Backend:**
- .NET 8.0 Web API
- Entity Framework Core 8.0
- YARP Reverse Proxy 2.1.0
- Swagger/OpenAPI 6.5.0

**Database:**
- MySQL 8.0+
- Pomelo MySQL Provider
- Separate database per service

**Authentication:**
- Asgardeo OAuth2/OIDC
- JWT Bearer tokens

---

## 🚀 Services

### Service Overview

| Service | Port | Database | Records | Description |
|---------|------|----------|---------|-------------|
| **API Gateway** | 8080 | - | - | Central request router (YARP) |
| **Auth Service** | 5000 | auth_db | Users | Authentication & authorization |
| **Property Service** | 5001 | property_db | 15 | Property management |
| **Owner Service** | 5002 | owner_db | 10 | Property owner profiles |
| **Tenant Service** | 5003 | tenant_db | 12 | Tenant management |
| **Lease Service** | 5004 | lease_db | 10 | Lease agreements |
| **Payment Service** | 5005 | payment_db | 25 | Payment tracking |
| **Maintenance Service** | 5006 | maintenance_db | 20 | Maintenance requests |

### Service Documentation

Each service has comprehensive README documentation:

- [API Gateway Documentation](APIGateway/README.md)
- [Auth Service Documentation](AuthService.API/README.md)
- [Property Service Documentation](PropertyService.API/README.md)
- [Owner Service Documentation](OwnerService.API/README.md)
- [Tenant Service Documentation](TenantService.API/README.md)
- [Lease Service Documentation](LeaseService.API/README.md)
- [Payment Service Documentation](PaymentService.API/README.md)
- [Maintenance Service Documentation](MaintenanceService.API/README.md)

---

## 🚀 Quick Start

### Prerequisites

- **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download)
- **Node.js 18+** and npm - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)
- **Asgardeo Account** - [Sign up](https://wso2.com/asgardeo/)

### Installation (5 Steps)

#### 1. Clone Repository
```bash
git clone <repository-url>
cd asgardeo-react-frontendapp
```

#### 2. Setup Databases (2 minutes)
```bash
cd database
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

This creates:
- ✅ 7 separate databases
- ✅ All required tables
- ✅ 92 realistic dummy records

#### 3. Configure Asgardeo (5 minutes)

**Create Asgardeo Application:**
1. Visit https://console.asgardeo.io/
2. Create new application (Single Page Application)
3. Configure redirect URL: `http://localhost:3001`
4. Note down Client ID and Client Secret

**Update Auth Service:**

Edit `AuthService.API/appsettings.json`:
```json
{
  "Asgardeo": {
    "ClientId": "YOUR_CLIENT_ID",
    "ClientSecret": "YOUR_CLIENT_SECRET",
    "TokenEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/token",
    "UserInfoEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/userinfo",
    "IntrospectEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/introspect"
  }
}
```

**Update Frontend:**

Edit `src/config.json`:
```json
{
  "asgardeo": {
    "clientID": "YOUR_CLIENT_ID",
    "baseUrl": "https://api.asgardeo.io/t/YOUR_ORG",
    "signInRedirectURL": "http://localhost:3001",
    "signOutRedirectURL": "http://localhost:3001"
  }
}
```

#### 4. Start All Services (1 minute)

**Automated (Recommended):**
```bash
# Linux/Mac
./start-all-services.sh

# Windows
.\start-all-services.ps1
```

**Manual:**
```bash
# Start in separate terminals
cd APIGateway && dotnet run
cd AuthService.API && dotnet run
cd PropertyService.API && dotnet run
cd OwnerService.API && dotnet run
cd TenantService.API && dotnet run
cd LeaseService.API && dotnet run
cd PaymentService.API && dotnet run
cd MaintenanceService.API && dotnet run
```

#### 5. Start Frontend (1 minute)
```bash
npm install
npm start
```

### Access the Application

- **Frontend:** http://localhost:3001
- **API Gateway:** http://localhost:8080
- **Swagger Docs:** http://localhost:8080/swagger

### Verify Installation

```bash
# Check all services
curl http://localhost:8080/api/gateway/services-status
```

**Expected:** All 7 services show as "healthy"

---

## 📚 Documentation

### Complete Documentation Suite

| Document | Description |
|----------|-------------|
| [MICROSERVICES_SETUP_GUIDE.md](MICROSERVICES_SETUP_GUIDE.md) | Step-by-step setup (25 min) |
| [MICROSERVICE_ARCHITECTURE.md](MICROSERVICE_ARCHITECTURE.md) | Architecture overview |
| [API_GATEWAY_README.md](API_GATEWAY_README.md) | Gateway routing & monitoring |
| [database/README.md](database/MICROSERVICES_DATABASE_README.md) | Database schemas & setup |
| [API_ENDPOINTS_REFERENCE.md](API_ENDPOINTS_REFERENCE.md) | Complete API reference |

### Service-Specific Documentation

Each service folder contains detailed `README.md` with:
- Service overview
- API endpoints
- Database schema
- Configuration
- How to run
- Testing examples
- Troubleshooting

---

## 🔌 API Endpoints

### API Gateway (Port 8080)

**All frontend requests go through the gateway:**

| Route | Destination | Purpose |
|-------|-------------|---------|
| `/api/auth/*` | Auth Service (5000) | Authentication |
| `/api/properties/*` | Property Service (5001) | Properties |
| `/api/owners/*` | Owner Service (5002) | Owners |
| `/api/tenants/*` | Tenant Service (5003) | Tenants |
| `/api/leases/*` | Lease Service (5004) | Leases |
| `/api/payments/*` | Payment Service (5005) | Payments |
| `/api/maintenance/*` | Maintenance Service (5006) | Maintenance |

**Gateway Management:**
- `GET /health` - Gateway health
- `GET /gateway-info` - Service information
- `GET /api/gateway/services-status` - All service status
- `GET /api/gateway/routes` - Route configuration

### Common Endpoints (All Services)

```
GET    /api/{resource}           # Get all
GET    /api/{resource}/{id}      # Get by ID
POST   /api/{resource}           # Create new
PUT    /api/{resource}/{id}      # Update
DELETE /api/{resource}/{id}      # Delete
GET    /health                   # Health check
```

### Testing Examples

**Get all properties:**
```bash
curl http://localhost:8080/api/properties
```

**Create new owner:**
```bash
curl -X POST http://localhost:8080/api/owners \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-0123"
  }'
```

**Get payment by ID:**
```bash
curl http://localhost:8080/api/payments/1
```

---

## 💾 Database Schema

### Databases

```
real_estate_auth_db          # Authentication
  ├── users
  ├── auth_tokens
  └── refresh_tokens

real_estate_property_db      # Properties
  └── properties

real_estate_owner_db         # Owners
  └── owners

real_estate_tenant_db        # Tenants
  └── tenants

real_estate_lease_db         # Leases
  └── leases

real_estate_payment_db       # Payments
  └── payments

real_estate_maintenance_db   # Maintenance
  └── maintenance_requests
```

### Sample Data

The system includes **92 realistic dummy records**:
- 15 properties (Seattle, Portland, SF, LA, Austin, Denver, Phoenix, etc.)
- 10 property owners
- 12 tenants with emergency contacts
- 10 lease agreements (Active, Expired, Pending)
- 25 payment transactions (Paid, Pending, Overdue)
- 20 maintenance requests (Open, In Progress, Completed)

**View data:**
```bash
mysql -u root -p < database/VERIFY_DATABASES.sql
```

---

## ⚙️ Configuration

### Connection Strings

All services use MySQL with this pattern:
```
Server=127.0.0.1;Database=DB_NAME;User=root;Password=root;
```

### Environment Variables (Production)

```bash
# Set for all services
export ConnectionStrings__DefaultConnection="Server=prod-db;Database=...;User=...;Password=..."
export ASPNETCORE_ENVIRONMENT="Production"
```

### CORS Configuration

Configured for:
- `http://localhost:3001` (React frontend)
- `http://localhost:3000` (Alternative frontend)

Update `Program.cs` in each service for production domains.

---

## 🚢 Deployment

### Docker (Future)

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d
```

### Manual Deployment

1. **Build Services:**
```bash
dotnet publish -c Release
```

2. **Setup Database:**
- Create databases on production MySQL
- Run migration scripts

3. **Configure Environment:**
- Set production connection strings
- Update Asgardeo credentials
- Configure CORS for production domains

4. **Deploy Services:**
- Deploy each service to separate server/container
- Configure reverse proxy (Nginx/IIS)
- Enable HTTPS with SSL certificates

5. **Deploy Frontend:**
```bash
npm run build
# Deploy build folder to web server
```

### Cloud Deployment Options

- **Azure** - App Services + Azure Database for MySQL
- **AWS** - ECS + RDS MySQL
- **GCP** - Cloud Run + Cloud SQL
- **Kubernetes** - Container orchestration

---

## 🔧 Troubleshooting

### Services Won't Start

**Check .NET version:**
```bash
dotnet --version  # Should be 8.0+
```

**Check port availability:**
```bash
lsof -i :8080  # Check if port is in use
```

### Database Connection Failed

**Verify MySQL is running:**
```bash
systemctl status mysql  # Linux
# Or services.msc on Windows
```

**Test connection:**
```bash
mysql -u root -p -e "SELECT 1;"
```

**Verify databases exist:**
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_%';"
```

### Asgardeo Login Fails

1. ✅ Check Client ID in both Auth Service and Frontend
2. ✅ Verify Client Secret in Auth Service
3. ✅ Confirm redirect URLs match (http://localhost:3001)
4. ✅ Check organization name in endpoint URLs

### Gateway Not Routing

**Check service health:**
```bash
curl http://localhost:8080/api/gateway/services-status
```

**Verify each service:**
```bash
curl http://localhost:5001/health  # Property
curl http://localhost:5002/health  # Owner
# ... etc
```

### Frontend Can't Connect

**Check API Gateway URL in `src/config.json`:**
```json
{
  "apiBaseUrl": "http://localhost:8080/api"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow .NET coding conventions
- Write unit tests for new features
- Update documentation
- Ensure all services pass health checks
- Test end-to-end flow

---

## 📊 Project Statistics

- **Total Services:** 8 (1 Gateway + 7 Microservices)
- **Total Databases:** 7 MySQL databases
- **Total API Endpoints:** 50+ RESTful endpoints
- **Total Records:** 92 realistic dummy records
- **Lines of Code:** 8,000+ lines
- **Documentation:** 2,500+ lines
- **Setup Time:** ~25 minutes
- **Technologies:** .NET 8, React 18, MySQL 8, TypeScript

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Development Team**

---

## 🙏 Acknowledgments

- **Asgardeo** for authentication platform
- **.NET Team** for excellent microservice framework
- **React Team** for frontend framework
- **YARP Team** for reverse proxy

---

## 📞 Support

For issues and questions:

1. Check service-specific README files
2. Review [Troubleshooting](#troubleshooting) section
3. Check Swagger documentation: http://localhost:8080/swagger
4. Verify service health: http://localhost:8080/api/gateway/services-status
5. Review logs in service console

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

**Built with ❤️ using Microservice Architecture**

[⬆ Back to Top](#real-estate-management-system---microservice-architecture)

</div>
