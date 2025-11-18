import React, { FunctionComponent, ReactElement } from "react";

export interface Activity {
    id: string;
    type: 'property' | 'tenant' | 'owner' | 'lease' | 'payment' | 'maintenance';
    action: string;
    description: string;
    timestamp: string;
    user?: string;
}

interface ActivityFeedProps {
    activities: Activity[];
    loading?: boolean;
    maxItems?: number;
}

/**
 * Component to display recent activities from all services
 *
 * @param props - ActivityFeed properties
 * @return {React.ReactElement}
 */
export const ActivityFeed: FunctionComponent<ActivityFeedProps> = ({
    activities,
    loading,
    maxItems = 10
}): ReactElement => {
    const getActivityColor = (type: Activity['type']): string => {
        const colors = {
            property: '#2c7be5',
            tenant: '#6f42c1',
            owner: '#fd7e14',
            lease: '#20c997',
            payment: '#28a745',
            maintenance: '#ffc107'
        };
        return colors[type];
    };

    const getActivityIcon = (type: Activity['type']): string => {
        const icons = {
            property: '🏢',
            tenant: '👤',
            owner: '👔',
            lease: '📝',
            payment: '💰',
            maintenance: '🔧'
        };
        return icons[type];
    };

    const getRelativeTime = (timestamp: string): string => {
        const now = new Date();
        const activityTime = new Date(timestamp);
        const diffInMs = now.getTime() - activityTime.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        return activityTime.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="activity-feed">
                <div className="activity-feed-loading">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="activity-item-loading">
                            <div className="activity-loading-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const displayActivities = activities.slice(0, maxItems);

    if (displayActivities.length === 0) {
        return (
            <div className="activity-feed">
                <div className="no-data">
                    <p>No recent activities</p>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-feed">
            {displayActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                    <div
                        className="activity-icon"
                        style={{ backgroundColor: getActivityColor(activity.type) }}
                    >
                        {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                        <div className="activity-header">
                            <span className="activity-action">{activity.action}</span>
                            <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
                        </div>
                        <div className="activity-description">{activity.description}</div>
                        {activity.user && (
                            <div className="activity-user">by {activity.user}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
