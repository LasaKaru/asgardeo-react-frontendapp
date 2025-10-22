import axios from 'axios';
import { default as appConfig } from '../config.json';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add credentials for CORS
  withCredentials: true
});

// Add a request interceptor to include authentication
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, you would add the authentication token here
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Basic ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle CORS and other network errors
    if (error.code === 'ERR_NETWORK' || (error.message && error.message.includes('CORS'))) {
      console.error('Network error or CORS issue:', error.message);
      // You might want to show a user-friendly message here
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication
  login: (username: string, password: string) => {
    // In a real app, this would make a request to your backend
    // return apiClient.post('/login', { username, password });
    // For demo purposes, we'll just return a mock response
    return Promise.resolve({ data: { token: 'mock-token' } });
  },

  // Properties
  getProperties: () => {
    return apiClient.get('/properties');
  },
  
  getProperty: (id: number) => {
    return apiClient.get(`/properties/${id}`);
  },
  
  createProperty: (property: any) => {
    return apiClient.post('/properties', property);
  },
  
  updateProperty: (id: number, property: any) => {
    return apiClient.put(`/properties/${id}`, property);
  },
  
  deleteProperty: (id: number) => {
    return apiClient.delete(`/properties/${id}`);
  },

  // Owners
  getOwners: () => {
    return apiClient.get('/owners');
  },
  
  getOwner: (id: number) => {
    return apiClient.get(`/owners/${id}`);
  },
  
  createOwner: (owner: any) => {
    // Match the backend API structure
    const ownerData = {
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phone: owner.phone
    };
    return apiClient.post('/owners', ownerData);
  },
  
  updateOwner: (id: number, owner: any) => {
    // Match the backend API structure
    const ownerData = {
      ownerId: id,
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phone: owner.phone
    };
    return apiClient.put(`/owners/${id}`, ownerData);
  },
  
  deleteOwner: (id: number) => {
    return apiClient.delete(`/owners/${id}`);
  },

  // Tenants
  getTenants: () => {
    return apiClient.get('/tenants');
  },
  
  getTenant: (id: number) => {
    return apiClient.get(`/tenants/${id}`);
  },
  
  createTenant: (tenant: any) => {
    // Match the backend API structure
    const tenantData = {
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone
    };
    return apiClient.post('/tenants', tenantData);
  },
  
  updateTenant: (id: number, tenant: any) => {
    // Match the backend API structure
    const tenantData = {
      tenantId: id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone
    };
    return apiClient.put(`/tenants/${id}`, tenantData);
  },
  
  deleteTenant: (id: number) => {
    return apiClient.delete(`/tenants/${id}`);
  },

  // Leases
  getLeases: () => {
    return apiClient.get('/leases');
  },
  
  getLease: (id: number) => {
    return apiClient.get(`/leases/${id}`);
  },
  
  createLease: (lease: any) => {
    return apiClient.post('/leases', lease);
  },
  
  updateLease: (id: number, lease: any) => {
    return apiClient.put(`/leases/${id}`, lease);
  },
  
  deleteLease: (id: number) => {
    return apiClient.delete(`/leases/${id}`);
  },

  // Payments
  getPayments: () => {
    return apiClient.get('/payments');
  },
  
  getPayment: (id: number) => {
    return apiClient.get(`/payments/${id}`);
  },
  
  createPayment: (payment: any) => {
    return apiClient.post('/payments', payment);
  },
  
  updatePayment: (id: number, payment: any) => {
    return apiClient.put(`/payments/${id}`, payment);
  },
  
  deletePayment: (id: number) => {
    return apiClient.delete(`/payments/${id}`);
  },

  // Maintenance Requests
  getMaintenanceRequests: () => {
    return apiClient.get('/requests');
  },
  
  getMaintenanceRequest: (id: number) => {
    return apiClient.get(`/requests/${id}`);
  },
  
  createMaintenanceRequest: (request: any) => {
    return apiClient.post('/requests', request);
  },
  
  updateMaintenanceRequest: (id: number, request: any) => {
    return apiClient.put(`/requests/${id}`, request);
  },
  
  deleteMaintenanceRequest: (id: number) => {
    return apiClient.delete(`/requests/${id}`);
  },
};

export default apiService;