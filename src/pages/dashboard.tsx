import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { CustomAuthContext } from "../app";
import { StatCard } from "../components/StatCard";
import { ActivityFeed, Activity } from "../components/ActivityFeed";
import apiService, { DashboardStats } from "../services/api";

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
    const asgardeoIsAuthenticated = asgardeoAuth.state?.isAuthenticated;
    const customIsAuthenticated = customAuth?.isAuthenticated;
    const isAuthenticated = asgardeoIsAuthenticated || customIsAuthenticated;

    // State for dashboard data
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
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

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isAuthenticated) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch stats and activities in parallel
                const [statsResponse, activitiesResponse] = await Promise.allSettled([
                    apiService.getDashboardStats(),
                    apiService.getRecentActivities()
                ]);

                if (statsResponse.status === 'fulfilled') {
                    setStats(statsResponse.value.data);
                } else {
                    console.error('Error fetching stats:', statsResponse.reason);
                }

                if (activitiesResponse.status === 'fulfilled') {
                    setActivities(activitiesResponse.value.data);
                } else {
                    console.error('Error fetching activities:', activitiesResponse.reason);
                }

                // Only set error if both requests failed
                if (statsResponse.status === 'rejected' && activitiesResponse.status === 'rejected') {
                    setError('Failed to load dashboard data. Please try again.');
                }
            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError('An unexpected error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated]);
    
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

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        if (asgardeoAuth.state?.isAuthenticated) {
            // Use Asgardeo's signOut method which will handle the OIDC logout
            asgardeoAuth.signOut(() => {
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
                <div className="dashboard-header">
                    <div>
                        <h2>Dashboard</h2>
                        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your properties today.</p>
                    </div>
                    <button className="btn secondary" onClick={handleLogout}>Logout</button>
                </div>

                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button onClick={() => window.location.reload()} className="btn primary" style={{ marginLeft: '10px', padding: '5px 15px' }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Main Statistics Grid */}
                <div className="stats-grid-modern">
                    <StatCard
                        title="Total Properties"
                        value={stats?.counts.properties ?? 0}
                        icon="🏢"
                        color="#2c7be5"
                        loading={loading}
                    />
                    <StatCard
                        title="Property Owners"
                        value={stats?.counts.owners ?? 0}
                        icon="👔"
                        color="#fd7e14"
                        loading={loading}
                    />
                    <StatCard
                        title="Active Tenants"
                        value={stats?.counts.tenants ?? 0}
                        icon="👥"
                        color="#6f42c1"
                        loading={loading}
                    />
                    <StatCard
                        title="Active Leases"
                        value={stats?.counts.activeLeases ?? 0}
                        icon="📝"
                        color="#20c997"
                        loading={loading}
                    />
                </div>

                {/* Revenue and Payment Statistics */}
                <div className="dashboard-section">
                    <h3 className="section-title">Financial Overview</h3>
                    <div className="stats-grid-modern">
                        <StatCard
                            title="Total Revenue"
                            value={`$${stats?.revenue.total.toLocaleString() ?? 0}`}
                            icon="💰"
                            color="#28a745"
                            trend="up"
                            changePercent={12.5}
                            subtitle="From paid invoices"
                            loading={loading}
                        />
                        <StatCard
                            title="Pending Payments"
                            value={`$${stats?.revenue.pending.toLocaleString() ?? 0}`}
                            icon="⏳"
                            color="#ffc107"
                            subtitle={`${stats?.counts.pendingPayments ?? 0} invoices pending`}
                            loading={loading}
                        />
                        <StatCard
                            title="Occupancy Rate"
                            value={`${stats?.occupancy.rate ?? 0}%`}
                            icon="📊"
                            color="#17a2b8"
                            trend={stats && stats.occupancy.rate > 80 ? 'up' : 'neutral'}
                            subtitle={`${stats?.occupancy.occupied ?? 0} of ${stats?.occupancy.total ?? 0} properties`}
                            loading={loading}
                        />
                        <StatCard
                            title="Maintenance Requests"
                            value={stats?.counts.openMaintenanceRequests ?? 0}
                            icon="🔧"
                            color="#dc3545"
                            subtitle="Open requests"
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Payment Status Breakdown */}
                <div className="dashboard-section">
                    <h3 className="section-title">Payment Status</h3>
                    <div className="payment-breakdown">
                        <div className="payment-status-card paid">
                            <div className="payment-icon">✓</div>
                            <div className="payment-info">
                                <div className="payment-label">Paid</div>
                                <div className="payment-count">{stats?.paymentBreakdown.paid ?? 0}</div>
                            </div>
                        </div>
                        <div className="payment-status-card pending">
                            <div className="payment-icon">⏱</div>
                            <div className="payment-info">
                                <div className="payment-label">Pending</div>
                                <div className="payment-count">{stats?.paymentBreakdown.pending ?? 0}</div>
                            </div>
                        </div>
                        <div className="payment-status-card overdue">
                            <div className="payment-icon">!</div>
                            <div className="payment-info">
                                <div className="payment-label">Overdue</div>
                                <div className="payment-count">{stats?.paymentBreakdown.overdue ?? 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="dashboard-section">
                    <h3 className="section-title">Recent Activity</h3>
                    <ActivityFeed
                        activities={activities}
                        loading={loading}
                        maxItems={10}
                    />
                </div>
            </div>
        </div>
    );
};