import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Payments page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const PaymentsPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const [payments, setPayments] = React.useState([
        {
            id: 1,
            property: "Sunset Apartments",
            tenant: "John Smith",
            date: "2023-06-01",
            amount: "$1,200",
            status: "Paid"
        },
        {
            id: 2,
            property: "Suburban House",
            tenant: "Sarah Johnson",
            date: "2023-06-01",
            amount: "$2,500",
            status: "Paid"
        },
        {
            id: 3,
            property: "Downtown Office",
            tenant: "Michael Brown",
            date: "2023-05-01",
            amount: "$3,000",
            status: "Paid"
        },
        {
            id: 4,
            property: "Sunset Apartments",
            tenant: "John Smith",
            date: "2023-05-01",
            amount: "$1,200",
            status: "Paid"
        }
    ]);

    // Check if user is authenticated with either method
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleAddPayment = () => {
        // In a real app, this would open a form to add a new payment
        alert('Add payment functionality would be implemented here');
    };

    const handleEditPayment = (id: number) => {
        // In a real app, this would open a form to edit the payment
        alert(`Edit payment with ID: ${id}`);
    };

    const handleDeletePayment = (id: number) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            setPayments(payments.filter(payment => payment.id !== id));
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
                
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Tenant</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td>{payment.property}</td>
                                    <td>{payment.tenant}</td>
                                    <td>{payment.date}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.status}</td>
                                    <td>
                                        <button 
                                            className="btn secondary" 
                                            onClick={() => handleEditPayment(payment.id)}
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
                </div>
            </div>
        </div>
    );
};