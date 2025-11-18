# Real Estate Microservices - Complete Setup Guide

This guide will help you set up and run all 7 microservices for the Real Estate Management System.

## 🎯 What You're Building

A complete microservice architecture with:
- **7 independent services** (Auth, Property, Owner, Tenant, Lease, Payment, Maintenance)
- **7 separate MySQL databases** (one per service)
- **React frontend** with modern dashboard
- **92 dummy records** for testing
- **Complete CRUD operations** for all entities

## 📋 Prerequisites Checklist

Before you start, ensure you have:

- [ ] **MySQL 8.0+** installed and running
- [ ] **.NET 8.0 SDK** installed
- [ ] **Node.js 18+** and npm installed
- [ ] **Git** installed
- [ ] **Asgardeo account** (free tier available)
- [ ] **8GB RAM** minimum
- [ ] **Ports 3001, 5000-5006** available

## 🚀 Step-by-Step Setup

### Step 1: Database Setup (5 minutes)

```bash
# Navigate to database folder
cd database

# Create all 7 databases with dummy data
mysql -u root -p < SETUP_ALL_DATABASES.sql

# Verify databases were created
mysql -u root -p < VERIFY_DATABASES.sql
```

**Expected Output:**
```
✓ 7 databases created
✓ 92 records inserted
✓ All tables verified
```

**Databases Created:**
- `real_estate_auth_db` - Authentication (3 tables)
- `real_estate_property_db` - Properties (15 records)
- `real_estate_owner_db` - Owners (10 records)
- `real_estate_tenant_db` - Tenants (12 records)
- `real_estate_lease_db` - Leases (10 records)
- `real_estate_payment_db` - Payments (25 records)
- `real_estate_maintenance_db` - Maintenance (20 records)

### Step 2: Configure Asgardeo (10 minutes)

#### 2.1 Create Asgardeo Application

1. Go to https://console.asgardeo.io/
2. Sign up or log in
3. Create a new application:
   - **Name**: Real Estate Management
   - **Type**: Single Page Application
   - **Redirect URLs**: `http://localhost:3001`

4. Note down:
   - Client ID
   - Client Secret
   - Organization name

#### 2.2 Update Auth Service Configuration

Edit `AuthService.API/appsettings.json`:

```json
{
  "Asgardeo": {
    "ClientId": "YOUR_CLIENT_ID_HERE",
    "ClientSecret": "YOUR_CLIENT_SECRET_HERE",
    "TokenEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/token",
    "UserInfoEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/userinfo",
    "IntrospectEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/introspect"
  },
  "JwtSettings": {
    "Secret": "CHANGE_THIS_TO_A_VERY_SECURE_SECRET_KEY_32_CHARS_MIN!"
  }
}
```

#### 2.3 Update Frontend Configuration

Edit `src/config.json`:

```json
{
  "asgardeo": {
    "clientID": "YOUR_CLIENT_ID_HERE",
    "baseUrl": "https://api.asgardeo.io/t/YOUR_ORG",
    "signInRedirectURL": "http://localhost:3001",
    "signOutRedirectURL": "http://localhost:3001",
    "scope": ["openid", "profile", "email"]
  }
}
```

### Step 3: Install Dependencies (5 minutes)

#### Backend Services
```bash
# Restore NuGet packages for all services
cd AuthService.API && dotnet restore && cd ..
cd PropertyService.API && dotnet restore && cd ..
cd OwnerService.API && dotnet restore && cd ..
cd TenantService.API && dotnet restore && cd ..
cd LeaseService.API && dotnet restore && cd ..
cd PaymentService.API && dotnet restore && cd ..
cd MaintenanceService.API && dotnet restore && cd ..
```

#### Frontend
```bash
npm install
```

### Step 4: Start All Services (2 minutes)

#### Option A: Automated Startup (Recommended)

**Linux/Mac:**
```bash
chmod +x start-all-services.sh
./start-all-services.sh
```

**Windows:**
```powershell
.\start-all-services.ps1
```

This will open 7 terminal windows, one for each service.

#### Option B: Manual Startup

Open 7 separate terminals and run:

**Terminal 1 - Auth Service:**
```bash
cd AuthService.API
dotnet run
```

**Terminal 2 - Property Service:**
```bash
cd PropertyService.API
dotnet run
```

**Terminal 3 - Owner Service:**
```bash
cd OwnerService.API
dotnet run
```

**Terminal 4 - Tenant Service:**
```bash
cd TenantService.API
dotnet run
```

**Terminal 5 - Lease Service:**
```bash
cd LeaseService.API
dotnet run
```

**Terminal 6 - Payment Service:**
```bash
cd PaymentService.API
dotnet run
```

**Terminal 7 - Maintenance Service:**
```bash
cd MaintenanceService.API
dotnet run
```

### Step 5: Verify Services Are Running

```bash
# Check all services
curl http://localhost:5000/health  # Auth
curl http://localhost:5001/health  # Property
curl http://localhost:5002/health  # Owner
curl http://localhost:5003/health  # Tenant
curl http://localhost:5004/health  # Lease
curl http://localhost:5005/health  # Payment
curl http://localhost:5006/health  # Maintenance
```

All should return: `{"status":"healthy","timestamp":"..."}`

### Step 6: Start Frontend (1 minute)

```bash
npm start
```

The app will open at http://localhost:3001

### Step 7: Test the System

