import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Bell, Lock, Globe, Mail, Shield, Eye, EyeOff, Trash2, Check, Menu, X, Home, User, Info, Settings, LogOut, Smartphone, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import { useNotification } from '../components/NotificationSystem';
import performLogout from '../utils/logout';

const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState(sessionStorage.getItem('username') || 'Guest');
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');

  const { showNotification } = useNotification();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: true,
    weeklyDigest: true,
    propertyAlerts: true,
    twoFactorAuth: false,
    loginAlerts: true,
    language: 'en',
    currency: 'LKR',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const [twoFAVerified, setTwoFAVerified] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    showSuccessMessage('Theme updated successfully!');
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggle = async (setting) => {
    const originalValue = settings[setting];

    if (setting === 'twoFactorAuth') {
      if (!settings.twoFactorAuth) {
        setShow2FAModal(true);
      } else {
        if (window.confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
          setIsSubmitting(true);
          try {
            await apiClient.post('/security/2fa/disable');
            setSettings(prev => ({ ...prev, twoFactorAuth: false }));
            setTwoFAVerified(false);
            showSuccessMessage('Two-Factor Authentication disabled');
          } catch (error) {
            console.error('Failed to disable 2FA:', error);
            alert(error.response?.data?.message || 'Could not disable 2FA. Please try again.');
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    } else if (setting === 'loginAlerts') {
      const userEmail = sessionStorage.getItem('email') || 'your email';
      setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
      try {
        await apiClient.patch('/settings', { [setting]: !originalValue });
        if (!settings.loginAlerts) {
          showSuccessMessage(`Login alerts enabled! Notifications will be sent to ${userEmail}`);
        } else {
          showSuccessMessage('Login alerts disabled');
        }
      } catch (error) {
        console.error(`Failed to update ${setting}:`, error);
        setSettings(prev => ({ ...prev, [setting]: originalValue }));
        alert(error.response?.data?.message || `Could not update ${setting}. Please try again.`);
      }
    } else {
      setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
      try {
        await apiClient.patch('/settings', { [setting]: !originalValue });
        showSuccessMessage('Settings saved successfully!');
      } catch (error) {
        console.error(`Failed to update ${setting}:`, error);
        setSettings(prev => ({ ...prev, [setting]: originalValue }));
        alert(error.response?.data?.message || `Could not update ${setting}. Please try again.`);
      }
    }
  };

  const handleEnable2FA = async () => {
    setTwoFAError('');
    if (!twoFACode || twoFACode.length !== 6 || !/^\d{6}$/.test(twoFACode)) {
      setTwoFAError('Please enter a valid 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/security/2fa/verify', { code: twoFACode });
      setSettings(prev => ({ ...prev, twoFactorAuth: true }));
      setTwoFAVerified(true);
      setShow2FAModal(false);
      setTwoFACode('');
      setTwoFAError('');
      showSuccessMessage('Two-Factor Authentication enabled successfully!');
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      setTwoFAError(error.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.put('/security/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      sessionStorage.setItem('password', passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
      showSuccessMessage('Password changed successfully!');

      const userEmail = sessionStorage.getItem('email');
      if (settings.loginAlerts && userEmail) {
        console.log(`Login alert: Password changed for account ${userEmail}`);
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      setPasswordError(error.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = async (setting, value) => {
    const originalValue = settings[setting];
    setSettings(prev => ({ ...prev, [setting]: value }));
    try {
      await apiClient.patch('/settings', { [setting]: value });
      showSuccessMessage('Settings saved successfully!');
    } catch (error) {
      console.error(`Failed to update ${setting}:`, error);
      setSettings(prev => ({ ...prev, [setting]: originalValue }));
      alert(error.response?.data?.message || `Could not update ${setting}. Please try again.`);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMessage = `Are you sure you want to delete your account "${username}"?\n\nThis will permanently delete:\n• Your profile and personal information\n• All your property listings\n• Your rental history\n• All saved preferences\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      setIsSubmitting(true);
      console.log('🗑️ Starting account deletion process...');

      try {
        // Delete the user account (this will also delete all properties and associated files)
        showNotification('info', 'Deleting Account', 'Removing your account and all associated data...');
        console.log('👤 Deleting user account and all associated data...');
        const accountDeleteResponse = await apiClient.delete('/users/me');
        console.log('✅ Account deletion successful:', accountDeleteResponse);

        showNotification('success', 'Account Deleted', 'Your account and all associated data have been permanently deleted. You will be logged out.');
        setTimeout(() => {
          handleLogout();
        }, 2000);

      } catch (error) {
        console.error('❌ Failed to delete account:', error);
        console.error('🔍 Account deletion error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          config: error.config
        });

        let errorMessage = 'Could not delete account. Please contact support.';
        if (error.response?.status === 403) {
          errorMessage = 'Access denied. You may not have permission to delete this account.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Account not found. It may have already been deleted.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error occurred while deleting account. Please try again later.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        showNotification('error', 'Delete Failed', errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };



  const handleLogout = () => {
    console.log('Settings page logout clicked');
    performLogout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          --success-color: #5B9A8B;
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
          --success-color: #7DCEA0;
        }

        .settings-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          color: var(--text-primary);
          overflow-x: hidden;
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
          text-decoration: none;
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
          text-decoration: none;
          color: #FBF8F0;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s ease;
          cursor: pointer;
          opacity: 0.9;
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
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
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
          text-decoration: none;
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

        .logout-btn:hover:not(:disabled) {
          background: var(--danger-hover);
          border-color: var(--danger-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(200, 90, 84, 0.3);
        }

        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .settings-header {
          padding: 8rem 4rem 3rem 4rem;
          position: relative;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(91, 141, 184, 0.25);
          animation: float 20s infinite ease-in-out;
          box-shadow: 0 0 60px rgba(91, 141, 184, 0.3);
          filter: blur(1px);
        }

        body.dark-theme .circle {
          background: rgba(123, 165, 204, 0.3);
          box-shadow: 0 0 60px rgba(123, 165, 204, 0.25);
        }

        .circle-1 {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 110px;
          height: 110px;
          top: 5%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 90px;
          height: 90px;
          bottom: 20%;
          right: 10%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px) translateX(30px) scale(1.1);
            opacity: 0.7;
          }
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid var(--accent-color);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-button:hover {
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateX(-5px);
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.2);
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .settings-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 4rem 4rem 4rem;
        }

        .success-banner {
          position: fixed;
          top: 6rem;
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
          z-index: 2500;
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
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(91, 141, 184, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(91, 141, 184, 0.2);
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
          color: var(--text-primary);
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: var(--bg-gradient-start);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .setting-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.15);
        }

        .setting-info {
          flex: 1;
        }

        .setting-label {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-primary);
        }

        .setting-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .toggle-switch {
          position: relative;
          width: 56px;
          height: 28px;
          background: rgba(107, 124, 140, 0.3);
          border-radius: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
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
          border: 2px solid rgba(91, 141, 184, 0.3);
          border-radius: 8px;
          background: var(--bg-gradient-start);
          color: var(--text-primary);
          font-size: 0.95rem;
          cursor: pointer;
          min-width: 200px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .setting-select:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
        }

        .setting-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .appearance-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .theme-option {
          padding: 1.5rem;
          border: 3px solid rgba(91, 141, 184, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          background: var(--bg-gradient-start);
        }

        .theme-option:hover {
          transform: translateY(-2px);
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.2);
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

        .danger-button:hover:not(:disabled) {
          background: var(--danger-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(200, 90, 84, 0.3);
        }

        .danger-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid var(--accent-color);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .secondary-button:hover:not(:disabled) {
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.2);
        }

        .secondary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(91, 141, 184, 0.2);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-close {
          cursor: pointer;
          color: var(--text-secondary);
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: var(--bg-gradient-start);
          color: var(--text-primary);
        }

        .modal-content {
          color: var(--text-primary);
        }

        .qr-code-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          margin: 1.5rem 0;
          border: 2px solid rgba(91, 141, 184, 0.2);
        }

        .qr-code-placeholder {
          width: 200px;
          height: 200px;
          margin: 0 auto;
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          flex-direction: column;
        }

        .backup-code {
          background: var(--bg-gradient-start);
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          text-align: center;
          margin: 1rem 0;
          font-size: 1.2rem;
          letter-spacing: 2px;
          color: var(--accent-color);
          border: 2px dashed rgba(91, 141, 184, 0.3);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid rgba(91, 141, 184, 0.3);
          border-radius: 8px;
          background: var(--bg-gradient-start);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: var(--text-secondary);
          background: none;
          border: none;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: var(--text-primary);
        }

        .error-message {
          color: var(--danger-color);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .info-message {
          background: rgba(91, 141, 184, 0.1);
          border-left: 4px solid var(--accent-color);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .primary-button {
          flex: 1;
          padding: 0.875rem 1.75rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .primary-button:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-button {
          flex: 1;
          padding: 0.875rem 1.75rem;
          background: transparent;
          color: var(--text-primary);
          border: 2px solid rgba(91, 141, 184, 0.3);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover:not(:disabled) {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--success-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 1024px) {
          .navbar {
            padding: 1rem 2rem;
          }

          .settings-header {
            padding: 7rem 2rem 2rem 2rem;
          }

          .settings-body {
            padding: 0 2rem 3rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .settings-header {
            padding: 6rem 1.5rem 2rem 1.5rem;
          }

          .settings-body {
            padding: 0 1rem 2rem 1rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .appearance-grid {
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
            top: 5rem;
          }

          .modal {
            width: 95%;
            padding: 1.5rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }

          .circle {
            opacity: 0.3;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>
          <div className="logo-icon">R</div>
          Rentify
        </div>

        <ul className="nav-links">
          <li><a onClick={() => window.location.href = '/'}>Home</a></li>
          <li><a onClick={() => window.location.href = '/profile'}>Profile</a></li>
          <li><a onClick={() => window.location.href = '/about'}>About Us</a></li>
          <li><a onClick={() => window.location.href = '/contact'}>Contact</a></li>
          <li><a onClick={() => window.location.href = '/settings'}>Settings</a></li>
        </ul>

        <div className="nav-right">
          {!isLoggedIn && (
            <button className="login-btn" onClick={() => window.location.href = '/login'}>
              Login
            </button>
          )}
          <div className="hamburger" onClick={toggleSidebar}>
            <Menu size={24} />
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div className="overlay" onClick={toggleSidebar}></div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="user-greeting">Hello, {username}!</span>
          <button className="close-btn" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <ul className="sidebar-links">
          <li><a onClick={() => window.location.href = '/'}><Home size={20} /> Home</a></li>
          <li><a onClick={() => window.location.href = '/profile'}><User size={20} /> Profile</a></li>
          <li><a onClick={() => window.location.href = '/about'}><Info size={20} /> About Us</a></li>
          <li><a onClick={() => window.location.href = '/contact'}><Mail size={20} /> Contact</a></li>
          <li><a onClick={() => window.location.href = '/settings'}><Settings size={20} /> Settings</a></li>
        </ul>

        <div className="theme-switcher">
          <span className="theme-label">Theme</span>
          <div className="theme-buttons">
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Settings Header */}
      <div className="settings-header">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>

        <div className="header-content">
          <button className="back-button" onClick={() => window.location.href = '/'}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <h1 className="header-title">Settings</h1>
          <p className="header-subtitle">Manage your account preferences and settings</p>
        </div>
      </div>

      {/* Settings Body */}
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

            <div className="appearance-grid">
              <div
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => !isSubmitting && handleThemeChange('light')}
              >
                <div className="theme-icon">☀️</div>
                <div className="theme-name">Light Mode</div>
              </div>

              <div
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => !isSubmitting && handleThemeChange('dark')}
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
                onClick={() => !isSubmitting && handleToggle('emailNotifications')}
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
                onClick={() => !isSubmitting && handleToggle('pushNotifications')}
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
                onClick={() => !isSubmitting && handleToggle('smsNotifications')}
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
                onClick={() => !isSubmitting && handleToggle('propertyAlerts')}
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
                onClick={() => !isSubmitting && handleToggle('weeklyDigest')}
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
                onClick={() => !isSubmitting && handleToggle('marketingEmails')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          {/* Security & Privacy Section */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <Shield size={20} />
              </div>
              <h2 className="section-title">Security & Privacy</h2>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">
                  Two-Factor Authentication
                  {settings.twoFactorAuth && twoFAVerified && (
                    <span className="verification-badge" style={{ marginLeft: '0.5rem' }}>
                      <Check size={14} />
                      Enabled
                    </span>
                  )}
                </label>
                <span className="setting-description">Add an extra layer of security to your account</span>
              </div>
              <div
                className={`toggle-switch ${settings.twoFactorAuth ? 'active' : ''}`}
                onClick={() => !isSubmitting && handleToggle('twoFactorAuth')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Login Alerts</label>
                <span className="setting-description">Get notified via email when someone logs into your account</span>
              </div>
              <div
                className={`toggle-switch ${settings.loginAlerts ? 'active' : ''}`}
                onClick={() => !isSubmitting && handleToggle('loginAlerts')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Change Password</label>
                <span className="setting-description">Update your account password for security</span>
              </div>
              <button
                className="secondary-button"
                onClick={() => setShowPasswordModal(true)}
                disabled={isSubmitting}
              >
                <Lock size={16} />
                Change Password
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <option value="USD">USD ($)</option>
                  <option value="LKR">LKR (Rs)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="settings-section danger-zone">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'var(--danger-color)' }}>
                <Trash2 size={20} />
              </div>
              <h2 className="section-title">Danger Zone</h2>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Delete Account</label>
                <span className="setting-description">Permanently delete your account and all data</span>
              </div>
              <button
                className="danger-button"
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Smartphone size={24} style={{ color: 'var(--accent-color)' }} />
                Enable Two-Factor Authentication
              </h2>
              <button className="modal-close" onClick={() => {
                setShow2FAModal(false);
                setTwoFACode('');
                setTwoFAError('');
              }}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="info-message">
                <strong>Step 1:</strong> Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </div>

              <div className="qr-code-container">
                <div className="qr-code-placeholder">
                  <Smartphone size={48} style={{ marginBottom: '1rem' }} />
                  <div>QR Code</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Scan with your app</div>
                </div>
              </div>

              <div className="info-message">
                <strong>Step 2:</strong> Save this backup code in a secure place
              </div>

              <div className="backup-code">
                RENT-{Math.random().toString(36).substr(2, 4).toUpperCase()}-{Math.random().toString(36).substr(2, 4).toUpperCase()}
              </div>

              <div className="info-message">
                <strong>Step 3:</strong> Enter the 6-digit code from your authenticator app
              </div>

              {twoFAError && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {twoFAError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter 6-digit code"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={isSubmitting}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFACode('');
                    setTwoFAError('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleEnable2FA}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <KeyRound size={24} style={{ color: 'var(--accent-color)' }} />
                Change Password
              </h2>
              <button className="modal-close" onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordError('');
              }}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="info-message">
                For your security, please enter your current password and choose a new strong password.
              </div>

              {passwordError && (
                <div className="error-message" style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={16} />
                  {passwordError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    disabled={isSubmitting}
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter new password (min 8 characters)"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    disabled={isSubmitting}
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    disabled={isSubmitting}
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handlePasswordChange}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {showSuccess && (
        <div className="success-banner">
          <Check size={20} />
          {successMessage}
        </div>
      )}


    </div>
  );
};

export default SettingsPage;