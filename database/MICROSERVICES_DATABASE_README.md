# Real Estate Microservices Database Setup

This directory contains comprehensive MySQL database setup scripts for all 6 microservices in the Real Estate Management System.

## Directory Structure

```
database/
├── property/
│   └── 01_create_property_db.sql
├── owner/
│   └── 01_create_owner_db.sql
├── tenant/
│   └── 01_create_tenant_db.sql
├── lease/
│   └── 01_create_lease_db.sql
├── payment/
│   └── 01_create_payment_db.sql
├── maintenance/
│   └── 01_create_maintenance_db.sql
├── SETUP_ALL_DATABASES.sql (Master setup script)
└── MICROSERVICES_DATABASE_README.md (This file)
```

## Database Overview

### 1. Property Database (`real_estate_property_db`)
- **Table:** `properties`
- **Records:** 15 properties
- **Features:**
  - Property types: Apartment, House, Condo, Townhouse
  - Statuses: Available, Occupied, Maintenance, Sold
  - Locations across 10+ cities in US West and Southwest
  - Rent amounts ranging from $1,200 to $3,500
  - Various bedroom/bathroom configurations

### 2. Owner Database (`real_estate_owner_db`)
- **Table:** `owners`
- **Records:** 10 property owners
- **Features:**
  - Contact information (email, phone)
  - Physical addresses
  - Unique email constraints

### 3. Tenant Database (`real_estate_tenant_db`)
- **Table:** `tenants`
- **Records:** 12 tenants
- **Features:**
  - Personal contact information
  - Emergency contact details
  - Unique email constraints

### 4. Lease Database (`real_estate_lease_db`)
- **Table:** `leases`
- **Records:** 10 lease agreements
- **Features:**
  - Links properties to tenants
  - Statuses: Active, Expired, Terminated, Pending
  - Lease durations: 6 months, 1 year, 2 years
  - Security deposits and terms
  - Date tracking for lease periods

### 5. Payment Database (`real_estate_payment_db`)
- **Table:** `payments`
- **Records:** 25 payment transactions
- **Features:**
  - Linked to lease agreements
  - Statuses: Paid, Pending, Overdue, Partial
  - Payment methods: Credit Card, Bank Transfer, Check, Cash
  - Due dates and paid dates
  - Payment tracking notes

### 6. Maintenance Database (`real_estate_maintenance_db`)
- **Table:** `maintenance_requests`
- **Records:** 20 maintenance requests
- **Features:**
  - Linked to properties
  - Statuses: Open, In Progress, Completed, Cancelled
  - Priorities: Low, Medium, High, Urgent
  - Request types: Plumbing, Electrical, HVAC, Appliances, General
  - Assignment tracking and completion dates

## Installation Instructions

### Option 1: Run All Databases at Once (Recommended)

```bash
# Navigate to the database directory
cd /home/user/asgardeo-react-frontendapp/database

# Run the master setup script
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

Or from MySQL CLI:
```sql
SOURCE /home/user/asgardeo-react-frontendapp/database/SETUP_ALL_DATABASES.sql;
```

### Option 2: Run Individual Database Scripts

```bash
# Property Database
mysql -u root -p < property/01_create_property_db.sql

# Owner Database
mysql -u root -p < owner/01_create_owner_db.sql

# Tenant Database
mysql -u root -p < tenant/01_create_tenant_db.sql

# Lease Database
mysql -u root -p < lease/01_create_lease_db.sql

# Payment Database
mysql -u root -p < payment/01_create_payment_db.sql

# Maintenance Database
mysql -u root -p < maintenance/01_create_maintenance_db.sql
```

## Data Relationships

The databases contain interconnected dummy data:

```
Owners (10) → Properties (15)
                ↓
            Leases (10) ← Tenants (12)
                ↓
            Payments (25)

Properties (15) → Maintenance Requests (20)
```

### Example Relationships:
- **Property ID 1** (123 Oak Street, Seattle)
  - Owner: John Davidson (ID: 1)
  - Lease ID: 1 with Tenant Alex Johnson
  - Multiple payment records
  - Maintenance requests for AC and faucet

- **Property ID 3** (789 Pine Boulevard, San Francisco)
  - Owner: Michael Thompson (ID: 3)
  - Lease ID: 2 with Tenant Rachel Smith
  - Payment history
  - Dishwasher maintenance completed

## Verification Commands

After installation, verify the databases:

```sql
-- Show all databases
SHOW DATABASES;

-- Check Property Database
USE real_estate_property_db;
SHOW TABLES;
SELECT COUNT(*) FROM properties;
SELECT status, COUNT(*) FROM properties GROUP BY status;

-- Check Owner Database
USE real_estate_owner_db;
SELECT COUNT(*) FROM owners;

-- Check Tenant Database
USE real_estate_tenant_db;
SELECT COUNT(*) FROM tenants;

