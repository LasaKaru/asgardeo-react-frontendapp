import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Owners page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const OwnersPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [owners, setOwners] = React.useState([
        {
            id: 1,
            name: "Robert Wilson",
            email: "robert.wilson@email.com",
            phone: "(555) 111-2222",
            properties: 2
        },
        {
            id: 2,
            name: "Jennifer Davis",
            email: "jennifer.davis@email.com",
            phone: "(555) 333-4444",
            properties: 1
        },
        {
            id: 3,
            name: "David Miller",
            email: "david.miller@email.com",
            phone: "(555) 555-6666",
            properties: 3
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

    const handleAddOwner = () => {
        // In a real app, this would open a form to add a new owner
        alert('Add owner functionality would be implemented here');
    };

    const handleEditOwner = (id: number) => {
        // In a real app, this would open a form to edit the owner
        alert(`Edit owner with ID: ${id}`);
    };

    const handleDeleteOwner = (id: number) => {
        if (window.confirm('Are you sure you want to delete this owner?')) {
            setOwners(owners.filter(owner => owner.id !== id));
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
                    <li><a href="#" onClick={() => navigate('/owners')} className="active">Owners</a></li>
                    <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                    <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                    <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Owners</h2>
                    <button className="btn primary" onClick={handleAddOwner}>Add Owner</button>
                </div>
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Properties Owned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map(owner => (
                                <tr key={owner.id}>
                                    <td>{owner.name}</td>
                                    <td>{owner.email}</td>
                                    <td>{owner.phone}</td>
                                    <td>{owner.properties}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditOwner(owner.id)}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleDeleteOwner(owner.id)}
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