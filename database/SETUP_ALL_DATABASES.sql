-- ============================================
-- MASTER DATABASE SETUP SCRIPT
-- Real Estate Management System - All Microservices
-- ============================================
--
-- This script creates and populates all 6 microservice databases:
-- 1. Property Database (real_estate_property_db)
-- 2. Owner Database (real_estate_owner_db)
-- 3. Tenant Database (real_estate_tenant_db)
-- 4. Lease Database (real_estate_lease_db)
-- 5. Payment Database (real_estate_payment_db)
-- 6. Maintenance Database (real_estate_maintenance_db)
--
-- Usage:
--   mysql -u root -p < SETUP_ALL_DATABASES.sql
--
--   Or from MySQL CLI:
--   SOURCE /home/user/asgardeo-react-frontendapp/database/SETUP_ALL_DATABASES.sql;
--
-- ============================================

-- Display startup message
SELECT '============================================' AS '';
SELECT 'REAL ESTATE MANAGEMENT SYSTEM' AS '';
SELECT 'Database Setup Starting...' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';

-- ============================================
-- 1. PROPERTY DATABASE SETUP
-- ============================================
SELECT '--------------------------------------------' AS '';
SELECT '1/6: Setting up Property Database...' AS '';
SELECT '--------------------------------------------' AS '';

SOURCE /home/user/asgardeo-react-frontendapp/database/property/01_create_property_db.sql;

SELECT '' AS '';
SELECT '✓ Property Database Complete' AS '';
SELECT '' AS '';

-- ============================================
-- 2. OWNER DATABASE SETUP
-- ============================================
SELECT '--------------------------------------------' AS '';
SELECT '2/6: Setting up Owner Database...' AS '';
SELECT '--------------------------------------------' AS '';

SOURCE /home/user/asgardeo-react-frontendapp/database/owner/01_create_owner_db.sql;

SELECT '' AS '';
SELECT '✓ Owner Database Complete' AS '';
SELECT '' AS '';

-- ============================================
-- 3. TENANT DATABASE SETUP
-- ============================================
SELECT '--------------------------------------------' AS '';
SELECT '3/6: Setting up Tenant Database...' AS '';
SELECT '--------------------------------------------' AS '';

SOURCE /home/user/asgardeo-react-frontendapp/database/tenant/01_create_tenant_db.sql;

SELECT '' AS '';
SELECT '✓ Tenant Database Complete' AS '';
SELECT '' AS '';

-- ============================================
-- 4. LEASE DATABASE SETUP
-- ============================================
SELECT '--------------------------------------------' AS '';
SELECT '4/6: Setting up Lease Database...' AS '';
SELECT '--------------------------------------------' AS '';

SOURCE /home/user/asgardeo-react-frontendapp/database/lease/01_create_lease_db.sql;

SELECT '' AS '';
SELECT '✓ Lease Database Complete' AS '';
SELECT '' AS '';

-- ============================================
-- 5. PAYMENT DATABASE SETUP
-- ============================================
SELECT '--------------------------------------------' AS '';
SELECT '5/6: Setting up Payment Database...' AS '';
SELECT '--------------------------------------------' AS '';

SOURCE /home/user/asgardeo-react-frontendapp/database/payment/01_create_payment_db.sql;

SELECT '' AS '';
SELECT '✓ Payment Database Complete' AS '';
SELECT '' AS '';

-- ============================================
-- 6. MAINTENANCE DATABASE SETUP
-- ============================================
SELECT '--------------------------------------------' AS '';
SELECT '6/6: Setting up Maintenance Database...' AS '';
SELECT '--------------------------------------------' AS '';

SOURCE /home/user/asgardeo-react-frontendapp/database/maintenance/01_create_maintenance_db.sql;

SELECT '' AS '';
SELECT '✓ Maintenance Database Complete' AS '';
SELECT '' AS '';

-- ============================================
-- FINAL SUMMARY
-- ============================================
SELECT '============================================' AS '';
SELECT 'ALL DATABASES CREATED SUCCESSFULLY!' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';

-- Display database summary
SELECT '--------------------------------------------' AS '';
SELECT 'DATABASE SUMMARY' AS '';
SELECT '--------------------------------------------' AS '';

SELECT
    'real_estate_property_db' AS Database_Name,
    (SELECT COUNT(*) FROM real_estate_property_db.properties) AS Record_Count,
    'Properties (Apartments, Houses, Condos, Townhouses)' AS Description;

SELECT
    'real_estate_owner_db' AS Database_Name,
    (SELECT COUNT(*) FROM real_estate_owner_db.owners) AS Record_Count,
    'Property Owners' AS Description;

SELECT
    'real_estate_tenant_db' AS Database_Name,
    (SELECT COUNT(*) FROM real_estate_tenant_db.tenants) AS Record_Count,
    'Tenants with Emergency Contacts' AS Description;

SELECT
    'real_estate_lease_db' AS Database_Name,
    (SELECT COUNT(*) FROM real_estate_lease_db.leases) AS Record_Count,
    'Lease Agreements (Active, Expired, Pending, Terminated)' AS Description;

SELECT
    'real_estate_payment_db' AS Database_Name,
    (SELECT COUNT(*) FROM real_estate_payment_db.payments) AS Record_Count,
    'Payment Records (Paid, Pending, Overdue, Partial)' AS Description;

SELECT
    'real_estate_maintenance_db' AS Database_Name,
    (SELECT COUNT(*) FROM real_estate_maintenance_db.maintenance_requests) AS Record_Count,
    'Maintenance Requests (Open, In Progress, Completed, Cancelled)' AS Description;

SELECT '' AS '';
SELECT '--------------------------------------------' AS '';
SELECT 'QUICK STATISTICS' AS '';
SELECT '--------------------------------------------' AS '';

-- Property statistics
SELECT 'PROPERTIES BY STATUS:' AS '';
SELECT status, COUNT(*) AS count
FROM real_estate_property_db.properties
GROUP BY status;

SELECT '' AS '';
SELECT 'PROPERTIES BY TYPE:' AS '';
SELECT property_type, COUNT(*) AS count
FROM real_estate_property_db.properties
GROUP BY property_type;

SELECT '' AS '';

-- Lease statistics
SELECT 'LEASES BY STATUS:' AS '';
SELECT status, COUNT(*) AS count
FROM real_estate_lease_db.leases
GROUP BY status;

SELECT '' AS '';

-- Payment statistics
SELECT 'PAYMENTS BY STATUS:' AS '';
SELECT status, COUNT(*) AS count
FROM real_estate_payment_db.payments
GROUP BY status;

SELECT '' AS '';

-- Maintenance statistics
SELECT 'MAINTENANCE BY STATUS:' AS '';
SELECT status, COUNT(*) AS count
FROM real_estate_maintenance_db.maintenance_requests
GROUP BY status;

SELECT '' AS '';
SELECT 'MAINTENANCE BY PRIORITY:' AS '';
SELECT priority, COUNT(*) AS count
FROM real_estate_maintenance_db.maintenance_requests
GROUP BY priority;

SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Setup Complete! All databases are ready.' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';
SELECT 'To verify installation:' AS '';
SELECT '  SHOW DATABASES;' AS '';
SELECT '  USE real_estate_property_db;' AS '';
SELECT '  SHOW TABLES;' AS '';
SELECT '' AS '';
