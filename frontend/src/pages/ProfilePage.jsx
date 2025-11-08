import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Edit2, Save, X, Menu, Home, Info, Settings, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import { useNotification } from '../components/NotificationSystem';

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => sessionStorage.getItem('theme') || 'light');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [username] = useState(sessionStorage.getItem('username') || 'Guest');
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
  const { showNotification } = useNotification();

  const initialProfileState = {
    username: 'Loading...', email: 'Loading...', fullName: 'Loading...',
    phone: 'Loading...', joinDate: 'Loading...', userRole: 'loading'
  };
  const [profileData, setProfileData] = useState(initialProfileState);
  const [editData, setEditData] = useState(initialProfileState);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
    fetchProfileData();
  }, [theme]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/users/me');
      const userData = response.data;
      console.log("Fetched profile data:", userData);

      const fetchedProfile = {
        username: userData.username || '',
        email: userData.email || '',
        fullName: userData.fullName || '',
        phone: userData.phone || 'Not Set',
        joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown',
        userRole: userData.roles && userData.roles.length > 0
                  ? userData.roles[0].replace('ROLE_', '').toLowerCase()
                  : 'tenant'
      };
      setProfileData(fetchedProfile);
      setEditData(fetchedProfile);

    } catch (err) {
      console.error("Failed to fetch profile data:", err);
      setError("Could not load your profile. Please try logging in again.");
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditData({ ...profileData });
    setIsEditing(true);
    showNotification('info', 'Edit Mode', 'You can now update your personal information.');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    console.log("Attempting to save profile:", editData);

    try {
      const updatePayload = {
        fullName: editData.fullName,
        phone: editData.phone,
        email: editData.email,
      };

      const response = await apiClient.put('/users/me', updatePayload);
      const updatedUserData = response.data;

      console.log("Save successful:", updatedUserData);

      const updatedProfile = {
        ...profileData,
        fullName: updatedUserData.fullName || profileData.fullName,
        email: updatedUserData.email || profileData.email,
        phone: updatedUserData.phone || profileData.phone,
      };

      setProfileData(updatedProfile);
      sessionStorage.setItem('username', updatedProfile.username);
      sessionStorage.setItem('email', updatedProfile.email);

      setIsEditing(false);
      showNotification('success', 'Profile Updated!', 'Your personal information has been successfully updated.');

    } catch (err) {
      console.error("Failed to save profile:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Could not save profile. Please try again.";
      setError(errorMsg);
      showNotification('error', 'Update Failed', errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
    setError(null);
    showNotification('warning', 'Changes Discarded', 'Your unsaved changes have been discarded.');
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleThemeChange = (newTheme) => setTheme(newTheme);
  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout'); } catch (error) { console.error("Logout failed:", error); }
    // Clear only user session data (preserve admin session)
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectAfterLogin');
    localStorage.clear();
    navigate('/login');
  };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderInfoField = (label, field, icon, isTextarea = false, isEditable = true) => (
    <div className="info-group">
      <label className="info-label">{icon} {label}</label>
      {!isEditing ? (
        <div className="info-value">{profileData[field] || (isLoading ? '...' : 'Not Set')}</div>
      ) : (
        isTextarea ? (
          <textarea
            className="info-input info-textarea"
            value={editData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={isSaving || !isEditable}
            rows={4}
          />
        ) : (
          <input
            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
            className="info-input"
            value={editData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={isSaving || !isEditable}
          />
        )
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --bg-gradient-start: #F5F1E8;
          --bg-gradient-end: #FBF8F0;
          --text-primary: #1F2E3D;
          --text-secondary: #6B7C8C;
          --accent-color: #5B8DB8;
          --accent-hover: #4A7BA4;
          --nav-bg: #1F2E3D;
          --card-bg: rgba(251, 248, 240, 0.95);
          --danger-color: #C85A54;
          --danger-hover: #B24943;
          --input-bg: #FBF8F0;
          --input-border: rgba(107, 124, 140, 0.3);
          --error-bg: rgba(200, 90, 84, 0.1);
          --error-color: #C85A54;
        }

        body.dark-theme {
          --bg-gradient-start: #1a2734;
          --bg-gradient-end: #2a3844;
          --text-primary: #F5F1E8;
          --text-secondary: #C4CDD5;
          --accent-color: #7BA5CC;
          --accent-hover: #6B9AC4;
          --nav-bg: #1a2734;
          --card-bg: rgba(42, 56, 68, 0.95);
          --danger-color: #E67A72;
          --danger-hover: #D66A62;
          --input-bg: #1a2734;
          --input-border: rgba(196, 205, 213, 0.3);
          --error-bg: rgba(230, 122, 114, 0.1);
          --error-color: #E67A72;
        }

        .profile-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          color: var(--text-primary);
          overflow-x: hidden;
          position: relative;
        }

        .circle {
          position: fixed;
          border-radius: 50%;
          background: rgba(91, 141, 184, 0.25);
          animation: float 20s infinite ease-in-out;
          box-shadow: 0 0 60px rgba(91, 141, 184, 0.3);
          filter: blur(1px);
          pointer-events: none;
        }

        body.dark-theme .circle {
          background: rgba(123, 165, 204, 0.3);
          box-shadow: 0 0 60px rgba(123, 165, 204, 0.25);
        }

        .circle-1 { width: 150px; height: 150px; top: 10%; left: 10%; animation-delay: 0s; }
        .circle-2 { width: 110px; height: 110px; top: 50%; right: 15%; animation-delay: 2s; }
        .circle-3 { width: 180px; height: 180px; bottom: 15%; left: 5%; animation-delay: 4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) translateX(30px) scale(1.1); opacity: 0.7; }
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: var(--nav-bg);
          backdrop-filter: blur(10px);
          padding: 1rem 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 700;
          color: #FBF8F0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #5B8DB8;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          font-weight: bold;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          align-items: center;
        }

        .nav-links a {
          color: #FBF8F0;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          opacity: 0.9;
          transition: all 0.2s ease;
        }

        .nav-links a:hover {
          opacity: 1;
          color: #7BA5CC;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .login-btn {
          background: #5B8DB8;
          color: #FBF8F0;
          padding: 0.65rem 1.75rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          background: #4A7BA4;
          transform: translateY(-1px);
        }

        .hamburger {
          cursor: pointer;
          color: #FBF8F0;
          margin-left: 0.5rem;
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: ${sidebarOpen ? '0' : '-350px'};
          width: 350px;
          height: 100vh;
          background: #FBF8F0;
          backdrop-filter: blur(10px);
          padding: 2rem;
          z-index: 2000;
          transition: right 0.3s ease;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        body.dark-theme .sidebar {
          background: #2a3844;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--accent-color);
        }

        .user-greeting {
          font-size: 1.2rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .close-btn {
          cursor: pointer;
          color: var(--text-primary);
          background: none;
          border: none;
        }

        .sidebar-links {
          list-style: none;
          margin-bottom: 2rem;
          flex: 1;
        }

        .sidebar-links li {
          margin-bottom: 1.5rem;
        }

        .sidebar-links a {
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 500;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
        }

        .sidebar-links a:hover {
          color: var(--accent-color);
        }

        .theme-switcher {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(107, 124, 140, 0.3);
        }

        .theme-label {
          font-weight: 600;
          margin-bottom: 1rem;
          display: block;
          color: var(--text-primary);
        }

        .theme-buttons {
          display: flex;
          gap: 1rem;
        }

        .theme-btn {
          flex: 1;
          padding: 0.8rem;
          border: 2px solid var(--accent-color);
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .theme-btn.active {
          background: var(--accent-color);
          color: #FBF8F0;
        }

        .theme-btn:hover {
          transform: translateY(-2px);
        }

        .logout-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(107, 124, 140, 0.3);
        }

        .logout-btn {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--danger-color);
          background: var(--danger-color);
          color: #FBF8F0;
          cursor: pointer;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
        }

        .logout-btn:hover {
          background: var(--danger-hover);
          transform: translateY(-2px);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1500;
          opacity: ${sidebarOpen ? '1' : '0'};
          visibility: ${sidebarOpen ? 'visible' : 'hidden'};
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .profile-header {
          padding: 8rem 4rem 3rem;
          position: relative;
          z-index: 1;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-button {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid var(--accent-color);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-button:hover {
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateX(-5px);
        }

        .profile-banner {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(91, 141, 184, 0.2);
        }

        .avatar-section {
          position: relative;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          font-size: 3rem;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(91, 141, 184, 0.3);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .profile-role {
          display: inline-block;
          background: var(--accent-color);
          color: #FBF8F0;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .profile-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 4rem 4rem;
          position: relative;
          z-index: 1;
        }

        .actions-bar {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-bottom: 2rem;
        }

        .action-btn {
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
        }

        .btn-primary {
          background: var(--accent-color);
          color: #FBF8F0;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        .btn-danger {
          background: transparent;
          color: var(--danger-color);
          border: 2px solid var(--danger-color);
        }

        .btn-danger:hover:not(:disabled) {
          background: var(--danger-color);
          color: #FBF8F0;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: var(--error-bg);
          border: 1px solid var(--error-color);
          color: var(--error-color);
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .content-grid {
          display: grid;
          gap: 2rem;
        }

        .card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(91, 141, 184, 0.2);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .info-group {
          margin-bottom: 1.5rem;
        }

        .info-label {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-value {
          font-size: 1.1rem;
          color: var(--text-primary);
          padding: 0.75rem;
          background: var(--input-bg);
          border-radius: 8px;
        }

        .info-input {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid var(--input-border);
          border-radius: 8px;
          font-size: 1rem;
          background: var(--input-bg);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .info-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
        }

        .info-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .loading-state, .error-state {
          text-align: center;
          padding: 3rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .retry-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: var(--accent-color);
          color: #FBF8F0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .navbar { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .profile-header { padding: 6rem 1.5rem 2rem; }
          .profile-body { padding: 2rem 1.5rem 3rem; }
          .profile-banner { flex-direction: column; text-align: center; }
          .actions-bar { flex-direction: column; }
          .action-btn { width: 100%; justify-content: center; }
          .sidebar { width: 280px; right: ${sidebarOpen ? '0' : '-280px'}; }
          .circle { opacity: 0.3; }
        }
      `}</style>

      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">R</div>
          Rentify
        </div>
        <ul className="nav-links">
          <li><a onClick={() => navigate('/')}>Home</a></li>
          <li><a onClick={() => navigate('/profile')}>Profile</a></li>
          <li><a onClick={() => navigate('/about')}>About Us</a></li>
          <li><a onClick={() => navigate('/contact')}>Contact</a></li>
          <li><a onClick={() => navigate('/settings')}>Settings</a></li>
        </ul>
        <div className="nav-right">
          {!isLoggedIn && (
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          )}
          <div className="hamburger" onClick={toggleSidebar}><Menu size={24} /></div>
        </div>
      </nav>

      <div className="overlay" onClick={toggleSidebar}></div>

      <div className="sidebar">
        <div className="sidebar-header">
          <span className="user-greeting">Hello, {username}!</span>
          <button className="close-btn" onClick={toggleSidebar}><X size={24} /></button>
        </div>
        <ul className="sidebar-links">
          <li><a onClick={() => navigate('/')}><Home size={20} /> Home</a></li>
          <li><a onClick={() => navigate('/profile')}><User size={20} /> Profile</a></li>
          <li><a onClick={() => navigate('/about')}><Info size={20} /> About Us</a></li>
          <li><a onClick={() => navigate('/contact')}><Mail size={20} /> Contact</a></li>
          <li><a onClick={() => navigate('/settings')}><Settings size={20} /> Settings</a></li>
        </ul>
        <div className="theme-switcher">
          <span className="theme-label">Theme</span>
          <div className="theme-buttons">
            <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>Light</button>
            <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>Dark</button>
          </div>
        </div>
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}><LogOut size={20} />Logout</button>
        </div>
      </div>

      <div className="profile-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          {isLoading ? (
            <div className="loading-state">
              <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-color)'}}/>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Profile...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={48} color="var(--danger-color)" />
              <h3>Error Loading Profile</h3>
              <p>{error}</p>
              <button onClick={fetchProfileData} className="retry-button">Try Again</button>
            </div>
          ) : (
            <div className="profile-banner">
              <div className="avatar-section">
                <div className="avatar">{profileData.username ? profileData.username.charAt(0).toUpperCase() : '?'}</div>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{profileData.fullName || profileData.username}</h1>
                <span className="profile-role">{profileData.userRole}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isLoading && !error && (
        <div className="profile-body">
          <div className="actions-bar">
            {!isEditing ? (
              <button className="action-btn btn-primary" onClick={handleEdit}>
                <Edit2 size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button className="action-btn btn-danger" onClick={handleCancel} disabled={isSaving}>
                  <X size={18} /> Cancel
                </button>
                <button className="action-btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>

          {isEditing && error && (
            <div className="error-message">
              <AlertCircle size={18}/> {error}
            </div>
          )}

          <div className="content-grid">
            <div className="card">
              <h2 className="card-title"><User size={24} /> Personal Information</h2>
              {renderInfoField('Username', 'username', <User size={16} />, false, false)}
              {renderInfoField('Full Name', 'fullName', <User size={16} />, false, true)}
              {renderInfoField('Email Address', 'email', <Mail size={16} />, false, true)}
              {renderInfoField('Phone Number', 'phone', <Phone size={16} />, false, true)}
              {renderInfoField('Member Since', 'joinDate', <Calendar size={16} />, false, false)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
