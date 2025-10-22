import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import apiService from "../services/api";
import { LeaseForm } from "../components/LeaseForm";

/**
 * Leases page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const LeasesPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [leases, setLeases] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingLease, setEditingLease] = useState<any>(null);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Fetch leases, properties, and tenants from the backend
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch properties and tenants first (needed for lease form)
            const propertiesResponse = await apiService.getProperties();
            setProperties(propertiesResponse.data);
            
            const tenantsResponse = await apiService.getTenants();
            setTenants(tenantsResponse.data);
            
            // Fetch leases
            const leasesResponse = await apiService.getLeases();
            console.log('Leases data:', leasesResponse.data); // Debug log
            
            // Transform the data to match the existing structure
            const transformedLeases = leasesResponse.data.map((lease: any) => {
                // Handle property object if it exists
                let propertyDisplay = 'N/A';
                if (lease.property) {
                    if (typeof lease.property === 'string') {
                        propertyDisplay = lease.property;
                    } else if (typeof lease.property === 'object') {
                        // Extract meaningful property information
                        propertyDisplay = lease.property.addressLine1 || 
                                        lease.property.name || 
                                        `Property ${lease.property.propertyId || 'N/A'}`;
                    }
                }
                
                // Handle tenant object if it exists
                let tenantDisplay = 'N/A';
                if (lease.tenant) {
                    if (typeof lease.tenant === 'string') {
                        tenantDisplay = lease.tenant;
                    } else if (typeof lease.tenant === 'object') {
                        // Extract meaningful tenant information
                        tenantDisplay = `${lease.tenant.firstName || ''} ${lease.tenant.lastName || ''}`.trim() || 
                                      lease.tenant.name || 
                                      `Tenant ${lease.tenant.tenantId || 'N/A'}`;
                    }
                }
                
                return {
                    id: lease.leaseId,
                    property: propertyDisplay,
                    tenant: tenantDisplay,
                    startDate: lease.startDate ? new Date(lease.startDate).toLocaleDateString() : 'N/A',
                    endDate: lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'N/A',
                    monthlyRent: `$${lease.monthlyRent?.toFixed(2) || '0.00'}`,
                    status: lease.status || 'Unknown',
                    securityDeposit: lease.securityDeposit
                };
            });
            
            setLeases(transformedLeases);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddLease = () => {
        setEditingLease(null);
        setShowForm(true);
    };

    const handleEditLease = (lease: any) => {
        setEditingLease(lease);
        setShowForm(true);
    };

    const handleDeleteLease = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this lease?')) {
            try {
                await apiService.deleteLease(id);
                // Refresh the leases list
                fetchData();
            } catch (err) {
                console.error('Error deleting lease:', err);
                alert('Failed to delete lease. Please try again.');
            }
        }
    };

    const handleSaveLease = async (leaseData: any) => {
        try {
            if (editingLease) {
                // Update existing lease
                await apiService.updateLease(editingLease.id, leaseData);
            } else {
                // Create new lease
                await apiService.createLease(leaseData);
            }
            
            // Close form and refresh data
            setShowForm(false);
            setEditingLease(null);
            fetchData();
        } catch (err) {
            console.error('Error saving lease:', err);
            alert(`Failed to ${editingLease ? 'update' : 'create'} lease. Please try again.`);
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
                        <li><a href="#" onClick={() => navigate('/tenants')}>Tenants</a></li>
                        <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                        <li><a href="#" onClick={() => navigate('/leases')} className="active">Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Leases</h2>
                    <p>Loading leases...</p>
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
                        <li><a href="#" onClick={() => navigate('/tenants')}>Tenants</a></li>
                        <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                        <li><a href="#" onClick={() => navigate('/leases')} className="active">Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Leases</h2>
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
                    <li><a href="#" onClick={() => navigate('/tenants')}>Tenants</a></li>
                    <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                    <li><a href="#" onClick={() => navigate('/leases')} className="active">Leases</a></li>
                    <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                    <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Leases</h2>
                    <button className="btn primary" onClick={handleAddLease}>Add Lease</button>
                </div>
                
                {showForm && (
                    <LeaseForm 
                        lease={editingLease} 
                        properties={properties}
                        tenants={tenants}
                        onSave={handleSaveLease} 
                        onCancel={() => {
                            setShowForm(false);
                            setEditingLease(null);
                        }} 
                    />
                )}
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Tenant</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Monthly Rent</th>
                                <th>Security Deposit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leases.map(lease => (
                                <tr key={lease.id}>
                                    <td>{lease.property}</td>
                                    <td>{lease.tenant}</td>
                                    <td>{lease.startDate}</td>
                                    <td>{lease.endDate}</td>
                                    <td>{lease.monthlyRent}</td>
                                    <td>{lease.securityDeposit ? `LKR ${lease.securityDeposit.toFixed(2)}` : 'N/A'}</td>
                                    <td>{lease.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditLease(lease)}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleDeleteLease(lease.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {leases.length === 0 && (
                        <div className="no-data">
                            <p>No leases found. Click "Add Lease" to create your first lease.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};