1. **Login**:
   - Click "Login with Asgardeo"
   - Use your Asgardeo credentials
   - You'll be redirected to the dashboard

2. **Explore Dashboard**:
   - View real-time statistics
   - See property counts, revenue, occupancy rate
   - Check recent activities

3. **Test CRUD Operations**:
   - Go to **Properties** → View 15 dummy properties
   - Go to **Owners** → View 10 dummy owners
   - Go to **Tenants** → View 12 dummy tenants
   - Go to **Leases** → View 10 dummy leases
   - Go to **Payments** → View 25 dummy payments
   - Go to **Maintenance** → View 20 dummy requests

4. **Test API Documentation**:
   - Visit http://localhost:5001/swagger
   - Try "Get All Properties" endpoint
   - Should return 15 properties

## 🔍 Verification Checklist

After setup, verify:

- [ ] All 7 databases exist in MySQL
- [ ] All 7 services are running (ports 5000-5006)
- [ ] Frontend loads at http://localhost:3001
- [ ] Login with Asgardeo works
- [ ] Dashboard shows statistics
- [ ] Each CRUD page shows dummy data
- [ ] Swagger UI accessible for all services

## 📊 System Architecture

```
Frontend (React)
    ↓
Auth Service (5000) → auth_db
    ↓
Property Service (5001) → property_db
Owner Service (5002) → owner_db
Tenant Service (5003) → tenant_db
Lease Service (5004) → lease_db
Payment Service (5005) → payment_db
Maintenance Service (5006) → maintenance_db
```

## 🎨 What You'll See

### Dashboard
- **Total Properties**: 15
- **Property Owners**: 10
- **Active Tenants**: 12
- **Active Leases**: 10
- **Total Revenue**: ~$20,000+
- **Pending Payments**: 3-6
- **Occupancy Rate**: ~70%
- **Open Maintenance**: 4-8

### Dummy Data Highlights
- Properties in 11 US cities
- Rent from $1,200 to $3,500/month
- Mix of Apartments, Houses, Condos, Townhouses
- Active, Expired, and Pending leases
- Paid, Pending, and Overdue payments
- Maintenance requests from Low to Urgent priority

## 🛠️ Troubleshooting

### Problem: Database connection failed

**Solution:**
```bash
# Check MySQL is running
systemctl status mysql

# Or on Windows
services.msc

# Test connection
mysql -u root -p -e "SELECT 1;"
```

### Problem: Port already in use

**Solution:**
```bash
# Find process using port
lsof -i :5001  # Replace with your port

# Kill process
kill -9 <PID>
```

### Problem: Service won't start

**Solution:**
```bash
# Check .NET SDK version
dotnet --version  # Should be 8.0+

# Build the service
cd ServiceName.API
dotnet build

# Check for errors
dotnet run
```

### Problem: Asgardeo login fails

**Solution:**
1. Verify Client ID and Secret in both:
   - `AuthService.API/appsettings.json`
   - `src/config.json`
2. Check redirect URLs match in Asgardeo console
3. Verify organization name in endpoints

### Problem: CORS errors in browser

**Solution:**
Ensure each `Program.cs` has:
```csharp
app.UseCors("AllowReactApp");
```

And the policy allows `http://localhost:3001`.

### Problem: No data showing

**Solution:**
```bash
# Verify database has data
mysql -u root -p -e "
  SELECT
    'Properties' as Table_Name, COUNT(*) as Count FROM real_estate_property_db.properties
  UNION ALL
    SELECT 'Owners', COUNT(*) FROM real_estate_owner_db.owners
  UNION ALL
    SELECT 'Tenants', COUNT(*) FROM real_estate_tenant_db.tenants;
"
```

Should show:
- Properties: 15
- Owners: 10
- Tenants: 12

## 📚 Next Steps

After successful setup:

1. **Explore the code**:
   - Review service implementations
   - Study database schemas
   - Understand API patterns

2. **Customize**:
   - Add your own data
   - Modify UI colors/styles
   - Add new features

3. **Deploy**:
   - Configure for production
   - Set up Docker containers
   - Deploy to cloud (Azure, AWS, etc.)

4. **Enhance**:
   - Add API Gateway
   - Implement event-driven messaging
   - Add caching (Redis)
   - Add logging (Serilog)

## 🎓 Learning Resources

- **Microservices**: https://microservices.io/
- **.NET 8**: https://docs.microsoft.com/en-us/dotnet/
- **React**: https://react.dev/
- **Asgardeo**: https://wso2.com/asgardeo/docs/

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review service logs in terminal windows
3. Check Swagger documentation at `http://localhost:{port}/swagger`
4. Verify database content with SQL queries
5. Review `appsettings.json` configuration

## ✅ Success Criteria

Your setup is successful when:

- ✅ All 7 services respond to health checks
- ✅ Frontend loads without errors
- ✅ Login redirects to dashboard
- ✅ Dashboard shows real statistics
- ✅ All CRUD pages display dummy data
- ✅ Swagger UI works for all services

## 🎉 Congratulations!

You now have a fully functional microservice architecture running locally!

**Total Setup Time**: ~25 minutes

**Services Running**: 7 microservices + 1 frontend = 8 applications

**Database Records**: 92 realistic dummy records

**API Endpoints**: 50+ RESTful endpoints

**Technologies**: React, .NET 8, MySQL, Asgardeo, TypeScript, Entity Framework

---

**Happy Coding! 🚀**
