# Authentication Service

## Overview

The **Authentication Service** is responsible for user authentication, authorization, and token management using Asgardeo OAuth2/OIDC integration.

## Port

**5000**

## Database

**Database Name:** `real_estate_auth_db`

**Tables:**
- `users` - User profiles from Asgardeo
- `auth_tokens` - Asgardeo access tokens storage
- `refresh_tokens` - JWT refresh token management

## Features

✅ **Asgardeo Integration**
- OAuth2/OIDC authentication
- Token validation with Asgardeo API
- User info retrieval

✅ **JWT Token Management**
- Generate JWT access tokens
- Generate refresh tokens
- Token validation
- Token refresh mechanism

✅ **User Management**
- Create user on first login
- Update user profile
- Track last login
- User session management

✅ **Security**
- Secure token storage
- Token revocation on logout
- Refresh token rotation
- Password-less authentication

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Authenticate with Asgardeo tokens

**Request:**
```json
{
  "code": "",
  "accessToken": "asgardeo_access_token",
  "idToken": "asgardeo_id_token",
  "refreshToken": "",
  "expiresIn": 3600,
  "scope": "openid profile"
}
```

**Response:**
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST `/api/auth/refresh`
Refresh JWT access token

**Request:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": { ... }
}
```

#### POST `/api/auth/logout`
Logout and revoke tokens (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/validate`
Validate current session (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "valid": true,
  "userId": 1,
  "username": "user@example.com",
  "email": "user@example.com"
}
```

#### GET `/api/auth/user`
Get current user info (requires authentication)

**Headers:**
```
Authorization: Bearer {jwt_access_token}
```

**Response:**
```json
{
  "id": 1,
  "username": "user@example.com",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

## Configuration

### Required Settings

Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1;Database=real_estate_auth_db;User=root;Password=root;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "Asgardeo": {
    "ClientId": "YOUR_ASGARDEO_CLIENT_ID",
    "ClientSecret": "YOUR_ASGARDEO_CLIENT_SECRET",
    "TokenEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/token",
    "UserInfoEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/userinfo",
    "IntrospectEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/introspect"
  }
}
```

### Asgardeo Setup

1. Go to https://console.asgardeo.io/
2. Create a new application (Single Page Application)
3. Configure:
   - **Name:** Real Estate Management
   - **Redirect URLs:** `http://localhost:3001`
4. Note down Client ID and Client Secret
5. Update `appsettings.json` with your credentials

## How to Run

### Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+ running
- Database `real_estate_auth_db` created and migrated

### Setup Database

```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < auth/01_create_auth_db.sql
```

Or use the complete setup:
```bash
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Run Service

```bash
cd AuthService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The service will start on **http://localhost:5000**

### Verify Service is Running

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"..."}
```

### Access Swagger Documentation

Open browser: **http://localhost:5000/swagger**

## Testing

### Test Login (with cURL)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "YOUR_ASGARDEO_ACCESS_TOKEN",
    "idToken": "YOUR_ASGARDEO_ID_TOKEN",
    "expiresIn": 3600
  }'
```

### Test Token Validation

