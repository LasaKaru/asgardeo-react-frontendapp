-- ============================================
-- Lease Microservice Database Setup
-- ============================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS real_estate_lease_db;
CREATE DATABASE real_estate_lease_db;
USE real_estate_lease_db;

-- Create leases table
CREATE TABLE leases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    status ENUM('Active', 'Expired', 'Terminated', 'Pending') NOT NULL DEFAULT 'Pending',
    terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_property_id (property_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 10 dummy leases with realistic data linking properties and tenants
INSERT INTO leases (property_id, tenant_id, start_date, end_date, rent_amount, security_deposit, status, terms) VALUES
(1, 1, '2024-01-01', '2024-12-31', 2500.00, 2500.00, 'Active', 'Standard 1-year lease. Tenant responsible for utilities. No smoking. Pets allowed with additional deposit.'),
(3, 2, '2024-03-01', '2025-02-28', 2800.00, 2800.00, 'Active', '1-year lease with option to renew. Tenant pays all utilities. No pets allowed.'),
(5, 3, '2023-09-01', '2024-08-31', 1500.00, 1500.00, 'Active', '1-year lease. Water and trash included. Pet-friendly. One parking space included.'),
(8, 4, '2024-06-01', '2025-05-31', 1900.00, 1900.00, 'Active', 'Annual lease with 60-day notice required for non-renewal. Laundry included in unit.'),
(10, 5, '2023-12-01', '2025-11-30', 2400.00, 2400.00, 'Active', '2-year lease agreement. Tenant maintains yard. HOA fees included in rent.'),
(13, 6, '2024-02-15', '2025-02-14', 2700.00, 2700.00, 'Active', '1-year lease. All appliances included. Tenant responsible for all utilities.'),
(2, 7, '2023-08-01', '2024-07-31', 3200.00, 3200.00, 'Expired', '1-year lease expired. Property now available for new tenants.'),
(9, 8, '2024-04-01', '2024-09-30', 2100.00, 2100.00, 'Terminated', '6-month lease terminated early due to tenant relocation. Security deposit refunded.'),
(4, 9, '2024-11-01', '2025-10-31', 2900.00, 2900.00, 'Pending', '1-year lease pending final approval. Background check completed. Move-in scheduled.'),
(11, 10, '2024-10-15', '2025-10-14', 1800.00, 1800.00, 'Pending', 'Annual lease awaiting first month rent payment. Pet deposit of $500 additional.');

-- Display summary
SELECT 'Lease Database Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Leases FROM leases;
SELECT status, COUNT(*) AS Count FROM leases GROUP BY status;
SELECT
    l.id AS Lease_ID,
    l.property_id AS Property,
    l.tenant_id AS Tenant,
    l.rent_amount AS Rent,
    l.status AS Status,
    l.start_date AS Start_Date,
    l.end_date AS End_Date
FROM leases l
ORDER BY l.start_date DESC;
