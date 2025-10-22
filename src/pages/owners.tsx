import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import apiService from "../services/api";
import { OwnerForm } from "../components/OwnerForm";

/**
 * Owners page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const OwnersPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [owners, setOwners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingOwner, setEditingOwner] = useState<any>(null);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Fetch owners from the backend
    const fetchOwners = async () => {
        try {
            setLoading(true);
            const response = await apiService.getOwners();
            // Transform the data to match the existing structure
            const transformedOwners = response.data.map((owner: any) => ({
                id: owner.ownerId,
                name: `${owner.firstName} ${owner.lastName}`,
                email: owner.email,
                phone: owner.phone,
                properties: owner.properties || 0,
                firstName: owner.firstName,
                lastName: owner.lastName
            }));
            setOwners(transformedOwners);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching owners:', err);
            // Check if it's a CORS error
            if (err.code === 'ERR_NETWORK' || (err.message && err.message.includes('CORS'))) {
                setError('CORS error: Unable to connect to the backend API. Please ensure the backend is running and CORS is properly configured.');
            } else {
                setError('Failed to load owners. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    const handleAddOwner = () => {
        setEditingOwner(null);
        setShowForm(true);
    };

    const handleEditOwner = (owner: any) => {
        setEditingOwner(owner);
        setShowForm(true);
    };

    const handleDeleteOwner = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this owner?')) {
            try {
                await apiService.deleteOwner(id);
                // Refresh the owners list
                fetchOwners();
            } catch (err) {
                console.error('Error deleting owner:', err);
                alert('Failed to delete owner. Please try again.');
            }
        }
    };

    const handleSaveOwner = async (ownerData: any) => {
        try {
            if (editingOwner) {
                // Update existing owner
                await apiService.updateOwner(editingOwner.id, ownerData);
            } else {
                // Create new owner
                await apiService.createOwner(ownerData);
            }
            
            // Close form and refresh owners list
            setShowForm(false);
            setEditingOwner(null);
            fetchOwners();
        } catch (err) {
            console.error('Error saving owner:', err);
            alert(`Failed to ${editingOwner ? 'update' : 'create'} owner. Please try again.`);
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
                        <li><a href="#" onClick={() => navigate('/owners')} className="active">Owners</a></li>
                        <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Owners</h2>
                    <p>Loading owners...</p>
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
                        <li><a href="#" onClick={() => navigate('/owners')} className="active">Owners</a></li>
                        <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Owners</h2>
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
                
                {showForm && (
                    <OwnerForm 
                        owner={editingOwner} 
                        onSave={handleSaveOwner} 
                        onCancel={() => {
                            setShowForm(false);
                            setEditingOwner(null);
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
                                            onClick={() => handleEditOwner(owner)}
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
                    
                    {owners.length === 0 && (
                        <div className="no-data">
                            <p>No owners found. Click "Add Owner" to create your first owner.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};