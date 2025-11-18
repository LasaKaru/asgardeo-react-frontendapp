# Database Setup for Real Estate Auth Service

This folder contains SQL migration scripts for setting up the authentication database.

## Quick Setup

Run all scripts in order:

```bash
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_create_users_table.sql
mysql -u root -p < 03_create_auth_tokens_table.sql
mysql -u root -p < 04_create_refresh_tokens_table.sql
mysql -u root -p < 05_seed_data.sql
```

Or run all at once:

```bash
cat 01_create_database.sql 02_create_users_table.sql 03_create_auth_tokens_table.sql 04_create_refresh_tokens_table.sql 05_seed_data.sql | mysql -u root -p
```

## Database Schema

### Tables

1. **users** - User accounts synchronized with Asgardeo
   - Stores user profile information
   - Links to Asgardeo user ID (sub claim)
   - Tracks login activity

2. **auth_tokens** - Asgardeo access tokens
   - Stores tokens received from Asgardeo
   - Tracks token expiration
   - Supports token revocation

3. **refresh_tokens** - JWT refresh tokens
   - Stores application refresh tokens
   - Links to Asgardeo refresh tokens
   - Supports token rotation

## Connection String

```
Server=127.0.0.1;Database=real_estate_db;User=root;Password=root;
```

## Entity Relationships

```
users (1) ----< (M) auth_tokens
users (1) ----< (M) refresh_tokens
```

## Indexes

Optimized indexes for:
- User lookups by email, username, Asgardeo ID
- Token validation queries
- Session management

## Notes

- All timestamps are in UTC
- Cascade delete on user removal
- Unique constraints on emails and Asgardeo user IDs
- Supports token revocation and rotation
