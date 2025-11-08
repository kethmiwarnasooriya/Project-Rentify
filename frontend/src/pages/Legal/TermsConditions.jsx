import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, Home, User, Info, Mail, Settings, LogOut, FileText, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const TermsConditions = () => {
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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="terms-container">
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
          --warning-bg: rgba(245, 158, 11, 0.1);
          --warning-border: #f59e0b;
          --warning-text: #92400e;
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
          --warning-bg: rgba(251, 191, 36, 0.15);
          --warning-border: #fbbf24;
          --warning-text: #fbbf24;
        }

        .terms-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          color: var(--text-primary);
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          overflow-x: hidden;
        }

        /* Navigation Bar */
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

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #FBF8F0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #5B8DB8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          font-weight: 600;
        }

        .hamburger {
          cursor: pointer;
          color: #FBF8F0;
          margin-left: 0.5rem;
        }

        /* Sidebar Menu */
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

        /* Overlay */
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

        /* Main Content */
        .main-content {
          padding-top: 8rem;
          padding-bottom: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          color: var(--text-primary);
          border: 1px solid rgba(91, 141, 184, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .back-button:hover {
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateX(-5px);
          border-color: var(--accent-color);
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .content-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          border: 1px solid rgba(91, 141, 184, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
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
          padding-left: 0.5rem;
        }

        .warning-box {
          background: var(--warning-bg);
          border-left: 4px solid var(--warning-border);
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .warning-box p {
          margin-bottom: 0;
          font-weight: 600;
          color: var(--warning-text);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .last-updated {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(91, 141, 184, 0.2);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .main-content {
            padding-top: 6rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .content-card {
            padding: 2rem;
          }

          .header-title {
            font-size: 2rem;
            flex-direction: column;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }

          .section-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      {/* Navigation Bar */}
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
          <div className="user-info">
            <div className="user-avatar">{username ? username.charAt(0).toUpperCase() : '?'}</div>
            <span>{username}</span>
          </div>
          <div className="hamburger" onClick={toggleSidebar}>
            <Menu size={24} />
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div className="overlay" onClick={toggleSidebar}></div>

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="header-title">
            <Shield size={36} />
            Terms & Conditions
          </h1>
          <p className="header-subtitle">Please read these terms carefully before using our services</p>
        </div>

        <div className="content-card">
          <div className="section">
            <h2 className="section-title">
              <CheckCircle size={24} />
              Acceptance of Terms
            </h2>
            <div className="section-content">
              <p>By accessing and using Rentify, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <div className="warning-box">
                <p>
                  <AlertTriangle size={20} />
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <FileText size={24} />
              Use License
            </h2>
            <div className="section-content">
              <p>Permission is granted to temporarily use Rentify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <AlertTriangle size={24} />
              User Responsibilities
            </h2>
            <div className="section-content">
              <p>As a user of Rentify, you agree to:</p>
              <ul>
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the rights and property of other users</li>
                <li>Not engage in fraudulent or misleading activities</li>
                <li>Report any suspicious or inappropriate behavior</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Property Listings</h2>
            <div className="section-content">
              <p>Property owners who list on Rentify agree to:</p>
              <ul>
                <li>Provide accurate property descriptions and photos</li>
                <li>Honor rental agreements made through the platform</li>
                <li>Comply with local housing laws and regulations</li>
                <li>Maintain their properties in safe and habitable condition</li>
                <li>Respond promptly to tenant inquiries</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Prohibited Activities</h2>
            <div className="section-content">
              <p>The following activities are strictly prohibited:</p>
              <ul>
                <li>Posting false or misleading information</li>
                <li>Harassment or discrimination of any kind</li>
                <li>Attempting to circumvent platform fees</li>
                <li>Using the platform for illegal activities</li>
                <li>Spamming or sending unsolicited communications</li>
                <li>Violating intellectual property rights</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Limitation of Liability</h2>
            <div className="section-content">
              <p>Rentify shall not be liable for any damages arising from the use or inability to use our services, including but not limited to:</p>
              <ul>
                <li>Direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from third-party actions</li>
                <li>Technical failures or service interruptions</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Termination</h2>
            <div className="section-content">
              <p>We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason we deem appropriate.</p>
            </div>
          </div>

          <div className="last-updated">
            <p>Last updated: January 1, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;