-- ============================================
-- Auth Tokens Table
-- Stores Asgardeo access tokens
-- ============================================

USE `real_estate_db`;

DROP TABLE IF EXISTS `auth_tokens`;

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

-- Display confirmation
SELECT 'Auth tokens table created successfully' AS Status;
