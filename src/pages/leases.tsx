import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Leases page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const LeasesPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [leases, setLeases] = React.useState([
        {
            id: 1,
            property: "Sunset Apartments",
            tenant: "John Smith",
            startDate: "2023-01-01",
            endDate: "2023-12-31",
            monthlyRent: "$1,200",
            status: "Active"
        },
        {
            id: 2,
            property: "Suburban House",
            tenant: "Sarah Johnson",
            startDate: "2023-03-01",
            endDate: "2024-02-28",
            monthlyRent: "$2,500",
            status: "Active"
        },
        {
            id: 3,
            property: "Downtown Office",
            tenant: "Michael Brown",
            startDate: "2022-06-01",
            endDate: "2023-05-31",
            monthlyRent: "$3,000",
            status: "Expired"
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

    const handleAddLease = () => {
        // In a real app, this would open a form to add a new lease
        alert('Add lease functionality would be implemented here');
    };

    const handleEditLease = (id: number) => {
        // In a real app, this would open a form to edit the lease
        alert(`Edit lease with ID: ${id}`);
    };

    const handleDeleteLease = (id: number) => {
        if (window.confirm('Are you sure you want to delete this lease?')) {
            setLeases(leases.filter(lease => lease.id !== id));
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
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Tenant</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Monthly Rent</th>
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
                                    <td>{lease.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditLease(lease.id)}
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
                </div>
            </div>
        </div>
    );
};