-- Check Lease Database
USE real_estate_lease_db;
SELECT COUNT(*) FROM leases;
SELECT status, COUNT(*) FROM leases GROUP BY status;

-- Check Payment Database
USE real_estate_payment_db;
SELECT COUNT(*) FROM payments;
SELECT status, COUNT(*) FROM payments GROUP BY status;

-- Check Maintenance Database
USE real_estate_maintenance_db;
SELECT COUNT(*) FROM maintenance_requests;
SELECT status, COUNT(*) FROM maintenance_requests GROUP BY status;
```

## Sample Queries

### Get all available properties with owner information:
```sql
SELECT
    p.id,
    p.address,
    p.city,
    p.property_type,
    p.bedrooms,
    p.bathrooms,
    p.rent_amount,
    o.first_name AS owner_first_name,
    o.last_name AS owner_last_name,
    o.email AS owner_email
FROM real_estate_property_db.properties p
JOIN real_estate_owner_db.owners o ON p.owner_id = o.id
WHERE p.status = 'Available';
```

### Get active leases with tenant and property details:
```sql
SELECT
    l.id AS lease_id,
    p.address,
    p.city,
    t.first_name AS tenant_first_name,
    t.last_name AS tenant_last_name,
    l.rent_amount,
    l.start_date,
    l.end_date
FROM real_estate_lease_db.leases l
JOIN real_estate_property_db.properties p ON l.property_id = p.id
JOIN real_estate_tenant_db.tenants t ON l.tenant_id = t.id
WHERE l.status = 'Active';
```

### Get overdue payments:
```sql
SELECT
    pay.id AS payment_id,
    pay.amount,
    pay.due_date,
    l.id AS lease_id,
    t.first_name AS tenant_first_name,
    t.last_name AS tenant_last_name,
    t.email AS tenant_email,
    DATEDIFF(CURDATE(), pay.due_date) AS days_overdue
FROM real_estate_payment_db.payments pay
JOIN real_estate_lease_db.leases l ON pay.lease_id = l.id
JOIN real_estate_tenant_db.tenants t ON l.tenant_id = t.id
WHERE pay.status = 'Overdue'
ORDER BY pay.due_date;
```

### Get open maintenance requests by priority:
```sql
SELECT
    m.id,
    m.title,
    m.priority,
    m.reported_date,
    p.address,
    p.city,
    DATEDIFF(CURDATE(), m.reported_date) AS days_open
FROM real_estate_maintenance_db.maintenance_requests m
JOIN real_estate_property_db.properties p ON m.property_id = p.id
WHERE m.status = 'Open'
ORDER BY
    FIELD(m.priority, 'Urgent', 'High', 'Medium', 'Low'),
    m.reported_date;
```

## Data Summary

| Database | Table | Record Count | Description |
|----------|-------|--------------|-------------|
| real_estate_property_db | properties | 15 | Property listings |
| real_estate_owner_db | owners | 10 | Property owners |
| real_estate_tenant_db | tenants | 12 | Tenants |
| real_estate_lease_db | leases | 10 | Lease agreements |
| real_estate_payment_db | payments | 25 | Payment transactions |
| real_estate_maintenance_db | maintenance_requests | 20 | Maintenance requests |
| **TOTAL** | | **92** | **Total records** |

## Microservice API Integration

Each database is designed to be accessed by its corresponding .NET microservice API:

1. **Property API** → `real_estate_property_db`
2. **Owner API** → `real_estate_owner_db`
3. **Tenant API** → `real_estate_tenant_db`
4. **Lease API** → `real_estate_lease_db`
5. **Payment API** → `real_estate_payment_db`
6. **Maintenance API** → `real_estate_maintenance_db`

## Connection String Format

```
Server=localhost;Database=real_estate_property_db;User=your_user;Password=your_password;
```

Replace the database name for each microservice accordingly.

## Notes

- All databases use InnoDB engine for transaction support
- UTF-8 (utf8mb4) character set for international character support
- Proper indexes on foreign keys and frequently queried columns
- Timestamps for created_at and updated_at fields
- Enum types for status fields to ensure data integrity
- Realistic dummy data with varied scenarios (active, pending, completed, etc.)

## Maintenance

To drop all databases and start fresh:

```sql
DROP DATABASE IF EXISTS real_estate_property_db;
DROP DATABASE IF EXISTS real_estate_owner_db;
DROP DATABASE IF EXISTS real_estate_tenant_db;
DROP DATABASE IF EXISTS real_estate_lease_db;
DROP DATABASE IF EXISTS real_estate_payment_db;
DROP DATABASE IF EXISTS real_estate_maintenance_db;
```

Then re-run the setup scripts.

---

**Last Updated:** 2024-11-18
**Version:** 1.0
**Author:** Real Estate Management System Team
