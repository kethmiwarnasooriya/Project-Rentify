import React, { useState, useEffect } from 'react';
import SettingsPage from './pages/SettingsPage';
import TenantDashboard from './pages/Tenant/TenantDashboard';
import OwnerDashboard from './pages/RentalOwner/OwnerDashboard';
import AddProperty from './pages/RentalOwner/AddProperty';
import ProfilePage from './pages/ProfilePage';

const ThemeTest = () => {
  const [currentPage, setCurrentPage] = useState('settings');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage />;
      case 'tenant':
        return <TenantDashboard />;
      case 'owner':
        return <OwnerDashboard />;
      case 'addProperty':
        return <AddProperty />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <SettingsPage />;
    }
  };

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button onClick={() => setCurrentPage('settings')} style={{
          padding: '5px 10px',
          background: currentPage === 'settings' ? '#3b82f6' : '#f3f4f6',
          color: currentPage === 'settings' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Settings
        </button>
        <button onClick={() => setCurrentPage('tenant')} style={{
          padding: '5px 10px',
          background: currentPage === 'tenant' ? '#3b82f6' : '#f3f4f6',
          color: currentPage === 'tenant' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Tenant
        </button>
        <button onClick={() => setCurrentPage('owner')} style={{
          padding: '5px 10px',
          background: currentPage === 'owner' ? '#3b82f6' : '#f3f4f6',
          color: currentPage === 'owner' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Owner
        </button>
        <button onClick={() => setCurrentPage('addProperty')} style={{
          padding: '5px 10px',
          background: currentPage === 'addProperty' ? '#3b82f6' : '#f3f4f6',
          color: currentPage === 'addProperty' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add Property
        </button>
        <button onClick={() => setCurrentPage('profile')} style={{
          padding: '5px 10px',
          background: currentPage === 'profile' ? '#3b82f6' : '#f3f4f6',
          color: currentPage === 'profile' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Profile
        </button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{
          padding: '5px 10px',
          background: theme === 'dark' ? '#1f2937' : '#fbbf24',
          color: theme === 'dark' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          {theme === 'light' ? '🌙' : '☀️'} {theme}
        </button>
      </div>
      {renderPage()}
    </div>
  );
};

export default ThemeTest;