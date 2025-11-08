import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, FileCheck, Home, CheckCircle, Target, Heart, Menu, X, User, Info, Mail, Settings, LogOut } from 'lucide-react';
import aboutUsImage from '../assets/aboutus.png';

const AboutUsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState(sessionStorage.getItem('username') || 'Guest');
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    sessionStorage.setItem('theme', newTheme);
  };

  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Trust & Verification',
      description: 'Every user goes through a verification process for secure interactions'
    },
    {
      icon: <Users size={32} />,
      title: 'Easy Connection',
      description: 'Connect property owners with tenants seamlessly and efficiently'
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Document Management',
      description: 'Manage all rental documents and paperwork in one organized place'
    },
    {
      icon: <Home size={32} />,
      title: 'Verified Listings',
      description: 'Browse through authentic and verified property listings only'
    }
  ];

  const values = [
    {
      icon: <Target size={28} />,
      title: 'Transparency',
      description: 'We believe in clear, honest communication between owners and tenants'
    },
    {
      icon: <Shield size={28} />,
      title: 'Security',
      description: 'Your data and transactions are protected with industry-standard security'
    },
    {
      icon: <Heart size={28} />,
      title: 'Trust',
      description: 'Building lasting relationships through verified and reliable connections'
    }
  ];

  return (
    <div className="about-container">
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
          --border-color: rgba(107, 124, 140, 0.2);
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
          --border-color: rgba(196, 205, 213, 0.2);
        }

        .about-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          color: var(--text-primary);
          overflow-x: hidden;
          position: relative;
        }

        /* Animated background circles */
        .circle {
          position: fixed;
          border-radius: 50%;
          background: rgba(91, 141, 184, 0.25);
          animation: float 20s infinite ease-in-out;
          box-shadow: 0 0 60px rgba(91, 141, 184, 0.3);
          filter: blur(1px);
          pointer-events: none;
          z-index: 0;
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
          top: 50%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 180px;
          height: 180px;
          bottom: 15%;
          left: 5%;
          animation-delay: 4s;
        }

        .circle-4 {
          width: 90px;
          height: 90px;
          bottom: 10%;
          right: 25%;
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

        /* Header Section */
        .about-header {
          padding: 8rem 4rem 4rem;
          position: relative;
          z-index: 1;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .back-button {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          color: var(--text-primary);
          border: 2px solid var(--accent-color);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .back-button:hover {
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateX(-5px);
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.2);
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
          animation: fadeInUp 0.6s ease;
          line-height: 1.1;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          animation: fadeInUp 0.6s ease 0.2s backwards;
          line-height: 1.6;
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

        /* Main Content */
        .about-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 4rem 4rem;
          position: relative;
          z-index: 1;
        }

        /* Hero Section with Image  */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        .hero-text {
          animation: fadeInLeft 0.8s ease;
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-text h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .hero-text h2 span {
          color: var(--accent-color);
        }

        .hero-text p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .hero-image {
          position: relative;
          animation: fadeInRight 0.8s ease;
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .main-image {
          width: 120%;
          height: 500px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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

        /* Features Section */
        .features-section {
          margin-bottom: 5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
          animation: fadeInUp 0.6s ease;
          animation-fill-mode: backwards;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(91, 141, 184, 0.2);
          border-color: var(--accent-color);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          background: var(--accent-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.3);
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 25px rgba(91, 141, 184, 0.4);
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .feature-card p {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        /* Mission Section */
        .mission-section {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          padding: 4rem 3rem;
          border-radius: 12px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
          margin-bottom: 5rem;
          position: relative;
          border: 1px solid var(--border-color);
        }

        .mission-content {
          position: relative;
          z-index: 1;
        }

        .mission-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mission-content h2 .icon {
          width: 50px;
          height: 50px;
          background: var(--accent-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.3);
        }

        .mission-content p {
          font-size: 1.15rem;
          line-height: 1.9;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        /* Values Section */
        .values-section {
          margin-bottom: 4rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: var(--accent-color);
          padding: 2.5rem;
          border-radius: 12px;
          color: #FBF8F0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(91, 141, 184, 0.3);
        }

        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(30%, -30%);
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(91, 141, 184, 0.4);
        }

        .value-content {
          position: relative;
          z-index: 1;
        }

        .value-icon {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .value-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .value-card p {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.95;
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .cta-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .cta-section p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: var(--text-secondary);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          background: var(--accent-color);
          color: #FBF8F0;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(91, 141, 184, 0.4);
          background: var(--accent-hover);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-image {
            order: -1;
          }

          .hero-text h2 {
            font-size: 2rem;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .navbar {
            padding: 1rem 2rem;
          }

          .about-header {
            padding: 7rem 2rem 3rem;
          }

          .about-content {
            padding: 2rem 2rem 3rem;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .about-header {
            padding: 6rem 1.5rem 3rem;
          }

          .about-content {
            padding: 2rem 1.5rem 3rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .mission-section {
            padding: 3rem 2rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .hero-text h2 {
            font-size: 1.75rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .cta-section h2 {
            font-size: 2rem;
          }

          .feature-card {
            padding: 2rem;
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

      {/* Animated background circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>

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
          {!isLoggedIn && (
            <button className="login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
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

      {/* Header */}
      <div className="about-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">
            Connecting property owners with tenants seamlessly and securely
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        {/* Hero Section with Image */}
        <div className="hero-section">
          <div className="hero-text">
            <h2>Welcome to <span>Rentify</span></h2>
            <p>
              Your trusted platform for connecting rental property owners with tenants 
              seamlessly and securely. Our mission is to simplify the rental process 
              while building trust between both parties.
            </p>
            <p>
              At Rentify, we understand that finding a rental property or a reliable 
              tenant can be time-consuming and complicated. That's why we've created 
              an all-in-one application that allows property owners to list their spaces, 
              manage documents, and communicate with tenants easily.
            </p>
          </div>

          <div className="hero-image">
            <div className="image-wrapper">
              <img 
                src={aboutUsImage}
                alt="About Us" 
                className="main-image"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>What We Offer</h2>
            <p>Everything you need for a smooth rental experience</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="mission-content">
            <h2>
              <span className="icon">
                <Target size={28} />
              </span>
              Our Mission
            </h2>
            <p>
              Likewise, tenants can explore verified listings, contact owners directly, 
              and complete necessary paperwork in a safe and organized way. Our platform 
              emphasizes trust and verification.
            </p>
            <p>
              Every rental owner and tenant on Rentify goes through a verification process, 
              ensuring that both sides can interact with confidence. Whether you're looking 
              for a cozy apartment, a shared room, or a commercial space, Rentify makes the 
              rental experience transparent, efficient, and secure.
            </p>
            <p>
              We're committed to making renting simpler, smarter, and safer — one verified 
              connection at a time.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-content">
                  <div className="value-icon">
                    {value.icon}
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Only show if user is not logged in */}
        {!isLoggedIn && (
          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied users on Rentify today</p>
            <button className="cta-button" onClick={() => navigate('/signup')}>
              <CheckCircle size={20} />
              Create Your Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUsPage;