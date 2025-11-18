# Quick Reference Guide

## Key Files to Know

| File | Purpose | Key Exports |
|------|---------|-------------|
| **src/app.tsx** | Main app with auth setup & routes | `AppWithAsgardeo`, `CustomAuthContext` |
| **src/config.json** | Asgardeo credentials & API URLs | clientID, baseUrl, API endpoints |
| **src/pages/login.tsx** | Dual auth (Asgardeo + custom) | `LoginPage` component |
| **src/services/api.ts** | Axios HTTP client | `apiService` object with CRUD methods |
| **src/layouts/default.tsx** | Header/footer wrapper | `DefaultLayout` component |
| **webpack.config.js** | Build configuration | Proxy rules for API |
| **.env** | Dev environment vars | PORT, HOST, HTTPS |

---

## Common Tasks

### Authentication Check in Components
```typescript
import { useAuthContext } from "@asgardeo/auth-react";
import { useContext } from "react";
import { CustomAuthContext } from "../app";

const MyComponent = () => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    
    const isAuthenticated = 
        asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }
    
    // Render protected content
};
```

### Making API Calls
```typescript
import apiService from "../services/api";

// Fetch data
const fetchData = async () => {
    try {
        const response = await apiService.getProperties();
        setData(response.data);
    } catch (error) {
        console.error('Error:', error);
        setError('Failed to load data');
    }
};

// Create/Update
const handleSave = async (formData) => {
    try {
        await apiService.createProperty(formData);
        // Refresh data
        fetchData();
    } catch (error) {
        setError(error.message);
    }
};

// Delete
const handleDelete = async (id) => {
    try {
        await apiService.deleteProperty(id);
        // Refresh data
        fetchData();
    } catch (error) {
        setError(error.message);
    }
};
```

### Adding New Form Component
```typescript
import React, { FunctionComponent, ReactElement, useState } from "react";

interface PropertyFormProps {
    property?: any;
    onSave: (property: any) => void;
    onCancel: () => void;
}

export const PropertyForm: FunctionComponent<PropertyFormProps> = 
({ property, onSave, onCancel }): ReactElement => {
    const [formData, setFormData] = useState(property || {});
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        // Add validation rules
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};
```

### Adding New Page
1. Create file in `src/pages/` (e.g., `mypage.tsx`)
2. Create component with authentication check:
```typescript
import { useAuthContext } from "@asgardeo/auth-react";
import { useContext } from "react";
import { CustomAuthContext } from "../app";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../layouts/default";

export const MyPage = () => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    
    const isAuthenticated = 
        asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }
    
    return (
        <DefaultLayout>
            {/* Page content */}
        </DefaultLayout>
    );
};
```
3. Add to `src/pages/index.tsx`:
```typescript
export { MyPage } from "./mypage";
```
4. Add route in `src/app.tsx`:
```typescript
<Route path="/mypage" element={<MyPage />} />
```

### Logout in Components
```typescript
const handleLogout = () => {
    if (asgardeoAuth.state?.isAuthenticated) {
        // Asgardeo logout
        asgardeoAuth.signOut(() => {
            navigate('/');
        });
    } else if (customAuth?.isAuthenticated) {
        // Custom logout
        customAuth.logout();
        navigate('/');
    }
};
```

---

## Environment & Configuration

### .env File
```
PORT=3001                          # Dev server port
HOST="localhost"                   # Dev server host
DISABLE_DEV_SERVER_HOST_CHECK=false # Allow dev connections
HTTPS=false                        # Use HTTP (not HTTPS)
```

### config.json Important Fields
```json
{
    "asgardeo": {
        "clientID": "YOUR_CLIENT_ID",              // From Asgardeo console
        "baseUrl": "https://api.asgardeo.io/t/YOUR_TENANT",
        "signInRedirectURL": "http://localhost:3001/dashboard",
        "signOutRedirectURL": "http://localhost:3001",
        "scope": ["openid", "profile"]
    },
    "apiBaseUrl": "/api"                           // Proxied to https://localhost:7049
}
```

### Update for Production
1. Change URLs in `config.json`
2. Register URLs in Asgardeo console
3. Update webpack proxy target if needed
4. Change `HTTPS=true` if using HTTPS

---

## API Endpoints Reference

### Properties
```javascript
apiService.getProperties()           // GET /api/properties
apiService.getProperty(id)           // GET /api/properties/{id}
apiService.createProperty(data)      // POST /api/properties
apiService.updateProperty(id, data)  // PUT /api/properties/{id}
apiService.deleteProperty(id)        // DELETE /api/properties/{id}
```

### Owners
```javascript
apiService.getOwners()               // GET /api/owners
apiService.getOwner(id)              // GET /api/owners/{id}
apiService.createOwner(data)         // POST /api/owners
apiService.updateOwner(id, data)     // PUT /api/owners/{id}
apiService.deleteOwner(id)           // DELETE /api/owners/{id}
```

### Tenants
```javascript
apiService.getTenants()              // GET /api/tenants
apiService.getTenant(id)             // GET /api/tenants/{id}
apiService.createTenant(data)        // POST /api/tenants
apiService.updateTenant(id, data)    // PUT /api/tenants/{id}
apiService.deleteTenant(id)          // DELETE /api/tenants/{id}
```

### Leases
```javascript
apiService.getLeases()               // GET /api/leases
apiService.getLease(id)              // GET /api/leases/{id}
apiService.createLease(data)         // POST /api/leases
apiService.updateLease(id, data)     // PUT /api/leases/{id}
apiService.deleteLease(id)           // DELETE /api/leases/{id}
```

