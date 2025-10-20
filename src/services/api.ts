import axios from 'axios';
import { default as appConfig } from '../config.json';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Redirect to login page
      window.location.href = '/';
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

  // Tenants
  getTenants: () => {
    return apiClient.get('/tenants');
  },
  
  getTenant: (id: number) => {
    return apiClient.get(`/tenants/${id}`);
  },
  
  createTenant: (tenant: any) => {
    return apiClient.post('/tenants', tenant);
  },
  
  updateTenant: (id: number, tenant: any) => {
    return apiClient.put(`/tenants/${id}`, tenant);
  },
  
  deleteTenant: (id: number) => {
    return apiClient.delete(`/tenants/${id}`);
  },

  // Owners
  getOwners: () => {
    return apiClient.get('/owners');
  },
  
  getOwner: (id: number) => {
    return apiClient.get(`/owners/${id}`);
  },
  
  createOwner: (owner: any) => {
    return apiClient.post('/owners', owner);
  },
  
  updateOwner: (id: number, owner: any) => {
    return apiClient.put(`/owners/${id}`, owner);
  },
  
  deleteOwner: (id: number) => {
    return apiClient.delete(`/owners/${id}`);
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
    return apiClient.get('/maintenance-requests');
  },
  
  getMaintenanceRequest: (id: number) => {
    return apiClient.get(`/maintenance-requests/${id}`);
  },
  
  createMaintenanceRequest: (request: any) => {
    return apiClient.post('/maintenance-requests', request);
  },
  
  updateMaintenanceRequest: (id: number, request: any) => {
    return apiClient.put(`/maintenance-requests/${id}`, request);
  },
  
  deleteMaintenanceRequest: (id: number) => {
    return apiClient.delete(`/maintenance-requests/${id}`);
  },
};

export default apiService;