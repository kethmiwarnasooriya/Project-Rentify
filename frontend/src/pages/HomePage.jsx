import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Info, Mail, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/homePageBackground.jpg';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState('Guest');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleOwnerClick = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    console.log('Owner button clicked, isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn) {
      sessionStorage.setItem('userRole', 'owner');
      console.log('Navigating to owner dashboard');
      navigate('/owner/dashboard');
    } else {
      sessionStorage.setItem('intendedRole', 'owner');
      sessionStorage.setItem('redirectAfterLogin', '/owner/dashboard');
      console.log('Redirecting to login, will return to:', '/owner/dashboard');
      alert('Please log in first!');
      navigate('/login');
    }
  };

  const handleTenantClick = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      sessionStorage.setItem('userRole', 'tenant');
      navigate('/tenant/dashboard');
    } else {
      sessionStorage.setItem('intendedRole', 'tenant');
      sessionStorage.setItem('redirectAfterLogin', '/tenant/dashboard');
      alert('Please log in first!');
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('redirectAfterLogin');
    navigate('/login');
  };

  return (
    <div className="homepage-container">
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

        .homepage-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          color: var(--text-primary);
          min-height: 100vh;
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

        .login-btn {
          background: #5B8DB8;
          color: #FBF8F0;
          padding: 0.65rem 1.75rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          background: #4A7BA4;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
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

        /* Logout Button */
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

        .logout-btn:active {
          transform: translateY(0);
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

        /* Hero Section */
        .hero {
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          display: flex;
          align-items: center;
          padding: 6rem 4rem 4rem 4rem;
          position: relative;
          overflow: hidden;
        }

        /* Animated background circles - MORE VISIBLE */
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(91, 141, 184, 0.25);
          animation: float 20s infinite ease-in-out;
          box-shadow: 0 0 60px rgba(91, 141, 184, 0.3);
          filter: blur(1px);
        }

        body.dark-theme .circle {
          background: rgba(123, 165, 204, 0.3);
          box-shadow: 0 0 60px rgba(123, 165, 204, 0.25);
        }

        .circle-1 {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 110px;
          height: 110px;
          top: 38%;
          right: 65%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 180px;
          height: 180px;
          bottom: 15%;
          left: 2%;
          animation-delay: 4s;
        }

        .circle-4 {
          width: 90px;
          height: 90px;
          bottom: 5%;
          right: 22%;
          animation-delay: 6s;
        }

        .circle-5 {
          width: 100px;
          height: 100px;
          top: 80%;
          left: 35%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px) translateX(30px) scale(1.1);
            opacity: 0.7;
          }
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          color: var(--text-primary);
          animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.1;
          color: var(--text-primary);
        }

        .hero-content p {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-btn-primary {
          background: #5B8DB8;
          color: #FBF8F0;
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.2);
        }

        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(91, 141, 184, 0.3);
          background: #4A7BA4;
        }

        .hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideInRight 0.8s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-image-container {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        
        .main-image {
          width: 120%;
          height: 120%;
          object-fit: cover;
          mask-image: linear-gradient(to right, 
                transparent 0%, 
                rgba(0,0,0,0.1) 3%, 
                rgba(0,0,0,0.3) 6%, 
                rgba(0,0,0,0.5) 10%, 
                rgba(0,0,0,0.8) 15%, 
                black 25%, 
                black 75%, 
                rgba(0,0,0,0.8) 85%, 
                rgba(0,0,0,0.5) 90%, 
                rgba(0,0,0,0.3) 94%, 
                rgba(0,0,0,0.1) 97%, 
                transparent 100%),
                linear-gradient(to bottom, 
                transparent 0%, 
                rgba(0,0,0,0.3) 3%, 
                rgba(0,0,0,0.6) 7%, 
                black 12%, 
                black 88%, 
                rgba(0,0,0,0.6) 93%, 
                rgba(0,0,0,0.3) 97%, 
                transparent 100%);
                -webkit-mask-image: linear-gradient(to right, 
                transparent 0%, 
                rgba(0,0,0,0.0) 3%, 
                rgba(0,0,0,0.2) 6%, 
                rgba(0,0,0,0.50) 10%, 
                rgba(0,0,0,0.8) 15%, 
                black 25%, 
                black 75%, 
                rgba(0,0,0,0.8) 85%, 
                rgba(0,0,0,0.5) 90%, 
                rgba(0,0,0,0.3) 94%, 
                rgba(0,0,0,0.1) 97%, 
                transparent 100%),
              linear-gradient(to bottom, 
                transparent 0%, 
                rgba(0,0,0,0.3) 3%, 
                rgba(0,0,0,0.6) 7%, 
                black 50%, 
                black 88%, 
                rgba(0,0,0,0.6) 93%, 
                rgba(0,0,0,0.3) 97%, 
                transparent 100%);
                mask-composite: intersect;
                -webkit-mask-composite: source-in;
        }

        .floating-card {
          position: absolute;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          animation: floatCard 3s ease-in-out infinite;
        }

        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .card-1 {
          top: 5%;
          left: -15%;
          animation-delay: 0s;
        }

        .card-2 {
          bottom: -5%;
          right: -25%;
          animation-delay: 1s;
        }

        .card-3 {
          top: 60%;
          left: -30%;
          animation-delay: 2s;
        }

        .chart-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(
            #5B8DB8 0deg 90deg,
            #7BA5CC 90deg 180deg,
            #8FB3D5 180deg 270deg,
            #4A7BA4 270deg 360deg
          );
          position: relative;
        }

        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: #FBF8F0;
          border-radius: 50%;
        }

        body.dark-theme .chart-center {
          background: #2a3844;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: #5B8DB8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          font-size: 1.5rem;
        }

        .stat-info h3 {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
        }

        .profile-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #5B8DB8;
        }

        .profile-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .profile-info p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-visual {
            order: -1;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .hero {
            padding: 5rem 1.5rem 3rem 1.5rem;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .floating-card {
            display: none;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-btn {
            width: 100%;
            justify-content: center;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }

          .circle {
            opacity: 0.3;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="navbar">
        <a href="/" className="logo">
          <div className="logo-icon">R</div>
          Rentify
        </a>
        
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>

        <div className="nav-right">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
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
          <li><a href="/"><Home size={20} /> Home</a></li>
          <li><a href="/profile"><User size={20} /> Profile</a></li>
          <li><a href="/about"><Info size={20} /> About Us</a></li>
          <li><a href="/contact"><Mail size={20} /> Contact</a></li>
          <li><a href="/settings"><Settings size={20} /> Settings</a></li>
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

      {/* Hero Section */}
      <section className="hero">
        {/* Animated background circles - MORE VISIBLE */}
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>

        <div className="hero-container">
          <div className="hero-content">
            <h1>Find Your Perfect Rental Home</h1>
            <p>Connect with verified property owners and discover your ideal living space. Whether you're looking to rent or list a property, Rentify makes it simple and secure.</p>
            <div className="cta-buttons">
              <button className="cta-btn cta-btn-primary" onClick={handleOwnerClick}>
                Start as Owner
              </button>
              <button className="cta-btn cta-btn-primary" onClick={handleTenantClick}>
                Start as Tenant
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-container">
              <img 
                src={backgroundImage}
                alt="Background image of the home page" 
                className="main-image"
              />
              
              <div className="floating-card card-1">
                <div className="chart-circle">
                  <div className="chart-center"></div>
                </div>
              </div>

              <div className="floating-card card-2">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Properties Listed</h3>
                    <p>2.5k+</p>
                  </div>
                </div>
              </div>

              <div className="floating-card card-3">
                <div className="profile-card">
                  <div className="profile-avatar"></div>
                  <div className="profile-info">
                    <h4>Naveen Darshana</h4>
                    <p>Property Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;