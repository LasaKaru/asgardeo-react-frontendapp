import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import apiService from "../services/api";
import { PaymentForm } from "../components/PaymentForm";

/**
 * Payments page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const PaymentsPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [payments, setPayments] = useState<any[]>([]);
    const [leases, setLeases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPayment, setEditingPayment] = useState<any>(null);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // Fetch payments and leases from the backend
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch leases first (needed for payment form)
            const leasesResponse = await apiService.getLeases();
            setLeases(leasesResponse.data);
            
            // Fetch payments
            const paymentsResponse = await apiService.getPayments();
            console.log('Payments data:', paymentsResponse.data); // Debug log
            
            // Transform the data to match the existing structure
            const transformedPayments = paymentsResponse.data.map((payment: any) => {
                // Handle lease object if it exists
                let leaseDisplay = 'N/A';
                if (payment.lease) {
                    if (typeof payment.lease === 'string') {
                        leaseDisplay = payment.lease;
                    } else if (typeof payment.lease === 'object') {
                        // Extract meaningful lease information
                        const propertyInfo = payment.lease.property ? 
                            `${payment.lease.property.addressLine1 || 'Property N/A'}` : 'Property N/A';
                        const tenantInfo = payment.lease.tenant ? 
                            `${payment.lease.tenant.firstName || ''} ${payment.lease.tenant.lastName || ''}`.trim() || 'Tenant N/A' : 'Tenant N/A';
                        leaseDisplay = `${propertyInfo} - ${tenantInfo}`;
                    }
                }
                
                return {
                    id: payment.paymentId,
                    lease: leaseDisplay,
                    date: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A',
                    amount: `$${payment.amount?.toFixed(2) || '0.00'}`,
                    status: payment.status || 'Unknown',
                    paymentMethod: payment.paymentMethod || 'N/A'
                };
            });
            
            setPayments(transformedPayments);
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

    const handleAddPayment = () => {
        setEditingPayment(null);
        setShowForm(true);
    };

    const handleEditPayment = (payment: any) => {
        setEditingPayment(payment);
        setShowForm(true);
    };

    const handleDeletePayment = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                await apiService.deletePayment(id);
                // Refresh the payments list
                fetchData();
            } catch (err) {
                console.error('Error deleting payment:', err);
                alert('Failed to delete payment. Please try again.');
            }
        }
    };

    const handleSavePayment = async (paymentData: any) => {
        try {
            if (editingPayment) {
                // Update existing payment
                await apiService.updatePayment(editingPayment.id, paymentData);
            } else {
                // Create new payment
                await apiService.createPayment(paymentData);
            }
            
            // Close form and refresh data
            setShowForm(false);
            setEditingPayment(null);
            fetchData();
        } catch (err) {
            console.error('Error saving payment:', err);
            alert(`Failed to ${editingPayment ? 'update' : 'create'} payment. Please try again.`);
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
                        <li><a href="#" onClick={() => navigate('/payments')} className="active">Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Payments</h2>
                    <p>Loading payments...</p>
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
                        <li><a href="#" onClick={() => navigate('/payments')} className="active">Payments</a></li>
                        <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                        <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                    </ul>
                </nav>
                
                <div className="dashboard-content">
                    <h2>Payments</h2>
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
                    <li><a href="#" onClick={() => navigate('/payments')} className="active">Payments</a></li>
                    <li><a href="#" onClick={() => navigate('/maintenance')}>Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Payments</h2>
                    <button className="btn primary" onClick={handleAddPayment}>Add Payment</button>
                </div>
                
                {showForm && (
                    <PaymentForm 
                        payment={editingPayment} 
                        leases={leases}
                        onSave={handleSavePayment} 
                        onCancel={() => {
                            setShowForm(false);
                            setEditingPayment(null);
                        }} 
                    />
                )}
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Lease</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td>{payment.lease}</td>
                                    <td>{payment.date}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>{payment.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditPayment(payment)}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleDeletePayment(payment.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {payments.length === 0 && (
                        <div className="no-data">
                            <p>No payments found. Click "Add Payment" to create your first payment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};