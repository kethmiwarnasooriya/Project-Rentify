import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import OwnerDashboard from './pages/RentalOwner/OwnerDashboard';
import TenantDashboard from './pages/Tenant/TenantDashboard';
import AboutUsPage from './pages/AboutusPage';
import ContactUsPage from './pages/ContactUsPage';
import AddProperty from './pages/RentalOwner/AddProperty';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const userRole = sessionStorage.getItem('userRole');
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

// Layout Component to handle footer visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/signup']; // pages without footer
  const hideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <>
      {children}
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />  
          <Route path="/about" element={<AboutUsPage/>} />
          <Route path="/contact" element={<ContactUsPage />} /> 
          <Route path="/settings" element={<SettingsPage />} />  
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/owner/add-property" element={<ProtectedRoute requiredRole="owner"><AddProperty /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/tenant/dashboard" element={<ProtectedRoute requiredRole="tenant"><TenantDashboard /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
