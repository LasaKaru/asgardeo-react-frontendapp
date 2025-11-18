# Real Estate Auth Service - Microservice Architecture

This document explains the new microservice authentication architecture for the Real Estate Management System.

## Architecture Overview

```
┌─────────────┐          ┌──────────────┐          ┌─────────────┐          ┌────────────┐
│   React     │          │  Auth Service│          │  Asgardeo   │          │   MySQL    │
│  Frontend   │  ─────>  │  .NET API    │  ─────>  │   OAuth2    │          │  Database  │
│  (Port:3001)│          │  (Port:5000) │          │   Provider  │          │            │
└─────────────┘          └──────────────┘          └─────────────┘          └────────────┘
       │                        │                                                   │
       │                        └───────────────────────────────────────────────────┘
       │                                 Store tokens & user data
       │
       └──────────────────> API requests with JWT token
```

## Authentication Flow

### 1. User Login Flow

```
User clicks "Login with Asgardeo"
    │
    ├──> Frontend redirects to Asgardeo
    │
    ├──> User authenticates with Asgardeo
    │
    ├──> Asgardeo returns tokens to frontend
    │
    ├──> Frontend sends tokens to Auth Service API
    │
    ├──> Auth Service validates tokens with Asgardeo
    │
    ├──> Auth Service stores tokens in MySQL
    │
    ├──> Auth Service generates own JWT tokens
    │
    └──> Frontend receives JWT tokens and stores them
```

### 2. Subsequent Requests

```
User makes API request
    │
    ├──> Frontend includes JWT token in Authorization header
    │
    ├──> Backend validates JWT token
    │
    ├──> If valid, process request
    │
    └──> If invalid, return 401 Unauthorized
```

### 3. Token Refresh Flow

```
JWT token expires
    │
    ├──> Frontend sends refresh token to Auth Service
    │
    ├──> Auth Service validates refresh token
    │
    ├──> Auth Service generates new JWT tokens
    │
    └──> Frontend receives new tokens
```

## Project Structure

```
/home/user/asgardeo-react-frontendapp/
│
├── AuthService.API/                    # .NET 8 Authentication Service
│   ├── Controllers/
│   │   └── AuthController.cs           # Auth endpoints
│   ├── Data/
│   │   └── AuthDbContext.cs            # EF Core DbContext
│   ├── DTOs/
│   │   ├── LoginRequest.cs
│   │   ├── LoginResponse.cs
│   │   ├── AsgardeoTokenRequest.cs
│   │   ├── AsgardeoUserInfo.cs
│   │   └── RefreshTokenRequest.cs
│   ├── Models/
│   │   ├── User.cs                     # User entity
│   │   ├── AuthToken.cs                # Asgardeo token storage
│   │   └── RefreshToken.cs             # JWT refresh token
│   ├── Services/
│   │   ├── IJwtTokenService.cs
│   │   ├── JwtTokenService.cs          # JWT generation/validation
│   │   ├── IAsgardeoService.cs
│   │   ├── AsgardeoService.cs          # Asgardeo integration
│   │   ├── IAuthService.cs
│   │   └── AuthService.cs              # Main auth logic
│   ├── Program.cs                      # App configuration
│   ├── appsettings.json                # Configuration
│   └── AuthService.API.csproj          # Project file
│
├── database/                           # Database scripts
│   ├── 01_create_database.sql
│   ├── 02_create_users_table.sql
│   ├── 03_create_auth_tokens_table.sql
│   ├── 04_create_refresh_tokens_table.sql
│   ├── 05_seed_data.sql
│   ├── COMPLETE_SETUP.sql              # All-in-one setup
│   └── README.md
│
└── src/                                # React Frontend
    ├── services/
    │   └── authBackendService.ts       # Backend API integration
    └── pages/
        └── login.tsx                   # Updated login page
```

## Database Schema

### users table
- Stores user information from Asgardeo
- Links to Asgardeo user ID (sub claim)
- Tracks login activity

