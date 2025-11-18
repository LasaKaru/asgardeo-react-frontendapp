-- ============================================
-- Owner Microservice Database Setup
-- ============================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS real_estate_owner_db;
CREATE DATABASE real_estate_owner_db;
USE real_estate_owner_db;

-- Create owners table
CREATE TABLE owners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_last_name (last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 10 dummy owners with realistic information
INSERT INTO owners (first_name, last_name, email, phone, address) VALUES
('John', 'Davidson', 'john.davidson@email.com', '206-555-0101', '1500 Lake Shore Drive, Seattle, WA 98103'),
('Sarah', 'Mitchell', 'sarah.mitchell@email.com', '503-555-0102', '2200 Pearl Street, Portland, OR 97210'),
('Michael', 'Thompson', 'michael.thompson@email.com', '415-555-0103', '3800 Market Street, San Francisco, CA 94102'),
('Emily', 'Rodriguez', 'emily.rodriguez@email.com', '512-555-0104', '4100 Congress Avenue, Austin, TX 78701'),
('David', 'Chen', 'david.chen@email.com', '303-555-0105', '5500 Broadway, Denver, CO 80203'),
('Jennifer', 'Anderson', 'jennifer.anderson@email.com', '971-555-0106', '6200 Division Street, Portland, OR 97206'),
('Robert', 'Martinez', 'robert.martinez@email.com', '619-555-0107', '7300 University Avenue, San Diego, CA 92103'),
('Lisa', 'Williams', 'lisa.williams@email.com', '720-555-0108', '8400 Cherry Creek Drive, Denver, CO 80209'),
('James', 'Taylor', 'james.taylor@email.com', '702-555-0109', '9100 Las Vegas Boulevard, Las Vegas, NV 89101'),
('Amanda', 'Brown', 'amanda.brown@email.com', '505-555-0110', '10200 Central Avenue, Albuquerque, NM 87102');

-- Display summary
SELECT 'Owner Database Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Owners FROM owners;
SELECT * FROM owners ORDER BY last_name;
