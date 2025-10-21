import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Maintenance requests page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const MaintenancePage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [requests, setRequests] = React.useState([
        {
            id: 1,
            property: "Sunset Apartments",
            tenant: "John Smith",
            date: "2023-06-15",
            issue: "Leaky faucet in kitchen",
            priority: "Medium",
            status: "In Progress"
        },
        {
            id: 2,
            property: "Suburban House",
            tenant: "Sarah Johnson",
            date: "2023-06-10",
            issue: "Air conditioning not cooling",
            priority: "High",
            status: "Pending"
        },
        {
            id: 3,
            property: "Downtown Office",
            tenant: "Michael Brown",
            date: "2023-06-05",
            issue: "Broken door handle",
            priority: "Low",
            status: "Completed"
        }
    ]);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleAddRequest = () => {
        // In a real app, this would open a form to add a new maintenance request
        alert('Add maintenance request functionality would be implemented here');
    };

    const handleEditRequest = (id: number) => {
        // In a real app, this would open a form to edit the maintenance request
        alert(`Edit maintenance request with ID: ${id}`);
    };

    const handleDeleteRequest = (id: number) => {
        if (window.confirm('Are you sure you want to delete this maintenance request?')) {
            setRequests(requests.filter(request => request.id !== id));
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

    return (
        <div className="dashboard">
            <nav className="nav-menu">
                <ul>
                    <li><a href="#" onClick={() => navigate('/dashboard')}>Dashboard</a></li>
                    <li><a href="#" onClick={() => navigate('/properties')}>Properties</a></li>
                    <li><a href="#" onClick={() => navigate('/tenants')}>Tenants</a></li>
                    <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                    <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                    <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                    <li><a href="#" onClick={() => navigate('/maintenance')} className="active">Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Maintenance Requests</h2>
                    <button className="btn primary" onClick={handleAddRequest}>Add Request</button>
                </div>
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Tenant</th>
                                <th>Date</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request.id}>
                                    <td>{request.property}</td>
                                    <td>{request.tenant}</td>
                                    <td>{request.date}</td>
                                    <td>{request.issue}</td>
                                    <td>{request.priority}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditRequest(request.id)}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleDeleteRequest(request.id)}
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