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

  // Dashboard Statistics
  getDashboardStats: async () => {
    try {
      // Fetch all data in parallel
      const [
        properties,
        owners,
        tenants,
        leases,
        payments,
        maintenanceRequests
      ] = await Promise.allSettled([
        apiClient.get('/properties'),
        apiClient.get('/owners'),
        apiClient.get('/tenants'),
        apiClient.get('/leases'),
        apiClient.get('/payments'),
        apiClient.get('/requests')
      ]);

      // Process results with error handling
      const getDataOrEmpty = (result: PromiseSettledResult<any>): any[] => {
        if (result.status === 'fulfilled') {
          return Array.isArray(result.value.data) ? result.value.data : [];
        }
        return [];
      };

      const propertiesData = getDataOrEmpty(properties);
      const ownersData = getDataOrEmpty(owners);
      const tenantsData = getDataOrEmpty(tenants);
      const leasesData = getDataOrEmpty(leases);
      const paymentsData = getDataOrEmpty(payments);
      const maintenanceData = getDataOrEmpty(maintenanceRequests);

      // Calculate statistics
      const totalProperties = propertiesData.length;
      const totalOwners = ownersData.length;
      const totalTenants = tenantsData.length;

      // Leases statistics
      const activeLeases = leasesData.filter((lease: any) => {
        const endDate = new Date(lease.endDate);
        return endDate > new Date();
      }).length;

      // Payment statistics
      const pendingPayments = paymentsData.filter((payment: any) =>
        payment.status?.toLowerCase() === 'pending'
      ).length;

      const totalRevenue = paymentsData
        .filter((payment: any) => payment.status?.toLowerCase() === 'paid')
        .reduce((sum: number, payment: any) => sum + (parseFloat(payment.amount) || 0), 0);

      const pendingAmount = paymentsData
        .filter((payment: any) => payment.status?.toLowerCase() === 'pending')
        .reduce((sum: number, payment: any) => sum + (parseFloat(payment.amount) || 0), 0);

      // Maintenance statistics
      const openMaintenanceRequests = maintenanceData.filter((request: any) =>
        request.status?.toLowerCase() === 'open' || request.status?.toLowerCase() === 'pending'
      ).length;

      // Property occupancy
      const occupiedProperties = leasesData.filter((lease: any) => {
        const endDate = new Date(lease.endDate);
        return endDate > new Date();
      }).length;
      const occupancyRate = totalProperties > 0
        ? ((occupiedProperties / totalProperties) * 100).toFixed(1)
        : '0';

      // Payment status breakdown
      const paidPayments = paymentsData.filter((p: any) =>
        p.status?.toLowerCase() === 'paid'
      ).length;
      const overduePayments = paymentsData.filter((p: any) =>
        p.status?.toLowerCase() === 'overdue'
      ).length;

      return {
        data: {
          counts: {
            properties: totalProperties,
            owners: totalOwners,
            tenants: totalTenants,
            activeLeases,
            pendingPayments,
            openMaintenanceRequests
          },
          revenue: {
            total: totalRevenue,
            pending: pendingAmount
          },
          occupancy: {
            rate: parseFloat(occupancyRate),
            occupied: occupiedProperties,
            total: totalProperties
          },
          paymentBreakdown: {
            paid: paidPayments,
            pending: pendingPayments,
            overdue: overduePayments
          }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getRecentActivities: async () => {
    try {
      // Fetch recent data from all services
      const [
        properties,
        tenants,
        owners,
        leases,
        payments,
        maintenanceRequests
      ] = await Promise.allSettled([
        apiClient.get('/properties'),
        apiClient.get('/tenants'),
        apiClient.get('/owners'),
        apiClient.get('/leases'),
        apiClient.get('/payments'),
        apiClient.get('/requests')
      ]);

      const activities: any[] = [];

      // Helper to safely get data
      const getData = (result: PromiseSettledResult<any>): any[] => {
        return result.status === 'fulfilled' && Array.isArray(result.value.data)
          ? result.value.data
          : [];
      };

      // Add property activities
      getData(properties).forEach((property: any) => {
        if (property.createdAt || property.propertyId) {
          activities.push({
            id: `property-${property.propertyId}`,
            type: 'property',
            action: 'Property Added',
            description: `${property.address || 'New property'} was added to the system`,
            timestamp: property.createdAt || new Date().toISOString(),
            user: 'System'
          });
        }
      });

      // Add tenant activities
      getData(tenants).forEach((tenant: any) => {
        if (tenant.createdAt || tenant.tenantId) {
          activities.push({
            id: `tenant-${tenant.tenantId}`,
            type: 'tenant',
            action: 'Tenant Registered',
            description: `${tenant.firstName} ${tenant.lastName} registered as a tenant`,
            timestamp: tenant.createdAt || new Date().toISOString(),
            user: 'Admin'
          });
        }
      });

      // Add lease activities
      getData(leases).forEach((lease: any) => {
        if (lease.startDate || lease.leaseId) {
          activities.push({
            id: `lease-${lease.leaseId}`,
            type: 'lease',
            action: 'Lease Signed',
            description: `New lease agreement signed (Lease #${lease.leaseId})`,
            timestamp: lease.startDate || new Date().toISOString(),
            user: 'Admin'
          });
        }
      });

      // Add payment activities
      getData(payments).forEach((payment: any) => {
        if (payment.paymentDate || payment.paymentId) {
          const status = payment.status?.toLowerCase() === 'paid' ? 'received' : 'pending';
          activities.push({
            id: `payment-${payment.paymentId}`,
            type: 'payment',
            action: `Payment ${status === 'received' ? 'Received' : 'Pending'}`,
            description: `Payment of $${payment.amount} is ${status}`,
            timestamp: payment.paymentDate || new Date().toISOString(),
            user: payment.tenantId ? `Tenant #${payment.tenantId}` : 'Unknown'
          });
        }
      });

      // Add maintenance activities
      getData(maintenanceRequests).forEach((request: any) => {
        if (request.createdAt || request.requestId) {
          activities.push({
            id: `maintenance-${request.requestId}`,
            type: 'maintenance',
            action: 'Maintenance Request',
            description: request.description || 'New maintenance request submitted',
            timestamp: request.createdAt || new Date().toISOString(),
            user: request.tenantId ? `Tenant #${request.tenantId}` : 'Unknown'
          });
        }
      });

      // Sort by timestamp (most recent first) and return top 20
      activities.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        data: activities.slice(0, 20)
      };
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
};

// TypeScript interfaces for dashboard responses
export interface DashboardStats {
  counts: {
    properties: number;
    owners: number;
    tenants: number;
    activeLeases: number;
    pendingPayments: number;
    openMaintenanceRequests: number;
  };
  revenue: {
    total: number;
    pending: number;
  };
  occupancy: {
    rate: number;
    occupied: number;
    total: number;
  };
  paymentBreakdown: {
    paid: number;
    pending: number;
    overdue: number;
  };
}

export interface Activity {
  id: string;
  type: 'property' | 'tenant' | 'owner' | 'lease' | 'payment' | 'maintenance';
  action: string;
  description: string;
  timestamp: string;
  user?: string;
}

export default apiService;