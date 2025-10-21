<<<<<<< HEAD
import React, { FunctionComponent, ReactElement, useContext, useEffect } from "react";
=======
import React, { FunctionComponent, ReactElement, useContext } from "react";
>>>>>>> f6d388849ef5e7386028c4f31334f996f81d3ec6
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";

/**
 * Dashboard page for the Real Estate Management System.
 *
 * @return {React.ReactElement}
 */
export const DashboardPage: FunctionComponent = (): ReactElement => {
    const asgardeoAuth = useAuthContext();
    const customAuth = useContext(CustomAuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user is authenticated with either method
<<<<<<< HEAD
    const asgardeoIsAuthenticated = asgardeoAuth.state?.isAuthenticated;
    const customIsAuthenticated = customAuth?.isAuthenticated;
    const isAuthenticated = asgardeoIsAuthenticated || customIsAuthenticated;
    
    // Debugging: log authentication state
    React.useEffect(() => {
        console.log('Dashboard auth state:', {
            asgardeoIsAuthenticated,
            customIsAuthenticated,
            isAuthenticated,
            asgardeoState: asgardeoAuth.state
        });
    }, [asgardeoIsAuthenticated, customIsAuthenticated, isAuthenticated, asgardeoAuth.state]);
    
    // Handle authentication state changes
    useEffect(() => {
        // If user is authenticated, stay on dashboard
        if (isAuthenticated) {
            console.log('User is authenticated, staying on dashboard');
            return;
        }
        
        console.log('User not authenticated, will check again in 1 second');
        
        // Only redirect to login if we're sure the user is not authenticated
        // Give a small delay to allow authentication state to properly update
        const timer = setTimeout(() => {
            // Check again after delay
            const currentlyAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
            console.log('Rechecking auth status after delay:', {
                asgardeoIsAuthenticated: asgardeoAuth.state?.isAuthenticated,
                customIsAuthenticated: customAuth?.isAuthenticated,
                currentlyAuthenticated
            });
            
            if (!currentlyAuthenticated) {
                console.log('User not authenticated after delay, redirecting to login');
                navigate('/login');
            } else {
                console.log('User is authenticated after delay, staying on dashboard');
            }
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [isAuthenticated, asgardeoAuth.state?.isAuthenticated, customAuth?.isAuthenticated, navigate]);
    
    // Show loading state while checking authentication
    if (!isAuthenticated) {
        // But don't redirect immediately, give time for auth state to update
        return (
            <div className="dashboard-loading">
                <h2>Loading authentication status...</h2>
                <p>Please wait while we verify your authentication status.</p>
                <div>
                    <p>Debug info:</p>
                    <ul>
                        <li>Asgardeo Authenticated: {asgardeoIsAuthenticated ? 'Yes' : 'No'}</li>
                        <li>Custom Authenticated: {customIsAuthenticated ? 'Yes' : 'No'}</li>
                    </ul>
                </div>
            </div>
        );
    }
    
    // If we reach here, the user is authenticated, so show the dashboard
=======
    const isAuthenticated = asgardeoAuth.state?.isAuthenticated || customAuth?.isAuthenticated;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        navigate('/');
        return null;
    }
>>>>>>> f6d388849ef5e7386028c4f31334f996f81d3ec6

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        if (asgardeoAuth.state?.isAuthenticated) {
            // Use Asgardeo's signOut method which will handle the OIDC logout
            asgardeoAuth.signOut(() => {
<<<<<<< HEAD
                // Redirect to login page after logout
                navigate('/login');
            }).catch((error) => {
                console.error('Error during Asgardeo logout:', error);
                // Even if logout fails, redirect to login page
                navigate('/login');
            });
        } else if (customAuth?.isAuthenticated) {
            customAuth.logout();
            navigate('/login');
=======
                // Redirect to home page after logout
                navigate('/');
            }).catch((error) => {
                console.error('Error during Asgardeo logout:', error);
                // Even if logout fails, redirect to home page
                navigate('/');
            });
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
                    <li><a href="#" onClick={() => handleNavigation('/dashboard')} className="active">Dashboard</a></li>
                    <li><a href="#" onClick={() => handleNavigation('/properties')}>Properties</a></li>
                    <li><a href="#" onClick={() => handleNavigation('/tenants')}>Tenants</a></li>
                    <li><a href="#" onClick={() => handleNavigation('/owners')}>Owners</a></li>
                    <li><a href="#" onClick={() => handleNavigation('/leases')}>Leases</a></li>
                    <li><a href="#" onClick={() => handleNavigation('/payments')}>Payments</a></li>
                    <li><a href="#" onClick={() => handleNavigation('/maintenance')}>Maintenance</a></li>
                    <li><a href="#" onClick={handleLogout} className="logout-link">Logout</a></li>
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Dashboard</h2>
                    <button className="btn secondary" onClick={handleLogout}>Logout</button>
                </div>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Properties</h3>
                        <div className="value">24</div>
                    </div>
                    <div className="stat-card">
                        <h3>Total Tenants</h3>
                        <div className="value">42</div>
                    </div>
                    <div className="stat-card">
                        <h3>Active Leases</h3>
                        <div className="value">18</div>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Maintenance</h3>
                        <div className="value">7</div>
                    </div>
                </div>
                
                <h3>Recent Activity</h3>
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Activity</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2023-06-15</td>
                                <td>New property added</td>
                                <td>Admin</td>
                            </tr>
                            <tr>
                                <td>2023-06-14</td>
                                <td>Lease signed</td>
                                <td>Admin</td>
                            </tr>
                            <tr>
                                <td>2023-06-12</td>
                                <td>Maintenance request</td>
                                <td>Tenant #12</td>
                            </tr>
                            <tr>
                                <td>2023-06-10</td>
                                <td>Payment received</td>
                                <td>Tenant #8</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};