### auth_tokens table
- Stores Asgardeo access tokens
- Tracks token expiration
- Supports token revocation

### refresh_tokens table
- Stores JWT refresh tokens
- Supports token rotation
- Links to Asgardeo refresh tokens

## Setup Instructions

### 1. Database Setup

```bash
# Navigate to database folder
cd /home/user/asgardeo-react-frontendapp/database

# Run complete setup script
mysql -u root -p < COMPLETE_SETUP.sql

# Or run individual scripts
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_create_users_table.sql
mysql -u root -p < 03_create_auth_tokens_table.sql
mysql -u root -p < 04_create_refresh_tokens_table.sql
mysql -u root -p < 05_seed_data.sql
```

### 2. Configure Asgardeo

Update `AuthService.API/appsettings.json`:

```json
{
  "Asgardeo": {
    "ClientId": "YOUR_ASGARDEO_CLIENT_ID",
    "ClientSecret": "YOUR_ASGARDEO_CLIENT_SECRET",
    "TokenEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/token",
    "UserInfoEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/userinfo",
    "IntrospectEndpoint": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/introspect"
  }
}
```

### 3. Configure JWT Secret

Update `AuthService.API/appsettings.json`:

```json
{
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_HERE_AT_LEAST_32_CHARACTERS!",
    "Issuer": "AuthService.API",
    "Audience": "RealEstateApp",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  }
}
```

### 4. Run the Auth Service

```bash
cd /home/user/asgardeo-react-frontendapp/AuthService.API

# Restore packages
dotnet restore

# Run the service
dotnet run
```

The API will be available at: `http://localhost:5000`
Swagger documentation: `http://localhost:5000/swagger`

### 5. Run the Frontend

```bash
cd /home/user/asgardeo-react-frontendapp

# Install dependencies
npm install

# Start the app
npm start
```

The frontend will be available at: `http://localhost:3001`

## API Endpoints

### POST /api/auth/login
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

### POST /api/auth/refresh
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

### POST /api/auth/logout
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

### GET /api/auth/validate
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

### GET /api/auth/user
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

## Frontend Integration

The frontend service (`src/services/authBackendService.ts`) provides:

- `loginWithAsgardeo()` - Send Asgardeo tokens to backend
- `refreshToken()` - Refresh JWT token
- `logout()` - Logout and revoke tokens
- `validateSession()` - Check if session is valid
- `getCurrentUser()` - Get current user info
- `getAccessToken()` - Get stored JWT token
- `isAuthenticated()` - Check if user is authenticated

## Security Features

1. **Token Validation**: All Asgardeo tokens are validated before storage
2. **JWT Tokens**: Backend generates its own JWT tokens for API access
3. **Token Refresh**: Supports token refresh without re-authentication
4. **Token Revocation**: Tokens can be revoked on logout
5. **CORS Protection**: Only allows requests from configured origins
6. **Database Security**: Passwords stored securely, tokens encrypted in transit

## Connection String

```
Server=127.0.0.1;Database=real_estate_db;User=root;Password=root;
```

## Troubleshooting

### Database Connection Errors
- Ensure MySQL is running: `systemctl status mysql`
- Verify connection string in `appsettings.json`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Asgardeo Integration Errors
- Verify Asgardeo credentials in `appsettings.json`
- Check Asgardeo application configuration
- Ensure redirect URLs are configured correctly

### CORS Errors
- Verify frontend URL in `Program.cs` CORS configuration
- Check browser console for specific CORS errors

### Token Validation Errors
- Ensure JWT secret is at least 32 characters
- Verify token hasn't expired
- Check Authorization header format: `Bearer {token}`

## Next Steps

1. ✅ Database setup complete
2. ✅ Auth Service API created
3. ✅ Frontend integration updated
4. ⏳ Test authentication flow
5. ⏳ Deploy to production

## Support

For issues or questions:
- Check logs in `AuthService.API` console
- Review Swagger documentation at `http://localhost:5000/swagger`
- Check database tables for stored data
- Review frontend console for errors
