-- ============================================
-- Maintenance Microservice Database Setup
-- ============================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS real_estate_maintenance_db;
CREATE DATABASE real_estate_maintenance_db;
USE real_estate_maintenance_db;

-- Create maintenance_requests table
CREATE TABLE maintenance_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
    reported_date DATE NOT NULL,
    completed_date DATE NULL,
    assigned_to VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_property_id (property_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_reported_date (reported_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 20 dummy maintenance requests with various statuses and priorities
INSERT INTO maintenance_requests (property_id, title, description, status, priority, reported_date, completed_date, assigned_to, notes) VALUES
(1, 'Leaking Kitchen Faucet', 'Kitchen faucet has been dripping continuously for 3 days. Water waste concern.', 'Completed', 'Medium', '2024-05-10', '2024-05-12', 'Mike Johnson - Plumbing', 'Replaced faucet cartridge. Issue resolved.'),
(1, 'AC Not Cooling', 'Air conditioning unit not cooling properly. Temperature reads 80°F despite setting 70°F.', 'In Progress', 'High', '2024-06-15', NULL, 'Sarah Tech - HVAC', 'Scheduled for refrigerant check and filter replacement.'),
(2, 'Broken Garage Door Opener', 'Garage door opener motor not functioning. Door stuck in closed position.', 'Completed', 'High', '2024-04-20', '2024-04-22', 'Tom Wilson - General', 'Replaced motor unit. Tested successfully.'),
(3, 'Dishwasher Not Draining', 'Dishwasher fills but does not drain properly. Standing water at bottom.', 'Completed', 'Medium', '2024-05-05', '2024-05-07', 'Mike Johnson - Plumbing', 'Cleared drain hose blockage. Working properly now.'),
(5, 'Smoke Detector Beeping', 'Smoke detector in hallway beeping intermittently. Battery replacement needed.', 'Completed', 'Low', '2024-06-01', '2024-06-02', 'Building Maintenance', 'Replaced battery. Tested all units.'),
(5, 'Clogged Bathroom Sink', 'Bathroom sink draining very slowly. Appears to be hair clog.', 'Open', 'Low', '2024-06-18', NULL, NULL, 'Scheduled for next week.'),
(7, 'Broken Window Lock', 'Bedroom window lock broken. Security concern for tenant.', 'Completed', 'Medium', '2024-05-15', '2024-05-16', 'Tom Wilson - General', 'Replaced lock mechanism. Secure now.'),
(8, 'Water Heater Not Working', 'No hot water for past 12 hours. Water heater appears to be malfunctioning.', 'Completed', 'Urgent', '2024-06-10', '2024-06-10', 'Mike Johnson - Plumbing', 'Emergency service. Reset pilot light and checked thermostat.'),
(8, 'Cabinet Door Loose', 'Kitchen cabinet door hinge loose. Door hanging at angle.', 'In Progress', 'Low', '2024-06-17', NULL, 'Tom Wilson - General', 'Parts ordered. Installation scheduled.'),
(10, 'Electrical Outlet Not Working', 'Living room outlet not providing power. May be circuit breaker issue.', 'Completed', 'Medium', '2024-05-25', '2024-05-26', 'Electric Pro Services', 'Reset GFCI outlet. Circuit working properly.'),
(10, 'Fence Panel Damaged', 'Backyard fence panel damaged by storm. Needs replacement for security.', 'Open', 'Medium', '2024-06-16', NULL, NULL, 'Waiting for material delivery.'),
(13, 'Refrigerator Making Noise', 'Refrigerator making loud humming noise. Freezer temperature fluctuating.', 'In Progress', 'High', '2024-06-12', NULL, 'ApplianceFix Corp', 'Diagnosed compressor issue. Part ordered.'),
(2, 'Roof Leak During Rain', 'Water leaking from ceiling in master bedroom during heavy rain.', 'Completed', 'Urgent', '2024-05-08', '2024-05-09', 'Rapid Roof Repair', 'Emergency repair completed. Full inspection recommended.'),
(4, 'Washing Machine Not Spinning', 'Washing machine fills with water but drum does not spin during cycle.', 'Completed', 'Medium', '2024-06-05', '2024-06-07', 'ApplianceFix Corp', 'Replaced drive belt. Machine functioning normally.'),
(9, 'Pool Filter Malfunction', 'Pool filter not circulating water properly. Pool water becoming cloudy.', 'Open', 'High', '2024-06-14', NULL, 'Pool Maintenance Pro', 'Inspection scheduled for this week.'),
(9, 'Backyard Sprinkler Broken', 'Two sprinkler heads broken in backyard irrigation system.', 'Completed', 'Low', '2024-05-20', '2024-05-22', 'Landscape Services', 'Replaced broken sprinkler heads.'),
(11, 'Thermostat Not Responding', 'Digital thermostat display blank. Not responding to controls.', 'In Progress', 'Medium', '2024-06-13', NULL, 'Sarah Tech - HVAC', 'Testing electrical connections.'),
(13, 'Front Door Lock Sticking', 'Front door deadbolt difficult to turn. Key getting stuck.', 'Open', 'Low', '2024-06-19', NULL, NULL, 'Scheduled for locksmith visit.'),
(15, 'Pest Control Needed', 'Tenant reports ant infestation in kitchen area. Immediate treatment needed.', 'Completed', 'Medium', '2024-06-08', '2024-06-09', 'Pest Control Plus', 'Treated kitchen and perimeter. Follow-up scheduled.'),
(15, 'Gutter Cleaning Required', 'Gutters overflowing during rain. Appears to be clogged with leaves and debris.', 'Cancelled', 'Low', '2024-05-01', NULL, NULL, 'Tenant opted to clean themselves.');

-- Display summary
SELECT 'Maintenance Database Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Requests FROM maintenance_requests;
SELECT status, COUNT(*) AS Count FROM maintenance_requests GROUP BY status;
SELECT priority, COUNT(*) AS Count FROM maintenance_requests GROUP BY priority;
SELECT
    m.id AS Request_ID,
    m.property_id AS Property,
    m.title AS Issue,
    m.status AS Status,
    m.priority AS Priority,
    m.reported_date AS Reported,
    m.assigned_to AS Assigned_To
FROM maintenance_requests m
ORDER BY
    FIELD(m.priority, 'Urgent', 'High', 'Medium', 'Low'),
    FIELD(m.status, 'Open', 'In Progress', 'Completed', 'Cancelled'),
    m.reported_date DESC
LIMIT 15;
