import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, Home, User, Info, Mail, Settings, LogOut, Shield, Eye, Lock, Database } from 'lucide-react';

const PrivacyPolicy = () => {
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
  const handleThemeChange = (newTheme) => setTheme(newTheme);

  return (
    <div className="privacy-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
        .privacy-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          color: var(--text-primary);
          overflow-x: hidden;
        }
        .navbar {
          position: fixed; top: 0; width: 100%; background: var(--nav-bg);
          backdrop-filter: blur(10px); padding: 1rem 4rem; display: flex;
          justify-content: space-between; align-items: center; z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .logo { font-size: 1.75rem; font-weight: 700; color: #FBF8F0;
          display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .logo-icon { width: 32px; height: 32px; background: #5B8DB8;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          color: #FBF8F0; font-weight: bold; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; }
        .nav-links a { text-decoration: none; color: #FBF8F0; font-weight: 500;
          font-size: 0.95rem; transition: color 0.2s ease; cursor: pointer; opacity: 0.9; }
        .nav-links a:hover { opacity: 1; color: #7BA5CC; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .hamburger { cursor: pointer; color: #FBF8F0; margin-left: 0.5rem; }
        .sidebar {
          position: fixed; top: 0; right: ${sidebarOpen ? '0' : '-350px'}; width: 350px; height: 100vh;
          background: #FBF8F0; backdrop-filter: blur(10px); padding: 2rem;
          z-index: 2000; transition: right 0.3s ease; box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          overflow-y: auto; display: flex; flex-direction: column;
        }
        body.dark-theme .sidebar { background: #2a3844; }
        .sidebar-header { display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid var(--accent-color); }
        .user-greeting { font-size: 1.2rem; color: var(--accent-color); font-weight: 600; }
        .close-btn { cursor: pointer; color: var(--text-primary); background: none; border: none; }
        .sidebar-links { list-style: none; margin-bottom: 2rem; flex: 1; }
        .sidebar-links li { margin-bottom: 1.5rem; }
        .sidebar-links a { text-decoration: none; color: var(--text-primary); font-size: 1.1rem;
          font-weight: 500; transition: color 0.3s ease; display: flex; align-items: center;
          gap: 0.8rem; cursor: pointer; }
        .sidebar-links a:hover { color: var(--accent-color); }
        .theme-switcher { margin-top: auto; padding-top: 2rem;
          border-top: 1px solid rgba(107, 124, 140, 0.3); }
        .theme-label { font-weight: 600; margin-bottom: 1rem; display: block; color: var(--text-primary); }
        .theme-buttons { display: flex; gap: 1rem; }
        .theme-btn { flex: 1; padding: 0.8rem; border: 2px solid var(--accent-color);
          background: transparent; color: var(--text-primary); cursor: pointer; border-radius: 8px;
          font-weight: 600; transition: all 0.3s ease; }
        .theme-btn.active { background: var(--accent-color); color: #FBF8F0; }
        .theme-btn:hover { transform: translateY(-2px); }
        .logout-section { margin-top: 1.5rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(107, 124, 140, 0.3); }
        .logout-btn { width: 100%; padding: 1rem; border: 2px solid var(--danger-color);
          background: var(--danger-color); color: #FBF8F0; cursor: pointer; border-radius: 8px;
          font-weight: 600; font-size: 1.05rem; transition: all 0.3s ease; display: flex;
          align-items: center; justify-content: center; gap: 0.8rem; }
        .logout-btn:hover { background: var(--danger-hover); border-color: var(--danger-hover);
          transform: translateY(-2px); box-shadow: 0 4px 12px rgba(200, 90, 84, 0.3); }
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);
          z-index: 1500; opacity: ${sidebarOpen ? '1' : '0'}; visibility: ${sidebarOpen ? 'visible' : 'hidden'};
          transition: opacity 0.3s ease, visibility 0.3s ease; }
        .privacy-header { margin-top: 5rem; padding: 3rem 4rem 2rem; position: relative; overflow: hidden; }
        .back-button { display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--accent-color); color: #FBF8F0; border: none;
          padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;
          transition: all 0.3s ease; margin-bottom: 2rem; font-size: 0.95rem; }
        .back-button:hover { background: var(--accent-hover); transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3); }
        .header-title { font-size: 3rem; font-weight: 700; margin-bottom: 0.75rem;
          color: var(--text-primary); line-height: 1.1; }
        .header-subtitle { font-size: 1.25rem; color: var(--text-secondary); line-height: 1.6; }
        .main-content { max-width: 1200px; margin: 0 auto; padding: 0 4rem 4rem; }
        .content-card { background: var(--card-bg); backdrop-filter: blur(10px);
          border-radius: 12px; padding: 3rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
        .section { margin-bottom: 2.5rem; }
        .section:last-child { margin-bottom: 0; }
        .section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.25rem;
          color: var(--text-primary); display: flex; align-items: center; gap: 0.75rem; }
        .section-title svg { color: var(--accent-color); }
        .section-content { color: var(--text-secondary); line-height: 1.8; font-size: 1rem; }
        .section-content p { margin-bottom: 1rem; }
        .section-content ul { margin-left: 1.5rem; margin-bottom: 1rem; }
        .section-content li { margin-bottom: 0.75rem; }
        .highlight-box { background: rgba(91, 141, 184, 0.1); border-left: 4px solid var(--accent-color);
          padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; }
        .highlight-box p { margin-bottom: 0; font-weight: 500; color: var(--text-primary); }
        .last-updated { text-align: center; margin-top: 3rem; padding-top: 2rem;
          border-top: 1px solid rgba(107, 124, 140, 0.2); color: var(--text-secondary); font-size: 0.9rem; }
        @media (max-width: 1024px) {
          .navbar { padding: 1rem 2rem; }
          .privacy-header { padding: 3rem 2rem 2rem; }
          .main-content { padding: 0 2rem 3rem; }
        }
        @media (max-width: 768px) {
          .navbar { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .privacy-header { padding: 2.5rem 1.5rem 1.5rem; }
          .header-title { font-size: 2rem; }
          .header-subtitle { font-size: 1rem; }
          .main-content { padding: 0 1.5rem 2rem; }
          .content-card { padding: 2rem 1.5rem; }
          .section-title { font-size: 1.5rem; }
          .sidebar { width: 280px; right: ${sidebarOpen ? '0' : '-280px'}; }
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
            <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>
              Light
            </button>
            <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>
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

      <div className="privacy-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <h1 className="header-title">Privacy Policy</h1>
        <p className="header-subtitle">How we collect, use, and protect your personal information</p>
      </div>

      <div className="main-content">
        <div className="content-card">
          <div className="section">
            <h2 className="section-title">
              <Shield size={24} />
              Information We Collect
            </h2>
            <div className="section-content">
              <p>We collect information you provide directly to us, such as when you create an account, list a property, or contact us for support.</p>
              <ul>
                <li>Personal information (name, email address, phone number)</li>
                <li>Property information and photos</li>
                <li>Payment and billing information</li>
                <li>Communications with other users</li>
                <li>Usage data and analytics</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Eye size={24} />
              How We Use Your Information
            </h2>
            <div className="section-content">
              <p>We use the information we collect to provide, maintain, and improve our services:</p>
              <ul>
                <li>To create and manage your account</li>
                <li>To facilitate property listings and rentals</li>
                <li>To process payments and transactions</li>
                <li>To communicate with you about our services</li>
                <li>To improve our platform and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Lock size={24} />
              Information Sharing
            </h2>
            <div className="section-content">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
              <ul>
                <li>With property owners and tenants to facilitate rentals</li>
                <li>With service providers who assist in our operations</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
              <div className="highlight-box">
                <p>We will never sell your personal information to advertisers or other third parties for marketing purposes.</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Database size={24} />
              Data Security
            </h2>
            <div className="section-content">
              <p>We implement appropriate security measures to protect your personal information:</p>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Your Rights</h2>
            <div className="section-content">
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li>Access and review your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability and export</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Contact Us</h2>
            <div className="section-content">
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <ul>
                <li>Email: privacy@rentify.lk</li>
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

export default PrivacyPolicy;