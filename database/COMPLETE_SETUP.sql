-- ============================================
-- COMPLETE DATABASE SETUP SCRIPT
-- Real Estate Authentication Service
-- Run this single file to set up everything
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS `real_estate_db`
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE `real_estate_db`;

-- ============================================
-- Users Table
-- ============================================
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `auth_tokens`;
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

-- ============================================
-- Auth Tokens Table
-- ============================================
CREATE TABLE `auth_tokens` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL COMMENT 'Foreign key to users table',
    `asgardeo_access_token` TEXT NOT NULL COMMENT 'Access token from Asgardeo',
    `asgardeo_id_token` TEXT NULL COMMENT 'ID token from Asgardeo',
    `token_type` VARCHAR(50) DEFAULT 'Bearer' COMMENT 'Token type (usually Bearer)',
    `expires_in` INT NOT NULL COMMENT 'Token expiry in seconds',
    `scope` TEXT NULL COMMENT 'Token scope/permissions',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Token creation timestamp',
    `expires_at` DATETIME NOT NULL COMMENT 'Token expiration timestamp',
    `is_revoked` BOOLEAN DEFAULT FALSE COMMENT 'Whether token has been revoked',
    `revoked_at` DATETIME NULL COMMENT 'Token revocation timestamp',

    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_expires_at` (`expires_at`),
    INDEX `idx_is_revoked` (`is_revoked`),
    INDEX `idx_user_revoked` (`user_id`, `is_revoked`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Asgardeo authentication tokens';

-- ============================================
-- Refresh Tokens Table
-- ============================================
CREATE TABLE `refresh_tokens` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL COMMENT 'Foreign key to users table',
    `token` VARCHAR(500) NOT NULL UNIQUE COMMENT 'JWT refresh token',
    `asgardeo_refresh_token` TEXT NULL COMMENT 'Asgardeo refresh token if available',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Token creation timestamp',
    `expires_at` DATETIME NOT NULL COMMENT 'Token expiration timestamp',
    `is_used` BOOLEAN DEFAULT FALSE COMMENT 'Whether token has been used',
    `is_revoked` BOOLEAN DEFAULT FALSE COMMENT 'Whether token has been revoked',
    `revoked_at` DATETIME NULL COMMENT 'Token revocation timestamp',

    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_token` (`token`),
    INDEX `idx_expires_at` (`expires_at`),
    INDEX `idx_user_status` (`user_id`, `is_used`, `is_revoked`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='JWT refresh tokens for session management';

-- ============================================
-- Confirmation
-- ============================================
SELECT 'Database setup completed successfully!' AS Status;
SELECT 'Database: real_estate_db' AS Database_Name;
SELECT 'Tables created: users, auth_tokens, refresh_tokens' AS Tables_Created;
SELECT 'Character Set: utf8mb4' AS Character_Set;
SELECT 'Collation: utf8mb4_unicode_ci' AS Collation;
