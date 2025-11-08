import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call the backend logout endpoint
      await apiClient.post('/auth/logout');
      console.log('Logout API successful');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    }

    try {
      // Clear ONLY user session data (preserve admin session)
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('redirectAfterLogin');
      localStorage.clear();
      
      // Force page reload to home
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback
      window.location.href = '/';
    }
    
    setIsLoggingOut(false);
  };

  return { logout, isLoggingOut };
};

export default useLogout;