// src/api/axiosConfig.js
import axios from 'axios';


// Base URL of your Spring Boot backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://project-rentify.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial: Sends cookies (like JSESSIONID) with requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get CSRF token from cookie
function getCsrfToken() {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

// Function to fetch CSRF token from server
export const fetchCsrfToken = async () => {
  try {
    // Make a simple GET request to trigger CSRF token generation
    await axios.get(`${API_BASE_URL}/auth/status`, { withCredentials: true });
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }
};

// --- Optional but Recommended: Response Interceptor ---
// Handles common responses like Unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized errors (e.g., session expired or invalid login)
      console.error("API Error: Unauthorized (401). Possible session expiry.");
      // Clear potentially stale session info from frontend
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userRole');
      // Redirect to login page - use window.location for simplicity here,
      // but a router-based redirect might be better in a larger app context.
      if (window.location.pathname !== '/login') {
         // Prevent redirect loop if already on login page
         window.location.href = '/login?sessionExpired=true'; // Add query param if needed
      }

    } else if (error.response && error.response.status === 403) {
      // Handle Forbidden errors (logged in but lacks permission)
      console.error("API Error: Forbidden (403). User lacks necessary roles/permissions.");
      // Optionally show a message to the user, but don't log them out automatically
      // alert("You don't have permission to perform this action.");

    } else {
        // Handle other errors (like 500 Internal Server Error, network errors)
        console.error('API call failed:', error.response || error.request || error.message);
    }
    // Reject the promise so the component calling the API can also handle the error if needed
    return Promise.reject(error);
  }
);
// --- End Optional Interceptor ---

export default apiClient;