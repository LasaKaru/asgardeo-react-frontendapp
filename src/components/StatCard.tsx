import React, { FunctionComponent, ReactElement } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    changePercent?: number;
    loading?: boolean;
    color?: string;
    subtitle?: string;
}

/**
 * Reusable stat card component for displaying statistics
 *
 * @param props - StatCard properties
 * @return {React.ReactElement}
 */
export const StatCard: FunctionComponent<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    changePercent,
    loading,
    color = '#2c7be5',
    subtitle
}): ReactElement => {
    const getTrendIcon = () => {
        if (trend === 'up') return '↑';
        if (trend === 'down') return '↓';
        return '→';
    };

    const getTrendColor = () => {
        if (trend === 'up') return '#28a745';
        if (trend === 'down') return '#dc3545';
        return '#6c757d';
    };

    if (loading) {
        return (
            <div className="stat-card-modern loading">
                <div className="stat-card-loading-shimmer"></div>
            </div>
        );
    }

    return (
        <div className="stat-card-modern" style={{ borderLeftColor: color }}>
            <div className="stat-card-header">
                <div className="stat-card-title">
                    {icon && <span className="stat-card-icon">{icon}</span>}
                    <span>{title}</span>
                </div>
                {changePercent !== undefined && (
                    <div className="stat-card-trend" style={{ color: getTrendColor() }}>
                        <span className="trend-icon">{getTrendIcon()}</span>
                        <span className="trend-value">{Math.abs(changePercent)}%</span>
                    </div>
                )}
            </div>
            <div className="stat-card-value" style={{ color }}>
                {value}
            </div>
            {subtitle && (
                <div className="stat-card-subtitle">{subtitle}</div>
            )}
        </div>
    );
};

export default StatCard;
