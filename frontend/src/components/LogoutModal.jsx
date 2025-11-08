import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X, Loader2 } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import { clearUserSession } from '../utils/userLogout';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout initiated...');
    setIsLoggingOut(true);
    
    try {
      // Call the backend logout endpoint
      console.log('Calling logout API...');
      const response = await apiClient.post('/auth/logout');
      console.log('Logout API call successful:', response.status);
    } catch (error) {
      console.error('Logout API call failed:', error);
      console.log('Continuing with logout despite API failure...');
      // Continue with logout even if API call fails
    }

    try {
      // Clear only user session data (preserve admin session)
      console.log('Clearing user session data...');
      clearUserSession();
      
      console.log('Session data cleared');
      
      // Close modal first
      onClose();
      
      // Small delay to ensure modal closes
      setTimeout(() => {
        console.log('Redirecting to home page...');
        // Force page reload to ensure clean state
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Error during logout cleanup:', error);
      // Fallback: force page reload
      window.location.href = '/';
    }
    
    setIsLoggingOut(false);
    console.log('Logout process completed');
  };

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-header">
          <div className="logout-icon">
            <LogOut size={24} />
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="logout-modal-content">
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to logout? You will be redirected to the home page.</p>
        </div>
        
        <div className="logout-modal-actions">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button 
            className="confirm-logout-btn" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={16} className="spinner" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;