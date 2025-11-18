-- ============================================
-- Property Microservice Database Setup
-- ============================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS real_estate_property_db;
CREATE DATABASE real_estate_property_db;
USE real_estate_property_db;

-- Create properties table
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    property_type ENUM('Apartment', 'House', 'Condo', 'Townhouse') NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    square_feet INT NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance', 'Sold') NOT NULL DEFAULT 'Available',
    owner_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_owner_id (owner_id),
    INDEX idx_property_type (property_type),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 15 dummy properties with realistic data
INSERT INTO properties (address, city, state, zip_code, property_type, bedrooms, bathrooms, square_feet, rent_amount, status, owner_id, description) VALUES
('123 Oak Street', 'Seattle', 'Washington', '98101', 'Apartment', 2, 2.0, 1200, 2500.00, 'Occupied', 1, 'Modern apartment in downtown Seattle with stunning city views. Close to public transportation and shopping centers.'),
('456 Maple Avenue', 'Portland', 'Oregon', '97201', 'House', 4, 3.0, 2500, 3200.00, 'Available', 2, 'Spacious family home with large backyard, updated kitchen, and hardwood floors throughout.'),
('789 Pine Boulevard', 'San Francisco', 'California', '94102', 'Condo', 1, 1.0, 850, 2800.00, 'Occupied', 3, 'Cozy condo in the heart of San Francisco. Walking distance to restaurants and parks.'),
('321 Elm Drive', 'Los Angeles', 'California', '90001', 'Townhouse', 3, 2.5, 1800, 2900.00, 'Available', 1, 'Beautiful townhouse with attached garage, central AC, and modern amenities.'),
('654 Cedar Lane', 'Austin', 'Texas', '78701', 'Apartment', 1, 1.0, 750, 1500.00, 'Occupied', 4, 'Affordable studio apartment perfect for young professionals. Pet-friendly building.'),
('987 Birch Court', 'Denver', 'Colorado', '80201', 'House', 5, 4.0, 3200, 3500.00, 'Available', 5, 'Luxurious home in prime location with mountain views, finished basement, and 2-car garage.'),
('147 Spruce Way', 'Seattle', 'Washington', '98102', 'Condo', 2, 2.0, 1100, 2200.00, 'Maintenance', 2, 'Contemporary condo with granite countertops and stainless steel appliances. Currently under maintenance.'),
('258 Willow Street', 'Portland', 'Oregon', '97202', 'Apartment', 3, 2.0, 1400, 1900.00, 'Occupied', 6, 'Bright and airy apartment with balcony, in-unit laundry, and parking included.'),
('369 Aspen Road', 'Phoenix', 'Arizona', '85001', 'House', 3, 2.0, 2000, 2100.00, 'Available', 3, 'Desert-style home with pool, covered patio, and energy-efficient solar panels.'),
('741 Redwood Circle', 'San Diego', 'California', '92101', 'Townhouse', 2, 1.5, 1300, 2400.00, 'Occupied', 7, 'Modern townhouse near the beach with ocean breeze and community amenities.'),
('852 Cypress Avenue', 'Austin', 'Texas', '78702', 'Apartment', 2, 2.0, 1050, 1800.00, 'Available', 4, 'Updated apartment in trendy neighborhood with fitness center and pool access.'),
('963 Poplar Lane', 'Denver', 'Colorado', '80202', 'Condo', 3, 2.5, 1600, 2600.00, 'Sold', 8, 'Recently renovated condo with open floor plan and mountain views. Recently sold.'),
('159 Hickory Drive', 'Las Vegas', 'Nevada', '89101', 'House', 4, 3.5, 2800, 2700.00, 'Occupied', 9, 'Entertainment-ready home with game room, upgraded kitchen, and resort-style backyard.'),
('357 Magnolia Street', 'Albuquerque', 'New Mexico', '87101', 'Apartment', 1, 1.0, 800, 1200.00, 'Available', 10, 'Cozy apartment with southwestern charm, great for singles or couples.'),
('486 Sycamore Boulevard', 'Salt Lake City', 'Utah', '84101', 'Townhouse', 3, 2.5, 1700, 2300.00, 'Available', 5, 'Well-maintained townhouse with mountain access, perfect for outdoor enthusiasts.');

-- Display summary
SELECT 'Property Database Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Properties FROM properties;
SELECT status, COUNT(*) AS Count FROM properties GROUP BY status;
SELECT property_type, COUNT(*) AS Count FROM properties GROUP BY property_type;
