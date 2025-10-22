import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import apiService from "../services/api";
import { TenantForm } from "../components/TenantForm";

/**
 * Tenants page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const TenantsPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTenant, setEditingTenant] = useState<any>(null);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Fetch tenants from the backend
    const fetchTenants = async () => {
        try {
            setLoading(true);
            const response = await apiService.getTenants();
            // Transform the data to match the existing structure
            const transformedTenants = response.data.map((tenant: any) => ({
                id: tenant.tenantId,
                name: `${tenant.firstName} ${tenant.lastName}`,
                email: tenant.email,
                phone: tenant.phone,
                property: tenant.property || 'N/A',
                leaseStart: tenant.leaseStart || 'N/A',
                leaseEnd: tenant.leaseEnd || 'N/A',
                firstName: tenant.firstName,
                lastName: tenant.lastName
            }));
            setTenants(transformedTenants);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching tenants:', err);
            setError('Failed to load tenants. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleAddTenant = () => {
        setEditingTenant(null);
        setShowForm(true);
    };

    const handleEditTenant = (tenant: any) => {
        setEditingTenant(tenant);
        setShowForm(true);
    };

    const handleDeleteTenant = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            try {
                await apiService.deleteTenant(id);
                // Refresh the tenants list
                fetchTenants();
            } catch (err) {
                console.error('Error deleting tenant:', err);
                alert('Failed to delete tenant. Please try again.');
            }
        }
    };

    const handleSaveTenant = async (tenantData: any) => {
        try {
            if (editingTenant) {
                // Update existing tenant
                await apiService.updateTenant(editingTenant.id, tenantData);
            } else {
                // Create new tenant
                await apiService.createTenant(tenantData);
            }
            
            // Close form and refresh tenants list
            setShowForm(false);
            setEditingTenant(null);
            fetchTenants();
        } catch (err) {
            console.error('Error saving tenant:', err);
            alert(`Failed to ${editingTenant ? 'update' : 'create'} tenant. Please try again.`);
        }
    };

    const handleLogout = () => {
        if (asgardeoAuth.state?.isAuthenticated) {
            asgardeoAuth.signOut(() => navigate('/login'));
        } else if (customAuth?.isAuthenticated) {
            customAuth.logout();
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <nav className="nav-menu">
                    <ul>
                        <li><a href="#" onClick={() => navigate('/dashboard')}>Dashboard</a></li>
                        <li><a href="#" onClick={() => navigate('/properties')}>Properties</a></li>
                        <li><a href="#" onClick={() => navigate('/tenants')} className="active">Tenants</a></li>
                        <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                        <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Tenants</h2>
                    <p>Loading tenants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <nav className="nav-menu">
                    <ul>
                        <li><a href="#" onClick={() => navigate('/dashboard')}>Dashboard</a></li>
                        <li><a href="#" onClick={() => navigate('/properties')}>Properties</a></li>
                        <li><a href="#" onClick={() => navigate('/tenants')} className="active">Tenants</a></li>
                        <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                        <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Tenants</h2>
                    <p className="error-message">{error}</p>
                    <button className="btn primary" onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <nav className="nav-menu">
                <ul>
                    <li><a href="#" onClick={() => navigate('/dashboard')}>Dashboard</a></li>
                    <li><a href="#" onClick={() => navigate('/properties')}>Properties</a></li>
                    <li><a href="#" onClick={() => navigate('/tenants')} className="active">Tenants</a></li>
                    <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                    <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                    <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                    <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Tenants</h2>
                    <button className="btn primary" onClick={handleAddTenant}>Add Tenant</button>
                </div>
                
                {showForm && (
                    <TenantForm 
                        tenant={editingTenant} 
                        onSave={handleSaveTenant} 
                        onCancel={() => {
                            setShowForm(false);
                            setEditingTenant(null);
                        }} 
                    />
                )}
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Property</th>
                                <th>Lease Period</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map(tenant => (
                                <tr key={tenant.id}>
                                    <td>{tenant.name}</td>
                                    <td>{tenant.email}</td>
                                    <td>{tenant.phone}</td>
                                    <td>{tenant.property}</td>
                                    <td>{tenant.leaseStart} to {tenant.leaseEnd}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditTenant(tenant)}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleDeleteTenant(tenant.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {tenants.length === 0 && (
                        <div className="no-data">
                            <p>No tenants found. Click "Add Tenant" to create your first tenant.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};