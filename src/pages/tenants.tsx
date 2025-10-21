import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Tenants page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const TenantsPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [tenants, setTenants] = React.useState([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "(555) 123-4567",
            property: "Sunset Apartments",
            leaseStart: "2023-01-01",
            leaseEnd: "2023-12-31"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "(555) 987-6543",
            property: "Suburban House",
            leaseStart: "2023-03-01",
            leaseEnd: "2024-02-28"
        },
        {
            id: 3,
            name: "Michael Brown",
            email: "michael.brown@email.com",
            phone: "(555) 456-7890",
            property: "Downtown Office",
            leaseStart: "2022-06-01",
            leaseEnd: "2023-05-31"
        }
    ]);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
<<<<<<< HEAD
        navigate('/login');
=======
        navigate('/');
>>>>>>> f6d388849ef5e7386028c4f31334f996f81d3ec6
        return null;
    }

    const handleAddTenant = () => {
        // In a real app, this would open a form to add a new tenant
        alert('Add tenant functionality would be implemented here');
    };

    const handleEditTenant = (id: number) => {
        // In a real app, this would open a form to edit the tenant
        alert(`Edit tenant with ID: ${id}`);
    };

    const handleDeleteTenant = (id: number) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            setTenants(tenants.filter(tenant => tenant.id !== id));
        }
    };

    const handleLogout = () => {
        if (asgardeoAuth.state?.isAuthenticated) {
<<<<<<< HEAD
            asgardeoAuth.signOut(() => navigate('/login'));
        } else if (customAuth?.isAuthenticated) {
            customAuth.logout();
            navigate('/login');
=======
            asgardeoAuth.signOut(() => navigate('/'));
        } else if (customAuth?.isAuthenticated) {
            customAuth.logout();
            navigate('/');
>>>>>>> f6d388849ef5e7386028c4f31334f996f81d3ec6
        }
    };

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
                                            onClick={() => handleEditTenant(tenant.id)}
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
                </div>
            </div>
        </div>
    );
};