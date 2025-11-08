import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import performAdminLogout from '../../utils/adminLogout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const response = await apiClient.get('/admin/stats');
      console.log('Admin stats response:', response.data);
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      console.error('Error details:', error.response);
      setStats({}); // Ensure stats is always an object
      if (error.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-nav">
          <button onClick={() => navigate('/admin/users')} className="nav-btn">
            Manage Users
          </button>
          <button onClick={() => navigate('/admin/messages')} className="nav-btn">
            View Messages
          </button>
          <button onClick={() => navigate('/admin/properties')} className="nav-btn">
            All Properties
          </button>
          <button onClick={performAdminLogout} className="nav-btn logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.totalUsers || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Property Owners</h3>
          <div className="stat-number">{stats.totalOwners || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Tenants</h3>
          <div className="stat-number">{stats.totalTenants || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Properties</h3>
          <div className="stat-number">{stats.totalProperties || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Messages</h3>
          <div className="stat-number">{stats.totalMessages || 0}</div>
        </div>
        
        <div className="stat-card urgent">
          <h3>Unread Messages</h3>
          <div className="stat-number">{stats.unreadMessages || 0}</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/admin/users?role=ROLE_OWNER')}
            className="action-btn"
          >
            View All Owners
          </button>
          <button 
            onClick={() => navigate('/admin/users?role=ROLE_TENANT')}
            className="action-btn"
          >
            View All Tenants
          </button>
          <button 
            onClick={() => navigate('/admin/messages?status=new')}
            className="action-btn urgent"
          >
            View Unread Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;