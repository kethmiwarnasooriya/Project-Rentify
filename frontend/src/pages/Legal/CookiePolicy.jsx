import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, Home, User, Info, Mail, Settings, LogOut, Cookie, Shield, Eye, Database, AlertCircle } from 'lucide-react';

const CookiePolicy = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => sessionStorage.getItem('theme') || 'light');
  const [username] = useState(sessionStorage.getItem('username') || 'Guest');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('redirectAfterLogin');
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="cookie-container">
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
        }

        .cookie-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          color: var(--text-primary);
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          overflow-x: hidden;
        }

        /* Navigation Bar - Same as HomePage */
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

        .hamburger {
          cursor: pointer;
          color: #FBF8F0;
          margin-left: 0.5rem;
        }

        /* Sidebar - Same as HomePage */
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

        .logout-btn:hover {
          background: var(--danger-hover);
          border-color: var(--danger-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(200, 90, 84, 0.3);
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

        /* Cookie Policy Content */
        .cookie-header {
          margin-top: 5rem;
          padding: 3rem 4rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent-color);
          color: #FBF8F0;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .back-button:hover {
          background: var(--accent-hover);
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
        }

        .header-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .header-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 4rem 4rem;
        }

        .content-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section {
          margin-bottom: 2.5rem;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title svg {
          color: var(--accent-color);
        }

        .section-content {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1rem;
        }

        .section-content p {
          margin-bottom: 1rem;
        }

        .section-content ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .section-content li {
          margin-bottom: 0.75rem;
        }

        .section-content strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .cookie-type {
          background: rgba(91, 141, 184, 0.08);
          border-left: 4px solid var(--accent-color);
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .cookie-type h4 {
          color: var(--accent-color);
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .cookie-type p {
          margin-bottom: 0;
          color: var(--text-secondary);
        }

        .info-box {
          background: rgba(91, 184, 139, 0.1);
          border-left: 4px solid #5BB88B;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .info-box p {
          margin-bottom: 0;
          font-weight: 500;
          color: var(--text-primary);
        }

        .last-updated {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(107, 124, 140, 0.2);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .navbar {
            padding: 1rem 2rem;
          }

          .cookie-header {
            padding: 3rem 2rem 2rem;
          }

          .main-content {
            padding: 0 2rem 3rem;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .cookie-header {
            padding: 2.5rem 1.5rem 1.5rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .header-subtitle {
            font-size: 1rem;
          }

          .main-content {
            padding: 0 1.5rem 2rem;
          }

          .content-card {
            padding: 2rem 1.5rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">R</div>
          Rentify
        </div>
        <ul className="nav-links">
          <li><a onClick={() => navigate('/')}>Home</a></li>
          <li><a onClick={() => navigate('/profile')}>Profile</a></li>
          <li><a onClick={() => navigate('/about')}>About Us</a></li>
          <li><a onClick={() => navigate('/contact')}>Contact</a></li>
          <li><a onClick={() => navigate('/settings')}>Settings</a></li>
        </ul>
        <div className="nav-right">
          <div className="hamburger" onClick={toggleSidebar}>
            <Menu size={24} />
          </div>
        </div>
      </nav>

      <div className="overlay" onClick={toggleSidebar}></div>

      <div className="sidebar">
        <div className="sidebar-header">
          <span className="user-greeting">Hello, {username}!</span>
          <button className="close-btn" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <ul className="sidebar-links">
          <li><a onClick={() => navigate('/')}><Home size={20} /> Home</a></li>
          <li><a onClick={() => navigate('/profile')}><User size={20} /> Profile</a></li>
          <li><a onClick={() => navigate('/about')}><Info size={20} /> About Us</a></li>
          <li><a onClick={() => navigate('/contact')}><Mail size={20} /> Contact</a></li>
          <li><a onClick={() => navigate('/settings')}><Settings size={20} /> Settings</a></li>
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

      <div className="cookie-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <h1 className="header-title">Cookie Policy</h1>
        <p className="header-subtitle">How we use cookies and similar technologies on our platform</p>
      </div>

      <div className="main-content">
        <div className="content-card">
          <div className="section">
            <h2 className="section-title">
              <Cookie size={24} />
              What Are Cookies?
            </h2>
            <div className="section-content">
              <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our services.</p>
              <div className="info-box">
                <p>We use cookies responsibly and transparently to enhance your experience on Rentify.</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Database size={24} />
              Types of Cookies We Use
            </h2>
            <div className="section-content">
              <div className="cookie-type">
                <h4>Essential Cookies</h4>
                <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
              </div>

              <div className="cookie-type">
                <h4>Performance Cookies</h4>
                <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              </div>

              <div className="cookie-type">
                <h4>Functional Cookies</h4>
                <p>These cookies enable the website to provide enhanced functionality and personalization, such as remembering your login details and preferences.</p>
              </div>

              <div className="cookie-type">
                <h4>Targeting Cookies</h4>
                <p>These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads.</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Eye size={24} />
              How We Use Cookies
            </h2>
            <div className="section-content">
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li>To keep you logged in during your session</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze website traffic and usage patterns</li>
                <li>To improve our website performance and user experience</li>
                <li>To provide personalized content and recommendations</li>
                <li>To prevent fraud and enhance security</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Shield size={24} />
              Third-Party Cookies
            </h2>
            <div className="section-content">
              <p>We may also use third-party cookies from trusted partners:</p>
              <ul>
                <li><strong>Google Analytics:</strong> To understand how users interact with our site</li>
                <li><strong>Payment Processors:</strong> To securely process transactions</li>
                <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
                <li><strong>Customer Support:</strong> To provide chat and support services</li>
              </ul>
              <p>These third parties have their own privacy policies and cookie practices.</p>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Settings size={24} />
              Managing Your Cookie Preferences
            </h2>
            <div className="section-content">
              <p>You have several options for managing cookies:</p>
              <ul>
                <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings</li>
                <li><strong>Opt-Out Tools:</strong> Use industry opt-out tools for advertising cookies</li>
                <li><strong>Cookie Banner:</strong> Use our cookie consent banner when you first visit</li>
                <li><strong>Account Settings:</strong> Manage preferences in your Rentify account settings</li>
              </ul>
              <div className="info-box">
                <p>Note: Disabling certain cookies may affect the functionality of our website.</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <AlertCircle size={24} />
              Cookie Retention
            </h2>
            <div className="section-content">
              <p>Different types of cookies are stored for different periods:</p>
              <ul>
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                <li><strong>Essential Cookies:</strong> Typically expire after your session ends</li>
                <li><strong>Analytics Cookies:</strong> Usually expire after 2 years</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Updates to This Policy</h2>
            <div className="section-content">
              <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.</p>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Contact Us</h2>
            <div className="section-content">
              <p>If you have any questions about our use of cookies, please contact us:</p>
              <ul>
                <li>Email: cookies@rentify.lk</li>
                <li>Phone: +94 77 123 4567</li>
                <li>Address: 123 Main Street, Negombo, Sri Lanka</li>
              </ul>
            </div>
          </div>

          <div className="last-updated">
            <p>Last updated: October 26, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;