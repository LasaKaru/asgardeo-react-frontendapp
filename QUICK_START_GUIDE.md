# Quick Start Guide - Real Estate Auth Service

## Step-by-Step Setup

### Step 1: Setup MySQL Database

```bash
# Navigate to database folder
cd /home/user/asgardeo-react-frontendapp/database

# Run the complete setup script
mysql -u root -proot < COMPLETE_SETUP.sql

# Verify tables created
mysql -u root -proot -e "USE real_estate_db; SHOW TABLES;"
```

**Expected Output:**
```
+---------------------------+
| Tables_in_real_estate_db  |
+---------------------------+
| auth_tokens               |
| refresh_tokens            |
| users                     |
+---------------------------+
```

### Step 2: Configure Asgardeo

Edit `AuthService.API/appsettings.json`:

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

**Get these values from:**
1. Login to Asgardeo Console: https://console.asgardeo.io/
2. Go to Applications → Your Application
3. Copy Client ID and Client Secret
4. Replace `YOUR_ORG` in endpoints with your organization name

### Step 3: Update JWT Secret (Important!)

Edit `AuthService.API/appsettings.json`:

```json
{
  "JwtSettings": {
    "Secret": "CHANGE_THIS_TO_A_VERY_LONG_RANDOM_SECRET_KEY_AT_LEAST_32_CHARS_12345678!"
  }
}
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### Step 4: Start Auth Service API

```bash
# Navigate to Auth Service folder
cd /home/user/asgardeo-react-frontendapp/AuthService.API

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the service
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Verify API is running:**
Open browser: http://localhost:5000/health

Expected: `{"status":"healthy","timestamp":"..."}`

**Explore API documentation:**
Open browser: http://localhost:5000/swagger

### Step 5: Update Frontend Configuration

Edit `src/config.json` with your Asgardeo details:

```json
{
  "asgardeo": {
    "clientID": "YOUR_ASGARDEO_CLIENT_ID",
    "baseUrl": "https://api.asgardeo.io/t/YOUR_ORG",
    "signInRedirectURL": "http://localhost:3001",
    "signOutRedirectURL": "http://localhost:3001",
    "scope": ["openid", "profile", "email"]
  }
}
```

### Step 6: Start React Frontend

Open a **new terminal** (keep Auth Service running):

```bash
# Navigate to project root
cd /home/user/asgardeo-react-frontendapp

# Install dependencies (if not done)
npm install

# Start the frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3001
  On Your Network:  http://192.168.x.x:3001
```

### Step 7: Test the Authentication Flow

1. **Open browser**: http://localhost:3001

2. **Click "Login with Asgardeo"**
   - You'll be redirected to Asgardeo login page
   - Enter your Asgardeo credentials

3. **After successful login:**
   - You'll be redirected back to your app
   - Tokens will be sent to backend automatically
   - You'll be redirected to the dashboard

4. **Verify in Database:**
```bash
mysql -u root -proot -e "USE real_estate_db; SELECT id, username, email FROM users;"
```

You should see your user record!

## Verify Everything Works

### Check 1: Database
```bash
mysql -u root -proot real_estate_db -e "
SELECT
  u.username,
  u.email,
  COUNT(at.id) as token_count,
  COUNT(rt.id) as refresh_token_count
FROM users u
LEFT JOIN auth_tokens at ON u.id = at.user_id
LEFT JOIN refresh_tokens rt ON u.id = rt.user_id
GROUP BY u.id;
"
```

### Check 2: Auth Service Logs
Look for these log messages in the Auth Service terminal:
- Token validation requests
- User creation/update
- JWT token generation

### Check 3: Frontend Console
Open browser DevTools (F12) and check:
- Asgardeo authentication messages
- Backend API calls
- Token storage in localStorage

### Check 4: Test API Endpoints

Get your JWT token from browser localStorage (F12 → Application → Local Storage → backend_access_token)

```bash
# Replace YOUR_JWT_TOKEN with actual token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/auth/validate
```

Expected response:
```json
{
  "valid": true,
  "userId": 1,
  "username": "your@email.com",
  "email": "your@email.com"
}
```

## Architecture Summary

```
┌─────────────┐  1. Click Login   ┌──────────────┐
│   Browser   │ ────────────────> │  Asgardeo    │
│ localhost:  │ <──────────────── │   OAuth2     │
│   3001      │  2. Auth Code     └──────────────┘
└─────────────┘
       │ 3. Exchange code
       │    for tokens
       ↓
┌─────────────┐  4. Send tokens   ┌──────────────┐  5. Validate   ┌──────────────┐
│   React     │ ────────────────> │ Auth Service │ ───────────>  │  Asgardeo    │
│  Frontend   │ <──────────────── │  .NET API    │ <────────────  │     API      │
└─────────────┘  6. JWT tokens    │ localhost:   │  6. User Info  └──────────────┘
                                   │   5000       │
                                   └──────────────┘
                                          │
                                          │ 7. Store tokens
                                          │    & user data
                                          ↓
                                   ┌──────────────┐
                                   │    MySQL     │
                                   │  Database    │
                                   │ real_estate_ │
                                   │      db      │
                                   └──────────────┘
```

## Common Issues

### Issue: "Database connection failed"
**Solution:**
```bash
# Check MySQL is running
systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Test connection
mysql -u root -proot -e "SELECT 1;"
```

### Issue: "Asgardeo authentication failed"
**Solutions:**
1. Check ClientId and ClientSecret in `appsettings.json`
2. Verify redirect URLs in Asgardeo console match `http://localhost:3001`
3. Check organization name in endpoint URLs

### Issue: "CORS error"
**Solution:**
The Auth Service is configured to allow `http://localhost:3001`.
If using different port, update `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:3001", "http://localhost:YOUR_PORT")
```

### Issue: "JWT validation failed"
**Solutions:**
1. Check JWT Secret is at least 32 characters
2. Verify token hasn't expired
3. Check Authorization header: `Bearer {token}`

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 PID

# Or use different port in launchSettings.json
```

## What Was Created

### Backend (.NET API)
- ✅ Complete authentication service
- ✅ Asgardeo token validation
- ✅ JWT token generation
- ✅ MySQL integration
- ✅ Token refresh mechanism
- ✅ User management
- ✅ Swagger documentation

### Database (MySQL)
- ✅ `users` table - User profiles
- ✅ `auth_tokens` table - Asgardeo tokens
- ✅ `refresh_tokens` table - JWT refresh tokens
- ✅ Indexes for performance
- ✅ Foreign key relationships

### Frontend (React)
- ✅ Backend API integration service
- ✅ Updated login page
- ✅ Token management
- ✅ Automatic token refresh

## Next Steps

1. **Test the complete flow** ✓
2. **Add error handling** in frontend
3. **Implement token auto-refresh** in API calls
4. **Add user profile management**
5. **Deploy to production**

## Need Help?

1. **Auth Service Logs**: Check the terminal where `dotnet run` is running
2. **Database Inspection**: Use MySQL Workbench or command line
3. **API Documentation**: http://localhost:5000/swagger
4. **Frontend Logs**: Browser DevTools Console (F12)

## Database Scripts Location

All database scripts are in: `/home/user/asgardeo-react-frontendapp/database/`

**Quick setup:**
```bash
mysql -u root -proot < database/COMPLETE_SETUP.sql
```

## Connection Details

- **Frontend**: http://localhost:3001
- **Auth Service**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health
- **Database**: 127.0.0.1:3306
- **Database Name**: real_estate_db
- **Database User**: root
- **Database Password**: root

---

**Your microservice authentication architecture is ready! 🎉**
