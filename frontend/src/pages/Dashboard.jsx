import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../utils/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch protected dashboard data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getData();
        if (response.data.success) {
          setDashData(response.data.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Session expired between renders — redirect to login
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-dashboard">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-dashboard">
      {/* Dashboard Background */}
      <div className="dashboard-bg">
        <div className="dash-orb dash-orb-1" />
        <div className="dash-orb dash-orb-2" />
      </div>

      <div className="dashboard-content">

        {/* Welcome Header */}
        <header className="dash-header">
          <div className="dash-header-left">
            <p className="dash-greeting">Good to see you back</p>
            <h1 className="dash-title">{dashData?.message || `Welcome, ${user?.displayName}!`}</h1>
          </div>
          <button onClick={handleLogout} className="btn-logout-dash">
            Sign Out
          </button>
        </header>

        {/* Profile Card */}
        <div className="dash-grid">
          <div className="dash-card profile-card">
            <div className="profile-card-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.displayName} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-fallback">
                  {user?.displayName?.[0] || '?'}
                </div>
              )}
              <div className="profile-info">
                <h2 className="profile-name">{user?.displayName}</h2>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-badge">
                  <span className="badge-provider">via {user?.provider || 'Google'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dash-card stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{dashData?.stats?.memberDays ?? 0}</div>
            <div className="stat-label">Days as Member</div>
          </div>

          <div className="dash-card stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-value">Active</div>
            <div className="stat-label">Session Status</div>
          </div>

          {/* Activity Card */}
          <div className="dash-card activity-card">
            <h3 className="card-title">Account Details</h3>
            <div className="activity-list">
              <div className="activity-row">
                <span className="activity-label">Member Since</span>
                <span className="activity-value">{formatDate(dashData?.user?.memberSince)}</span>
              </div>
              <div className="activity-row">
                <span className="activity-label">Last Login</span>
                <span className="activity-value">{formatDate(dashData?.stats?.lastLogin)}</span>
              </div>
              <div className="activity-row">
                <span className="activity-label">Auth Provider</span>
                <span className="activity-value activity-value-accent">Google OAuth 2.0</span>
              </div>
              <div className="activity-row">
                <span className="activity-label">Email</span>
                <span className="activity-value">{dashData?.user?.email}</span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="dash-card security-card">
            <h3 className="card-title">Security Overview</h3>
            <div className="security-items">
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>Session stored server-side (MongoDB)</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>httpOnly cookie — no JS access</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>Backend route protection active</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>No secrets in frontend code</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>OAuth 2.0 — password never stored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Note */}
        <div className="dash-footer-note">
          <p>
            This dashboard is a <strong>protected route</strong>. The backend validates your session
            on every API call — even if you bypass the React router, the API will reject unauthorized requests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;