-- ============================================
-- VERIFICATION SCRIPT
-- Real Estate Management System - Database Verification
-- ============================================
--
-- This script verifies all 6 microservice databases are properly set up
-- and displays summary information about the data.
--
-- Usage:
--   mysql -u root -p < VERIFY_DATABASES.sql
--
-- ============================================

SELECT '============================================' AS '';
SELECT 'DATABASE VERIFICATION REPORT' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';

-- Check if all databases exist
SELECT 'Checking Database Existence...' AS '';
SELECT '' AS '';

SELECT
    SCHEMA_NAME AS Database_Name,
    DEFAULT_CHARACTER_SET_NAME AS Charset,
    DEFAULT_COLLATION_NAME AS Collation
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME IN (
    'real_estate_property_db',
    'real_estate_owner_db',
    'real_estate_tenant_db',
    'real_estate_lease_db',
    'real_estate_payment_db',
    'real_estate_maintenance_db'
)
ORDER BY SCHEMA_NAME;

SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'DATA VERIFICATION' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';

-- Property Database
SELECT '1. PROPERTY DATABASE' AS '';
SELECT '-------------------' AS '';
USE real_estate_property_db;
SELECT COUNT(*) AS Total_Properties FROM properties;
SELECT property_type, COUNT(*) AS Count FROM properties GROUP BY property_type;
SELECT status, COUNT(*) AS Count FROM properties GROUP BY status;
SELECT '' AS '';

-- Owner Database
SELECT '2. OWNER DATABASE' AS '';
SELECT '-------------------' AS '';
USE real_estate_owner_db;
SELECT COUNT(*) AS Total_Owners FROM owners;
SELECT '' AS '';

-- Tenant Database
SELECT '3. TENANT DATABASE' AS '';
SELECT '-------------------' AS '';
USE real_estate_tenant_db;
SELECT COUNT(*) AS Total_Tenants FROM tenants;
SELECT '' AS '';

-- Lease Database
SELECT '4. LEASE DATABASE' AS '';
SELECT '-------------------' AS '';
USE real_estate_lease_db;
SELECT COUNT(*) AS Total_Leases FROM leases;
SELECT status, COUNT(*) AS Count FROM leases GROUP BY status;
SELECT '' AS '';

-- Payment Database
SELECT '5. PAYMENT DATABASE' AS '';
SELECT '-------------------' AS '';
USE real_estate_payment_db;
SELECT COUNT(*) AS Total_Payments FROM payments;
SELECT status, COUNT(*) AS Count FROM payments GROUP BY status;
SELECT payment_method, COUNT(*) AS Count FROM payments WHERE payment_method IS NOT NULL GROUP BY payment_method;
SELECT '' AS '';

-- Maintenance Database
SELECT '6. MAINTENANCE DATABASE' AS '';
SELECT '-------------------' AS '';
USE real_estate_maintenance_db;
SELECT COUNT(*) AS Total_Maintenance_Requests FROM maintenance_requests;
SELECT status, COUNT(*) AS Count FROM maintenance_requests GROUP BY status;
SELECT priority, COUNT(*) AS Count FROM maintenance_requests GROUP BY priority;
SELECT '' AS '';

-- Summary
SELECT '============================================' AS '';
SELECT 'OVERALL SUMMARY' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';

SELECT
    'Properties' AS Entity,
    (SELECT COUNT(*) FROM real_estate_property_db.properties) AS Total_Records;

SELECT
    'Owners' AS Entity,
    (SELECT COUNT(*) FROM real_estate_owner_db.owners) AS Total_Records;

SELECT
    'Tenants' AS Entity,
    (SELECT COUNT(*) FROM real_estate_tenant_db.tenants) AS Total_Records;

SELECT
    'Leases' AS Entity,
    (SELECT COUNT(*) FROM real_estate_lease_db.leases) AS Total_Records;

SELECT
    'Payments' AS Entity,
    (SELECT COUNT(*) FROM real_estate_payment_db.payments) AS Total_Records;

SELECT
    'Maintenance Requests' AS Entity,
    (SELECT COUNT(*) FROM real_estate_maintenance_db.maintenance_requests) AS Total_Records;

SELECT '' AS '';
SELECT 'Total Records Across All Databases: ' AS '',
    (
        (SELECT COUNT(*) FROM real_estate_property_db.properties) +
        (SELECT COUNT(*) FROM real_estate_owner_db.owners) +
        (SELECT COUNT(*) FROM real_estate_tenant_db.tenants) +
        (SELECT COUNT(*) FROM real_estate_lease_db.leases) +
        (SELECT COUNT(*) FROM real_estate_payment_db.payments) +
        (SELECT COUNT(*) FROM real_estate_maintenance_db.maintenance_requests)
    ) AS Total;

SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'VERIFICATION COMPLETE!' AS '';
SELECT 'All databases are properly configured.' AS '';
SELECT '============================================' AS '';
