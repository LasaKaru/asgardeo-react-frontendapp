import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Properties page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const PropertiesPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [properties, setProperties] = React.useState([
        {
            id: 1,
            name: "Sunset Apartments",
            address: "123 Main St, Cityville",
            type: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            size: "1200 sq ft",
            status: "Available"
        },
        {
            id: 2,
            name: "Downtown Office",
            address: "456 Business Ave, Metropolis",
            type: "Office",
            bedrooms: 0,
            bathrooms: 2,
            size: "2500 sq ft",
            status: "Rented"
        },
        {
            id: 3,
            name: "Suburban House",
            address: "789 Oak St, Townsville",
            type: "House",
            bedrooms: 4,
            bathrooms: 3,
            size: "2800 sq ft",
            status: "Available"
        }
    ]);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleAddProperty = () => {
        // In a real app, this would open a form to add a new property
        alert('Add property functionality would be implemented here');
    };

    const handleEditProperty = (id: number) => {
        // In a real app, this would open a form to edit the property
        alert(`Edit property with ID: ${id}`);
    };

    const handleDeleteProperty = (id: number) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            setProperties(properties.filter(property => property.id !== id));
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
                    <li><a href="#" onClick={() => navigate('/properties')} className="active">Properties</a></li>
                    <li><a href="#" onClick={() => navigate('/tenants')}>Tenants</a></li>
                    <li><a href="#" onClick={() => navigate('/owners')}>Owners</a></li>
                    <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                    <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                    <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Properties</h2>
                    <button className="btn primary" onClick={handleAddProperty}>Add Property</button>
                </div>
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Bedrooms</th>
                                <th>Bathrooms</th>
                                <th>Size</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(property => (
                                <tr key={property.id}>
                                    <td>{property.name}</td>
                                    <td>{property.address}</td>
                                    <td>{property.type}</td>
                                    <td>{property.bedrooms}</td>
                                    <td>{property.bathrooms}</td>
                                    <td>{property.size}</td>
                                    <td>{property.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditProperty(property.id)}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleDeleteProperty(property.id)}
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