import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import apiService from "../services/api";
import { PropertyForm } from "../components/PropertyForm";

/**
 * Properties page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const PropertiesPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [owners, setOwners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState<any>(null);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Fetch properties and owners from the backend
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch owners first (needed for property form)
            const ownersResponse = await apiService.getOwners();
            setOwners(ownersResponse.data);
            
            // Fetch properties
            const propertiesResponse = await apiService.getProperties();
            console.log('Properties data:', propertiesResponse.data); // Debug log
            
            // Transform the data to match the existing structure
            const transformedProperties = propertiesResponse.data.map((property: any) => ({
                id: property.propertyId,
                name: `${property.addressLine1}, ${property.city}`,
                address: `${property.addressLine1}, ${property.city}, ${property.stateProvince} ${property.zipCode}`,
                type: property.propertyType,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                size: property.sizeSqFt ? `${property.sizeSqFt} sq ft` : 'N/A',
                status: property.status || 'Available',
                rentAmount: property.rentAmount,
                owner: property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'N/A'
            }));
            
            setProperties(transformedProperties);
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

    const handleAddProperty = () => {
        setEditingProperty(null);
        setShowForm(true);
    };

    const handleEditProperty = (property: any) => {
        setEditingProperty(property);
        setShowForm(true);
    };

    const handleDeleteProperty = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await apiService.deleteProperty(id);
                // Refresh the properties list
                fetchData();
            } catch (err) {
                console.error('Error deleting property:', err);
                alert('Failed to delete property. Please try again.');
            }
        }
    };

    const handleSaveProperty = async (propertyData: any) => {
        try {
            if (editingProperty) {
                // Update existing property
                await apiService.updateProperty(editingProperty.id, propertyData);
            } else {
                // Create new property
                await apiService.createProperty(propertyData);
            }
            
            // Close form and refresh data
            setShowForm(false);
            setEditingProperty(null);
            fetchData();
        } catch (err) {
            console.error('Error saving property:', err);
            alert(`Failed to ${editingProperty ? 'update' : 'create'} property. Please try again.`);
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
                    <h2>Properties</h2>
                    <p>Loading properties...</p>
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
                    <h2>Properties</h2>
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
                
                {showForm && (
                    <PropertyForm 
                        property={editingProperty} 
                        owners={owners}
                        onSave={handleSaveProperty} 
                        onCancel={() => {
                            setShowForm(false);
                            setEditingProperty(null);
                        }} 
                    />
                )}
                
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
                                <th>Rent (LKR)</th>
                                <th>Owner</th>
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
                                    <td>{property.bedrooms || 'N/A'}</td>
                                    <td>{property.bathrooms || 'N/A'}</td>
                                    <td>{property.size}</td>
                                    <td>{property.rentAmount?.toFixed(2) || '0.00'}</td>
                                    <td>{property.owner}</td>
                                    <td>{property.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditProperty(property)}
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
                    
                    {properties.length === 0 && (
                        <div className="no-data">
                            <p>No properties found. Click "Add Property" to create your first property.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};