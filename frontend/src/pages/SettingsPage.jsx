import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Bell, Lock, Globe, Mail, Shield, Eye, Trash2, Download, Check } from 'lucide-react';

const SettingsPage = () => {
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: true,
    weeklyDigest: true,
    propertyAlerts: true,
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: false,
    language: 'en',
    currency: 'LKR',
   
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  const handleExportData = () => {
    alert('Your data export has been initiated. You will receive an email with download link shortly.');
  };

  return (
    <div className="settings-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --bg-gradient-start: #2563eb;
          --bg-gradient-end: #3b82f6;
          --bg-color: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --card-bg: white;
          --border-color: #e2e8f0;
          --success-color: #10b981;
          --danger-color: #ef4444;
        }

        body.dark-theme {
          --bg-gradient-start: #1e3a8a;
          --bg-gradient-end: #1e40af;
          --bg-color: #0f172a;
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --accent-color: #60a5fa;
          --accent-hover: #3b82f6;
          --card-bg: #1e293b;
          --border-color: #334155;
          --success-color: #34d399;
          --danger-color: #f87171;
        }

        .settings-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
        }

        .settings-header {
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          padding: 2rem;
          color: white;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .header-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .settings-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .success-banner {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: var(--success-color);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.3s ease;
          z-index: 1000;
          font-weight: 600;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .settings-grid {
          display: grid;
          gap: 2rem;
        }

        .settings-section {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-color);
        }

        .section-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: var(--bg-color);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .setting-item:hover {
          transform: translateX(5px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .setting-info {
          flex: 1;
        }

        .setting-label {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.25rem;
          display: block;
        }

        .setting-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .toggle-switch {
          position: relative;
          width: 56px;
          height: 28px;
          background: var(--border-color);
          border-radius: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-switch.active {
          background: var(--accent-color);
        }

        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(28px);
        }

        .select-wrapper {
          position: relative;
        }

        .setting-select {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-primary);
          font-size: 0.95rem;
          cursor: pointer;
          min-width: 200px;
          transition: all 0.3s ease;
        }

        .setting-select:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .theme-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .theme-option {
          padding: 1.5rem;
          border: 3px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          background: var(--bg-color);
        }

        .theme-option:hover {
          transform: translateY(-2px);
          border-color: var(--accent-color);
        }

        .theme-option.active {
          border-color: var(--accent-color);
          background: var(--accent-color);
          color: white;
        }

        .theme-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .theme-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .danger-zone {
          border: 2px solid var(--danger-color);
        }

        .danger-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background: var(--danger-color);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }

        .danger-button:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .secondary-button:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .settings-body {
            padding: 1rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .theme-options {
            grid-template-columns: 1fr;
          }

          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .setting-select {
            width: 100%;
          }

          .success-banner {
            right: 1rem;
            left: 1rem;
          }
        }
      `}</style>

      {showSuccess && (
        <div className="success-banner">
          <Check size={20} />
          Settings saved successfully!
        </div>
      )}

      <div className="settings-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <h1 className="header-title">Settings</h1>
          <p className="header-subtitle">Manage your account preferences and settings</p>
        </div>
      </div>

      <div className="settings-body">
        <div className="settings-grid">
          {/* Appearance Section */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <h2 className="section-title">Appearance</h2>
            </div>

            <div className="theme-options">
              <div 
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-icon">☀️</div>
                <div className="theme-name">Light Mode</div>
              </div>

              <div 
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-icon">🌙</div>
                <div className="theme-name">Dark Mode</div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <Bell size={20} />
              </div>
              <h2 className="section-title">Notifications</h2>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Email Notifications</label>
                <span className="setting-description">Receive updates via email</span>
              </div>
              <div 
                className={`toggle-switch ${settings.emailNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('emailNotifications')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Push Notifications</label>
                <span className="setting-description">Get notified on your device</span>
              </div>
              <div 
                className={`toggle-switch ${settings.pushNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('pushNotifications')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">SMS Notifications</label>
                <span className="setting-description">Receive text messages for important updates</span>
              </div>
              <div 
                className={`toggle-switch ${settings.smsNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('smsNotifications')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Property Alerts</label>
                <span className="setting-description">Get notified about new properties</span>
              </div>
              <div 
                className={`toggle-switch ${settings.propertyAlerts ? 'active' : ''}`}
                onClick={() => handleToggle('propertyAlerts')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Weekly Digest</label>
                <span className="setting-description">Receive weekly summary emails</span>
              </div>
              <div 
                className={`toggle-switch ${settings.weeklyDigest ? 'active' : ''}`}
                onClick={() => handleToggle('weeklyDigest')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Marketing Emails</label>
                <span className="setting-description">Receive promotional content</span>
              </div>
              <div 
                className={`toggle-switch ${settings.marketingEmails ? 'active' : ''}`}
                onClick={() => handleToggle('marketingEmails')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <Shield size={20} />
              </div>
              <h2 className="section-title">Security & Privacy</h2>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Two-Factor Authentication</label>
                <span className="setting-description">Add an extra layer of security</span>
              </div>
              <div 
                className={`toggle-switch ${settings.twoFactorAuth ? 'active' : ''}`}
                onClick={() => handleToggle('twoFactorAuth')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Login Alerts</label>
                <span className="setting-description">Get notified of new login attempts</span>
              </div>
              <div 
                className={`toggle-switch ${settings.loginAlerts ? 'active' : ''}`}
                onClick={() => handleToggle('loginAlerts')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Data Sharing</label>
                <span className="setting-description">Allow data sharing with partners</span>
              </div>
              <div 
                className={`toggle-switch ${settings.dataSharing ? 'active' : ''}`}
                onClick={() => handleToggle('dataSharing')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Change Password</label>
                <span className="setting-description">Update your account password</span>
              </div>
              <button className="secondary-button" onClick={() => alert('Password change feature coming soon!')}>
                <Lock size={16} />
                Change
              </button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <Globe size={20} />
              </div>
              <h2 className="section-title">Preferences</h2>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Language</label>
                <span className="setting-description">Choose your preferred language</span>
              </div>
              <div className="select-wrapper">
                <select 
                  className="setting-select"
                  value={settings.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Currency</label>
                <span className="setting-description">Display prices in your currency</span>
              </div>
              <div className="select-wrapper">
                <select 
                  className="setting-select"
                  value={settings.currency}
                  onChange={(e) => handleSelectChange('currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="LKR">LKR </option>
                  
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-section danger-zone">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'var(--danger-color)' }}>
                <Trash2 size={20} />
              </div>
              <h2 className="section-title">Danger Zone</h2>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Export Your Data</label>
                <span className="setting-description">Download a copy of your account data</span>
              </div>
              <button className="secondary-button" onClick={handleExportData}>
                <Download size={16} />
                Export Data
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Delete Account</label>
                <span className="setting-description">Permanently delete your account and all data</span>
              </div>
              <button className="danger-button" onClick={handleDeleteAccount}>
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
