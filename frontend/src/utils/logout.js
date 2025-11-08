import apiClient from '../api/axiosConfig';

export const performLogout = () => {
  console.log('Performing user logout...');
  
  try {
    // Clear ONLY user session data (preserve admin session)
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectAfterLogin');
    localStorage.clear();
    
    // Clear any cookies (if any)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('User session data cleared (admin session preserved)');
    
    // Try to call logout API but don't wait for it
    apiClient.post('/auth/logout').catch(error => {
      console.log('Logout API call failed (continuing anyway):', error);
    });
    
    // Force page reload to home
    console.log('Redirecting to home page...');
    window.location.replace('/');
    
  } catch (error) {
    console.error('Error during logout:', error);
    // Fallback: just redirect
    window.location.replace('/');
  }
};

export default performLogout;