import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', formData.username);
      const response = await apiClient.post('/auth/login', formData);
      console.log('Login response:', response.data);
      
      // Check if user has admin role
      const userRoles = response.data.roles || [];
      console.log('User roles:', userRoles);
      if (!userRoles.includes('ROLE_ADMIN')) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Store admin session in localStorage (separate from user sessionStorage)
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUsername', response.data.username);
      localStorage.setItem('adminRoles', JSON.stringify(userRoles));
      localStorage.setItem('adminSessionId', Date.now().toString());

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Access</h1>
          <p>Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter admin username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>This is a restricted area. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;