### Payments
```javascript
apiService.getPayments()             // GET /api/payments
apiService.getPayment(id)            // GET /api/payments/{id}
apiService.createPayment(data)       // POST /api/payments
apiService.updatePayment(id, data)   // PUT /api/payments/{id}
apiService.deletePayment(id)         // DELETE /api/payments/{id}
```

### Maintenance Requests
```javascript
apiService.getMaintenanceRequests()  // GET /api/requests
apiService.getMaintenanceRequest(id) // GET /api/requests/{id}
apiService.createMaintenanceRequest(data)
apiService.updateMaintenanceRequest(id, data)
apiService.deleteMaintenanceRequest(id)
```

---

## Development Commands

```bash
npm install                 # Install dependencies
npm start                   # Start dev server (http://localhost:3001)
npm run build               # Build for production (dist/)
npm run prebuild            # Run before build (npm install)
```

---

## Common Imports

### From @asgardeo/auth-react
```typescript
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import { BasicUserInfo } from "@asgardeo/auth-react";
```

### From React Router
```typescript
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
```

### From React
```typescript
import React, { 
    useState, 
    useEffect, 
    useContext, 
    FunctionComponent 
} from "react";
```

### From local modules
```typescript
import { CustomAuthContext } from "../app";
import { DefaultLayout } from "../layouts/default";
import apiService from "../services/api";
import config from "../config.json";
```

---

## Testing Authentication

### Demo Login
- Username: `admin`
- Password: `admin123`
- Click "Demo Login (admin/admin123)" button

### Asgardeo Login
1. Ensure `clientID` is set in `config.json`
2. Click "Login with Asgardeo" button
3. You'll be redirected to Asgardeo tenant login
4. Enter valid Asgardeo credentials
5. You'll be redirected back to `/dashboard`

### Check Auth State in Console
```javascript
// In browser console, on any page:
// Check Asgardeo auth
console.log('Asgardeo:', localStorage.getItem('auth_state'));

// Or check component state:
// Open React DevTools → Components tab → check hooks state
```

---

## Debugging Tips

### Enable Request Logging
In `src/services/api.ts`, uncomment the request interceptor:
```typescript
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, config.data);
    return config;
  }
);
```

### Enable Response Logging
In `src/services/api.ts`, add to response interceptor:
```typescript
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, response.data);
    return response;
  }
);
```

### Check Auth State
Components already log auth state to console:
- Look for "AppWithAsgardeo auth state:"
- Look for "Login page auth state:"
- Look for "Dashboard auth state:"

### Browser DevTools
1. **Network tab**: Monitor API requests
2. **Storage tab**: Check localStorage for auth tokens
3. **Console tab**: Check for error messages
4. **React DevTools**: Inspect component props/state

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Page not found (404) | Check route path in `app.tsx` matches URL |
| API returns 401 | Check authentication, you'll be redirected to login |
| Blank page on load | Check console for errors, verify auth state |
| CORS error | Dev server proxy should handle it, check webpack config |
| Form not submitting | Check form validation, look for error messages |
| Auth state not updating | Give 1 second delay for state to sync (like dashboard does) |
| Logout not working | Check if using correct auth method (Asgardeo vs custom) |

---

## Project Structure at a Glance

```
src/
├── app.tsx (main app + routing)
├── config.json (configuration)
├── pages/ (page components)
├── components/ (form components)
├── services/api.ts (HTTP client)
├── layouts/default.tsx (header/footer)
├── app.css (global styles)
└── index.html (entry HTML)

Root:
├── package.json (dependencies)
├── webpack.config.js (build config)
├── tsconfig.json (TypeScript config)
├── babel.config.js (Babel config)
├── .env (dev environment)
└── Dockerfile (containerization)
```

---

## TypeScript Interfaces

### Authentication State (Asgardeo)
```typescript
interface AuthState {
    isAuthenticated: boolean;
    username?: string;
    displayName?: string;
    email?: string;
    idToken?: string;
    accessToken?: string;
    basicUserInfo?: BasicUserInfo;
}
```

### Custom Auth Context
```typescript
interface CustomAuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}
```

### Form Props Pattern
```typescript
interface FormProps {
    itemData?: any;           // Existing item (for edit)
    onSave: (data: any) => void;   // Save callback
    onCancel: () => void;     // Cancel callback
}
```

---

## Performance Tips

1. **Data Fetching**: Move useEffect calls out of render loops
2. **Form Handling**: Use controlled components with useState
3. **Re-renders**: Use useCallback for stable function references
4. **API Calls**: Debounce search/filter operations
5. **Large Lists**: Consider pagination instead of loading all

---

## Security Considerations

1. **Authentication**: Don't store sensitive data in localStorage
2. **API Keys**: Keep clientID in config, not exposed in code
3. **HTTPS**: Use for production (change HTTPS=true in .env)
4. **CORS**: Dev proxy helps, production needs backend CORS config
5. **Token Refresh**: Asgardeo handles automatically
6. **Logout**: Use signOut() for proper OIDC logout

---

## Next Steps for Development

1. Implement token refresh logic if needed
2. Add actual backend authentication endpoint
3. Implement search/filter on list pages
4. Add pagination for large datasets
5. Add loading spinners during API calls
6. Add success/error toast notifications
7. Implement role-based access control
8. Add unit tests for components
9. Add E2E tests for user flows
10. Set up CI/CD pipeline
