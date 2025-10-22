import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import apiService from "../services/api";
import { MaintenanceRequestForm } from "../components/MaintenanceRequestForm";

/**
 * Maintenance requests page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const MaintenancePage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [requests, setRequests] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingRequest, setEditingRequest] = useState<any>(null);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Fetch maintenance requests and properties from the backend
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch properties first (needed for maintenance request form)
            const propertiesResponse = await apiService.getProperties();
            setProperties(propertiesResponse.data);
            
            // Fetch maintenance requests
            const requestsResponse = await apiService.getMaintenanceRequests();
            console.log('Maintenance requests data:', requestsResponse.data); // Debug log
            
            // Transform the data to match the existing structure
            const transformedRequests = requestsResponse.data.map((request: any) => ({
                id: request.requestId,
                property: request.property ? `${request.property.addressLine1}, ${request.property.city}` : 'N/A',
                title: request.title,
                description: request.description,
                status: request.status || 'Submitted',
                priority: request.priority || 'Medium',
                requestedDate: request.requestedDate ? new Date(request.requestedDate).toLocaleDateString() : 'N/A',
                resolutionNotes: request.resolutionNotes || '',
                completionDate: request.completionDate ? new Date(request.completionDate).toLocaleDateString() : 'N/A'
            }));
            
            setRequests(transformedRequests);
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

    const handleAddRequest = () => {
        setEditingRequest(null);
        setShowForm(true);
    };

    const handleEditRequest = (request: any) => {
        setEditingRequest(request);
        setShowForm(true);
    };

    const handleDeleteRequest = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this maintenance request?')) {
            try {
                await apiService.deleteMaintenanceRequest(id);
                // Refresh the requests list
                fetchData();
            } catch (err) {
                console.error('Error deleting maintenance request:', err);
                alert('Failed to delete maintenance request. Please try again.');
            }
        }
    };

    const handleSaveRequest = async (requestData: any) => {
        try {
            if (editingRequest) {
                // Update existing request
                await apiService.updateMaintenanceRequest(editingRequest.id, requestData);
            } else {
                // Create new request
                await apiService.createMaintenanceRequest(requestData);
            }
            
            // Close form and refresh data
            setShowForm(false);
            setEditingRequest(null);
            fetchData();
        } catch (err) {
            console.error('Error saving maintenance request:', err);
            alert(`Failed to ${editingRequest ? 'update' : 'create'} maintenance request. Please try again.`);
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
                        <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')} className="active">Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Maintenance Requests</h2>
                    <p>Loading maintenance requests...</p>
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
                        <li><a href="#" onClick={() => navigate('/leases')}>Leases</a></li>
                        <li><a href="#" onClick={() => navigate('/payments')}>Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')} className="active">Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Maintenance Requests</h2>
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
                
                {showForm && (
                    <MaintenanceRequestForm 
                        request={editingRequest} 
                        properties={properties}
                        onSave={handleSaveRequest} 
                        onCancel={() => {
                            setShowForm(false);
                            setEditingRequest(null);
                        }} 
                    />
                )}
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Requested Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request.id}>
                                    <td>{request.property}</td>
                                    <td>{request.title}</td>
                                    <td>{request.description}</td>
                                    <td>{request.status}</td>
                                    <td>{request.priority}</td>
                                    <td>{request.requestedDate}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditRequest(request)}
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
                    
                    {requests.length === 0 && (
                        <div className="no-data">
                            <p>No maintenance requests found. Click "Add Request" to create your first request.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};