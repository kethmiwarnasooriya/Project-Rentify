import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationSystem';
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
import EditProperty from './pages/RentalOwner/EditProperty';
import ViewProperty from './pages/RentalOwner/ViewProperty';
import UserNotifications from './pages/UserNotifications';
import Footer from './components/Footer';

// Resource Pages
import FAQ from './pages/Resources/FAQ';
import Blog from './pages/Resources/Blog';

// Legal Pages
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsConditions from './pages/Legal/TermsConditions';
import CookiePolicy from './pages/Legal/CookiePolicy';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminMessages from './pages/Admin/AdminMessages';
import AdminProperties from './pages/Admin/AdminProperties';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

// Admin Protected Route Component
const AdminRoute = ({ children }) => {
  const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const adminRoles = JSON.parse(localStorage.getItem('adminRoles') || '[]');

  if (!adminLoggedIn || !adminRoles.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Layout Component to handle footer visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/signup', '/admin/login']; // pages without footer
  const isAdminPath = location.pathname.startsWith('/admin');
  const hideFooter = hideFooterPaths.includes(location.pathname) || isAdminPath;

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
      <NotificationProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/tenant-dashboard" element={<TenantDashboard />} />

            {/* Resource Pages */}

            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />


            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><UserNotifications /></ProtectedRoute>} />
            <Route path="/owner/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
            <Route path="/owner/edit-property/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
            <Route path="/owner/view-property/:id" element={<ProtectedRoute><ViewProperty /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/owner/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/tenant/dashboard" element={<ProtectedRoute><TenantDashboard /></ProtectedRoute>} />

            {/* Admin Routes - Private and not linked anywhere */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </NotificationProvider>
    </Router>
  );
}

export default App;
