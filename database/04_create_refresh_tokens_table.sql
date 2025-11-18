-- ============================================
-- Refresh Tokens Table
-- Stores JWT refresh tokens
-- ============================================

USE `real_estate_db`;

DROP TABLE IF EXISTS `refresh_tokens`;

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

-- Display confirmation
SELECT 'Refresh tokens table created successfully' AS Status;
