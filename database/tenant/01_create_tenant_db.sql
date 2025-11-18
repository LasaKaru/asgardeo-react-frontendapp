-- ============================================
-- Tenant Microservice Database Setup
-- ============================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS real_estate_tenant_db;
CREATE DATABASE real_estate_tenant_db;
USE real_estate_tenant_db;

-- Create tenants table
CREATE TABLE tenants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(200) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_last_name (last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 12 dummy tenants with realistic information
INSERT INTO tenants (first_name, last_name, email, phone, emergency_contact, emergency_phone) VALUES
('Alex', 'Johnson', 'alex.johnson@email.com', '206-555-1001', 'Maria Johnson (Mother)', '206-555-1002'),
('Rachel', 'Smith', 'rachel.smith@email.com', '503-555-1003', 'Tom Smith (Father)', '503-555-1004'),
('Kevin', 'Garcia', 'kevin.garcia@email.com', '415-555-1005', 'Isabella Garcia (Sister)', '415-555-1006'),
('Michelle', 'Lee', 'michelle.lee@email.com', '310-555-1007', 'David Lee (Spouse)', '310-555-1008'),
('Brian', 'Wilson', 'brian.wilson@email.com', '512-555-1009', 'Nancy Wilson (Mother)', '512-555-1010'),
('Nicole', 'Martinez', 'nicole.martinez@email.com', '971-555-1011', 'Carlos Martinez (Brother)', '971-555-1012'),
('Christopher', 'Taylor', 'christopher.taylor@email.com', '619-555-1013', 'Susan Taylor (Wife)', '619-555-1014'),
('Jessica', 'Anderson', 'jessica.anderson@email.com', '702-555-1015', 'Robert Anderson (Father)', '702-555-1016'),
('Matthew', 'Thomas', 'matthew.thomas@email.com', '303-555-1017', 'Linda Thomas (Mother)', '303-555-1018'),
('Ashley', 'Moore', 'ashley.moore@email.com', '480-555-1019', 'Jason Moore (Brother)', '480-555-1020'),
('Daniel', 'Jackson', 'daniel.jackson@email.com', '512-555-1021', 'Emily Jackson (Sister)', '512-555-1022'),
('Stephanie', 'White', 'stephanie.white@email.com', '505-555-1023', 'Mark White (Spouse)', '505-555-1024');

-- Display summary
SELECT 'Tenant Database Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Tenants FROM tenants;
SELECT * FROM tenants ORDER BY last_name;
