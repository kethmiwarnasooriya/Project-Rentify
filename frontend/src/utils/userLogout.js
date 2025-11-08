import apiClient from '../api/axiosConfig';

/**
 * Performs user logout without affecting admin session
 * Clears only user-specific session data
 */
export const performUserLogout = async () => {
  console.log('Performing user logout...');
  
  try {
    // Call logout API
    await apiClient.post('/auth/logout').catch(error => {
      console.log('Logout API call failed (continuing anyway):', error);
    });
    
    // Clear ONLY user session data (preserve admin session if exists)
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectAfterLogin');
    
    // Clear local storage
    localStorage.clear();
    
    console.log('User session data cleared (admin session preserved)');
    
  } catch (error) {
    console.error('Error during user logout:', error);
  }
};

/**
 * Clears user session data without API call
 * Used for immediate session clearing
 */
export const clearUserSession = () => {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('redirectAfterLogin');
  localStorage.clear();
};

export default performUserLogout;
