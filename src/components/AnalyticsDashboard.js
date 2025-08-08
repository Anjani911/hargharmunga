import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [centersOverview, setCentersOverview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCenter, setSelectedCenter] = useState('');
    const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'monthly'

    useEffect(() => {
        fetchAnalyticsData();
        fetchCentersOverview();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/monthly-uploads`);
            const data = await response.json();
            
            if (data.success) {
                setAnalyticsData(data.data);
                setError(''); // Clear any previous errors
            } else {
                console.error('Analytics API error:', data.message);
                setError('Failed to fetch analytics data');
                setAnalyticsData([]); // Set empty array as fallback
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Error connecting to server');
            setAnalyticsData([]); // Set empty array as fallback
        }
    };

    const fetchCentersOverview = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/centers-overview`);
            const data = await response.json();
            
            if (data.success) {
                setCentersOverview(data.data);
                setError(''); // Clear any previous errors
            } else {
                console.error('Centers overview API error:', data.message);
                setError('Failed to fetch centers overview');
                setCentersOverview([]); // Set empty array as fallback
            }
        } catch (error) {
            console.error('Error fetching overview:', error);
            setError('Error connecting to server');
            setCentersOverview([]); // Set empty array as fallback
        } finally {
            setLoading(false); // Always stop loading
        }
    };

    const filteredData = selectedCenter 
        ? analyticsData.filter(center => center.center_name.includes(selectedCenter))
        : analyticsData;

    if (loading) {
        return (
            <div className="analytics-dashboard">
                <div className="loading">Loading analytics data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-dashboard">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h1>Anganwadi Analytics Dashboard</h1>
                <p>Upload tracking and statistics across all Anganwadi centers</p>
                
                <div className="dashboard-controls">
                    <div className="view-toggle">
                        <button 
                            className={viewMode === 'overview' ? 'active' : ''}
                            onClick={() => setViewMode('overview')}
                        >
                            Centers Overview
                        </button>
                        <button 
                            className={viewMode === 'monthly' ? 'active' : ''}
                            onClick={() => setViewMode('monthly')}
                        >
                            Monthly Breakdown
                        </button>
                    </div>
                    
                    {viewMode === 'monthly' && (
                        <div className="center-filter">
                            <select 
                                value={selectedCenter} 
                                onChange={(e) => setSelectedCenter(e.target.value)}
                            >
                                <option value="">All Centers</option>
                                {analyticsData.map((center, index) => (
                                    <option key={index} value={center.center_name}>
                                        {center.center_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {viewMode === 'overview' && (
                <div className="centers-overview">
                    <div className="overview-stats">
                        <div className="stat-card">
                            <h3>Total Centers</h3>
                            <div className="stat-number">{centersOverview.length}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Total Students</h3>
                            <div className="stat-number">
                                {centersOverview.reduce((sum, center) => sum + center.total_students, 0)}
                            </div>
                        </div>
                        <div className="stat-card">
                            <h3>Total Uploads</h3>
                            <div className="stat-number">
                                {centersOverview.reduce((sum, center) => sum + center.total_uploads, 0)}
                            </div>
                        </div>
                    </div>

                    <div className="centers-table">
                        <h2>Centers Performance Overview</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Anganwadi Center</th>
                                    <th>Total Students</th>
                                    <th>Total Uploads</th>
                                    <th>Upload Rate (%)</th>
                                    <th>Active Days</th>
                                    <th>Last Upload</th>
                                </tr>
                            </thead>
                            <tbody>
                                {centersOverview.map((center, index) => (
                                    <tr key={index}>
                                        <td className="center-name">{center.center_name}</td>
                                        <td>{center.total_students}</td>
                                        <td>{center.total_uploads}</td>
                                        <td className={`upload-rate ${center.upload_rate > 50 ? 'high' : center.upload_rate > 20 ? 'medium' : 'low'}`}>
                                            {center.upload_rate}%
                                        </td>
                                        <td>{center.active_upload_days}</td>
                                        <td>
                                            {center.last_upload_date 
                                                ? new Date(center.last_upload_date).toLocaleDateString() 
                                                : 'No uploads'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewMode === 'monthly' && (
                <div className="monthly-analytics">
                    {filteredData.map((center, centerIndex) => (
                        <div key={centerIndex} className="center-analytics">
                            <div className="center-header">
                                <h2>{center.center_name}</h2>
                                <div className="center-summary">
                                    <span>Students: {center.total_students}</span>
                                    <span>Total Uploads: {center.yearly_totals?.total_uploads || 0}</span>
                                    <span>First 15 Days: {center.yearly_totals?.first_15_total || 0}</span>
                                    <span>Second 15 Days: {center.yearly_totals?.second_15_total || 0}</span>
                                </div>
                            </div>

                            <div className="monthly-breakdown-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Year</th>
                                            <th>1st 15 Days</th>
                                            <th>2nd 15 Days</th>
                                            <th>Total Month</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {center.monthly_breakdown?.map((month, monthIndex) => (
                                            <tr key={monthIndex}>
                                                <td className="month-name">{month.month_name}</td>
                                                <td>{month.year}</td>
                                                <td className="upload-count first-half">{month.first_15_days}</td>
                                                <td className="upload-count second-half">{month.second_15_days}</td>
                                                <td className="upload-count total">{month.total_uploads}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
