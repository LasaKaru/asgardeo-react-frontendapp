-- ============================================
-- Users Table
-- Stores user information from Asgardeo
-- ============================================

USE `real_estate_db`;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `asgardeo_user_id` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique user ID from Asgardeo (sub claim)',
    `username` VARCHAR(255) NOT NULL COMMENT 'Username from Asgardeo',
    `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'User email address',
    `first_name` VARCHAR(255) NULL COMMENT 'User first name',
    `last_name` VARCHAR(255) NULL COMMENT 'User last name',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Whether user account is active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    `last_login` DATETIME NULL COMMENT 'Last login timestamp',

    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`),
    INDEX `idx_asgardeo_user_id` (`asgardeo_user_id`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User accounts synchronized with Asgardeo';

-- Display confirmation
SELECT 'Users table created successfully' AS Status;
