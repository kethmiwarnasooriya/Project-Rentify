import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './AdminLogin.css';

const AdminLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
    setSuccess(''); // Clear success when user types
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      username: '',
      password: '',
      email: '',
      fullName: '',
      phone: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignup) {
        // Handle signup
        console.log('Attempting admin signup with:', formData.username);
        const signupData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone || '', // Use form phone or empty string
          role: 'owner' // Use 'owner' to pass validation (will be ignored and set to ROLE_ADMIN)
        };
        
        const response = await apiClient.post('/auth/register-admin', signupData);
        console.log('Signup response:', response.data);
        
        setSuccess('Admin account created successfully! You can now login.');
        setIsSignup(false); // Switch to login mode
        setFormData({
          username: formData.username,
          password: '',
          email: '',
          fullName: '',
          phone: ''
        });
      } else {
        // Handle login
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
      }
    } catch (error) {
      console.error('Admin operation error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (error.response?.status === 400) {
        const errorMsg = typeof error.response?.data === 'string' 
          ? error.response.data 
          : error.response?.data?.message || 'Invalid input. Please check your details.';
        setError(errorMsg);
      } else {
        setError(isSignup ? 'Signup failed. Please try again.' : 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>{isSignup ? 'Create Admin Account' : 'Admin Access'}</h1>
          <p>{isSignup ? 'Register New Administrator' : 'Authorized Personnel Only'}</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder={isSignup ? "Choose admin username" : "Enter admin username"}
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
          )}

          {isSignup && (
            <div className="form-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number (optional)"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isSignup ? "Create password" : "Enter admin password"}
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (isSignup ? 'Creating Account...' : 'Authenticating...') : (isSignup ? 'Create Admin Account' : 'Access Admin Panel')}
          </button>

          <div className="toggle-mode">
            <button 
              type="button" 
              onClick={toggleMode}
              className="toggle-btn"
            >
              {isSignup ? 'Already have an account? Login' : 'Need to create an account? Sign Up'}
            </button>
          </div>
        </form>

        <div className="admin-login-footer">
          <p>This is a restricted area. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;