```bash
curl -X GET http://localhost:5000/api/auth/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Components

1. **Controllers/AuthController.cs**
   - Handles HTTP requests
   - Routes to appropriate services
   - Returns HTTP responses

2. **Services/AuthService.cs**
   - Business logic for authentication
   - User creation and updates
   - Token storage

3. **Services/JwtTokenService.cs**
   - JWT token generation
   - Token validation
   - Refresh token generation

4. **Services/AsgardeoService.cs**
   - Asgardeo API integration
   - Token validation with Asgardeo
   - User info retrieval

5. **Data/AuthDbContext.cs**
   - Entity Framework database context
   - Database access

6. **Models/**
   - User.cs - User entity
   - AuthToken.cs - Asgardeo token storage
   - RefreshToken.cs - JWT refresh tokens

## Database Schema

### users table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| asgardeo_user_id | VARCHAR(255) | Unique ID from Asgardeo |
| username | VARCHAR(255) | Username |
| email | VARCHAR(255) | Email (unique) |
| first_name | VARCHAR(255) | First name |
| last_name | VARCHAR(255) | Last name |
| is_active | BOOLEAN | Account status |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |
| last_login | DATETIME | Last login timestamp |

### auth_tokens table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| user_id | INT | Foreign key to users |
| asgardeo_access_token | TEXT | Asgardeo access token |
| asgardeo_id_token | TEXT | Asgardeo ID token |
| token_type | VARCHAR(50) | Token type (Bearer) |
| expires_in | INT | Expiry in seconds |
| scope | TEXT | Token scope |
| created_at | DATETIME | Creation timestamp |
| expires_at | DATETIME | Expiration timestamp |
| is_revoked | BOOLEAN | Revoked status |
| revoked_at | DATETIME | Revocation timestamp |

### refresh_tokens table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| user_id | INT | Foreign key to users |
| token | VARCHAR(500) | JWT refresh token (unique) |
| asgardeo_refresh_token | TEXT | Asgardeo refresh token |
| created_at | DATETIME | Creation timestamp |
| expires_at | DATETIME | Expiration timestamp |
| is_used | BOOLEAN | Used status |
| is_revoked | BOOLEAN | Revoked status |
| revoked_at | DATETIME | Revocation timestamp |

## Security Considerations

### JWT Secret
- Must be at least 32 characters
- Use a cryptographically secure random string
- Store in environment variables for production

### Token Expiry
- Access tokens: 60 minutes (configurable)
- Refresh tokens: 7 days (configurable)

### Token Storage
- Access tokens stored in memory (frontend)
- Refresh tokens stored in database
- Asgardeo tokens stored encrypted

### CORS
- Configured for `http://localhost:3001`
- Update for production domains

## Troubleshooting

### Database Connection Failed

**Error:** Unable to connect to database

**Solution:**
```bash
# Check MySQL is running
systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'real_estate_auth_db';"
```

### Asgardeo Authentication Failed

**Error:** Invalid credentials or token

**Solution:**
1. Verify Client ID and Secret in `appsettings.json`
2. Check Asgardeo endpoint URLs
3. Ensure organization name is correct
4. Verify redirect URLs match in Asgardeo console

### JWT Token Validation Failed

**Error:** Invalid token

**Solution:**
1. Check JWT secret is at least 32 characters
2. Verify token hasn't expired
3. Ensure Authorization header format: `Bearer {token}`

### Port Already in Use

**Error:** Address already in use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## Environment Variables (Production)

For production, use environment variables instead of `appsettings.json`:

```bash
export ConnectionStrings__DefaultConnection="Server=prod-server;Database=real_estate_auth_db;..."
export JwtSettings__Secret="your-production-secret"
export Asgardeo__ClientId="your-production-client-id"
export Asgardeo__ClientSecret="your-production-client-secret"
```

## Monitoring

### Logs

The service logs to console. In production, configure structured logging:

```csharp
builder.Logging.AddSerilog();
```

### Metrics

Monitor:
- Request count
- Authentication success/failure rate
- Token generation rate
- Database query performance

## Dependencies

- **Microsoft.EntityFrameworkCore** - Database ORM
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **System.IdentityModel.Tokens.Jwt** - JWT token handling
- **Swashbuckle.AspNetCore** - Swagger documentation

## Related Services

- **API Gateway** (Port 8080) - Routes requests to this service via `/api/auth/*`
- **Frontend** (Port 3001) - Initiates authentication flow

## Support

For issues:
1. Check logs in console
2. Verify configuration in `appsettings.json`
3. Test with Swagger UI
4. Check database connectivity

---

**Service Status:** ✅ Production Ready

**Last Updated:** January 2025
