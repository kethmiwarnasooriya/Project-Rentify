import apiClient from '../api/axiosConfig';

export const performAdminLogout = () => {
  console.log('Performing admin logout...');
  
  try {
    // Clear ONLY admin-specific data from localStorage
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRoles');
    localStorage.removeItem('adminSessionId');
    
    console.log('Admin session data cleared');
    
    // Call logout API for admin session
    apiClient.post('/auth/logout').catch(error => {
      console.log('Admin logout API call failed (continuing anyway):', error);
    });
    
    // Redirect to admin login page
    console.log('Redirecting to admin login page...');
    window.location.replace('/admin/login');
    
  } catch (error) {
    console.error('Error during admin logout:', error);
    // Fallback: just redirect to admin login
    window.location.replace('/admin/login');
  }
};

export default performAdminLogout;