-- ============================================
-- Payment Microservice Database Setup
-- ============================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS real_estate_payment_db;
CREATE DATABASE real_estate_payment_db;
USE real_estate_payment_db;

-- Create payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lease_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    status ENUM('Paid', 'Pending', 'Overdue', 'Partial') NOT NULL DEFAULT 'Pending',
    payment_method ENUM('Credit Card', 'Bank Transfer', 'Check', 'Cash') NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lease_id (lease_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_paid_date (paid_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert 25 dummy payments with mix of paid and pending
INSERT INTO payments (lease_id, amount, due_date, paid_date, status, payment_method, notes) VALUES
-- Lease 1 payments (Property 1, Tenant 1)
(1, 2500.00, '2024-01-01', '2024-01-01', 'Paid', 'Bank Transfer', 'First month rent paid on time.'),
(1, 2500.00, '2024-02-01', '2024-02-01', 'Paid', 'Bank Transfer', 'February rent received.'),
(1, 2500.00, '2024-03-01', '2024-03-05', 'Paid', 'Bank Transfer', 'March rent paid with 4-day delay.'),
(1, 2500.00, '2024-04-01', '2024-04-01', 'Paid', 'Credit Card', 'April rent paid on time.'),
(1, 2500.00, '2024-05-01', '2024-05-01', 'Paid', 'Credit Card', 'May rent received.'),
(1, 2500.00, '2024-06-01', NULL, 'Overdue', NULL, 'June rent overdue. Reminder sent to tenant.'),

-- Lease 2 payments (Property 3, Tenant 2)
(2, 2800.00, '2024-03-01', '2024-03-01', 'Paid', 'Check', 'First month rent and security deposit paid.'),
(2, 2800.00, '2024-04-01', '2024-04-01', 'Paid', 'Check', 'April rent received on time.'),
(2, 2800.00, '2024-05-01', '2024-05-02', 'Paid', 'Bank Transfer', 'May rent paid via bank transfer.'),
(2, 2800.00, '2024-06-01', NULL, 'Pending', NULL, 'June rent due soon.'),

-- Lease 3 payments (Property 5, Tenant 3)
(3, 1500.00, '2024-01-01', '2023-12-30', 'Paid', 'Cash', 'Rent paid early.'),
(3, 1500.00, '2024-02-01', '2024-02-01', 'Paid', 'Cash', 'February rent received.'),
(3, 1500.00, '2024-03-01', '2024-03-01', 'Paid', 'Credit Card', 'Switched to credit card payment.'),
(3, 1500.00, '2024-04-01', '2024-04-10', 'Paid', 'Credit Card', 'April rent paid late. Late fee waived.'),
(3, 1500.00, '2024-05-01', NULL, 'Pending', NULL, 'May rent pending.'),

-- Lease 4 payments (Property 8, Tenant 4)
(4, 1900.00, '2024-06-01', '2024-06-01', 'Paid', 'Bank Transfer', 'First month rent paid.'),
(4, 1900.00, '2024-07-01', NULL, 'Pending', NULL, 'July rent due.'),

-- Lease 5 payments (Property 10, Tenant 5)
(5, 2400.00, '2024-01-01', '2024-01-01', 'Paid', 'Bank Transfer', 'Two-year lease first payment.'),
(5, 2400.00, '2024-02-01', '2024-02-01', 'Paid', 'Bank Transfer', 'February rent on time.'),
(5, 2400.00, '2024-03-01', '2024-03-01', 'Paid', 'Bank Transfer', 'March rent received.'),
(5, 2400.00, '2024-04-01', '2024-04-15', 'Paid', 'Check', 'April rent paid late with penalty.'),
(5, 2400.00, '2024-05-01', NULL, 'Pending', NULL, 'May rent pending.'),

-- Lease 6 payments (Property 13, Tenant 6)
(6, 2700.00, '2024-02-15', '2024-02-15', 'Paid', 'Credit Card', 'Initial rent payment.'),
(6, 2700.00, '2024-03-15', '2024-03-15', 'Paid', 'Credit Card', 'Second month rent paid.'),
(6, 1350.00, '2024-04-15', '2024-04-15', 'Partial', 'Credit Card', 'Partial payment received. Balance pending.');

-- Display summary
SELECT 'Payment Database Created Successfully!' AS Status;
SELECT COUNT(*) AS Total_Payments FROM payments;
SELECT status, COUNT(*) AS Count FROM payments GROUP BY status;
SELECT payment_method, COUNT(*) AS Count FROM payments WHERE payment_method IS NOT NULL GROUP BY payment_method;
SELECT
    p.id AS Payment_ID,
    p.lease_id AS Lease_ID,
    p.amount AS Amount,
    p.due_date AS Due_Date,
    p.paid_date AS Paid_Date,
    p.status AS Status,
    p.payment_method AS Method
FROM payments p
ORDER BY p.due_date DESC
LIMIT 15;
