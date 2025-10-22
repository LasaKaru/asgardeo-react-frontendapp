# Real Estate Management System API (.NET 9 + MySQL) 🏡

A comprehensive backend API built with **ASP.NET Core Minimal APIs** and **Entity Framework Core** to manage real estate properties, tenants, owners, leases, payments, and maintenance requests.

This API is designed for consumption by a modern frontend application (e.g., React, Angular, Vue.js).

---

## 🧰 1. Prerequisites

Ensure you have the following tools installed:

- .NET 9 SDK  
- Visual Studio 2022 or VS Code (version 8.0+ recommended)  
- MySQL Client (e.g., MySQL Workbench)

---

## ⚙️ 2. Setup and Installation

### 2.1. Database Setup (MySQL)

You must create the database and tables manually **or** use **Entity Framework Core Migrations**.

#### Option A: Manual SQL Script (Quick Setup)

```sql
-- Database: real_estate_db
CREATE DATABASE IF NOT EXISTS real_estate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE real_estate_db;

-- 1. Owners Table
CREATE TABLE Owners (
    OwnerId INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tenants Table
CREATE TABLE Tenants (
    TenantId INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Properties Table
CREATE TABLE Properties (
    PropertyId INT PRIMARY KEY AUTO_INCREMENT,
    AddressLine1 VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    StateProvince VARCHAR(100),
    ZipCode VARCHAR(20) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    PropertyType VARCHAR(50) NOT NULL,
    SizeSqFt INT,
    Bedrooms INT,
    Bathrooms INT,
    RentAmount DECIMAL(10, 2) NOT NULL,
    OwnerId INT,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OwnerId) REFERENCES Owners(OwnerId) ON DELETE SET NULL
);

-- 4. Leases Table
CREATE TABLE Leases (
    LeaseId INT PRIMARY KEY AUTO_INCREMENT,
    PropertyId INT NOT NULL,
    TenantId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    MonthlyRent DECIMAL(10, 2) NOT NULL,
    SecurityDeposit DECIMAL(10, 2),
    Status VARCHAR(50) NOT NULL,
    FOREIGN KEY (PropertyId) REFERENCES Properties(PropertyId) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(TenantId) ON DELETE CASCADE
);

-- 5. Payments Table
CREATE TABLE Payments (
    PaymentId INT PRIMARY KEY AUTO_INCREMENT,
    LeaseId INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Notes TEXT,
    FOREIGN KEY (LeaseId) REFERENCES Leases(LeaseId) ON DELETE CASCADE
);

-- 6. MaintenanceRequests Table
CREATE TABLE MaintenanceRequests (
    RequestId INT PRIMARY KEY AUTO_INCREMENT,
    PropertyId INT NOT NULL,
    LeaseId INT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Priority VARCHAR(50) NOT NULL,
    RequestedDate DATETIME NOT NULL,
    CompletionDate DATETIME,
    ResolutionNotes TEXT,
    FOREIGN KEY (PropertyId) REFERENCES Properties(PropertyId) ON DELETE CASCADE,
    FOREIGN KEY (LeaseId) REFERENCES Leases(LeaseId) ON DELETE SET NULL
);
```

#### Option B: EF Core Migrations (Recommended)

1. Update `appsettings.json` with your MySQL credentials:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Port=3306;Database=real_estate_db;Uid=your_user;Pwd=your_password;"
   }
   ```
2. In Visual Studio, open **Package Manager Console** and run:
   ```powershell
   Add-Migration InitialCreate
   Update-Database
   ```

### 2.2. Run the API

```bash
dotnet run
```

The application will start on **http://localhost:5191** (HTTP) and **https://localhost:7049** (HTTPS).

---

## 📘 3. API Documentation (Swagger)

Swagger UI is automatically available at:

👉 [https://localhost:7049/swagger/index.html](https://localhost:7049/swagger/index.html)

---

## 🔗 4. API Endpoints Overview

### 🧾 Tenants Management (`/api/tenants`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/tenants` | Create new tenant |
| GET | `/api/tenants` | List tenants |
| GET | `/api/tenants/{id}` | Get tenant by ID |
| PUT | `/api/tenants/{id}` | Update tenant |
| DELETE | `/api/tenants/{id}` | Delete tenant |

**POST Payload Example:**
```json
{
  "firstName": "Lasa",
  "lastName": "Karu",
  "email": "lasa.karu@example.com",
  "phone": "+94782977080"
}
```

---

### 👤 Owners Management (`/api/owners`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/owners` | Create new owner |
| GET | `/api/owners` | List all owners |

**POST Payload Example:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@propmanager.com",
  "phone": "+1 (555) 123-4567"
}
```

---

### 🏠 Properties Management (`/api/properties`)

**POST Payload Example:**
```json
{
  "addressLine1": "123 Main St",
  "city": "Colombo",
  "stateProvince": "WP",
  "zipCode": "00400",
  "country": "Sri Lanka",
  "propertyType": "Apartment",
  "sizeSqFt": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "rentAmount": 1500.00,
  "ownerId": 1
}
```

---

### 📜 Leases Management (`/api/leases`)

**POST Payload Example:**
```json
{
  "propertyId": 1,
  "tenantId": 1,
  "startDate": "2025-11-01T00:00:00Z",
  "endDate": "2026-10-31T00:00:00Z",
  "monthlyRent": 1500.00,
  "securityDeposit": 3000.00,
  "status": "Active"
}
```

---

### 💳 Payments Management (`/api/payments`)

**POST Payload Example:**
```json
{
  "leaseId": 1,
  "amount": 1500.00,
  "paymentDate": "2025-11-01T10:00:00Z",
  "paymentMethod": "Bank Transfer",
  "status": "Completed",
  "notes": "November rent paid in full."
}
```

---

### 🧰 Maintenance Requests (`/api/requests`)

**POST Payload Example:**
```json
{
  "propertyId": 1,
  "leaseId": 1,
  "title": "Leaking faucet in kitchen",
  "description": "The kitchen faucet has a constant drip, wasting water.",
  "status": "Submitted",
  "priority": "Medium"
}
```

---

## ✅ Summary

This API provides a full-featured backend for real estate management with modular structure and scalability for enterprise-grade applications.
