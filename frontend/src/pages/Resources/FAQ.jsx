import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, Home, User, Info, Mail, Settings, LogOut, ChevronDown, ChevronUp, Search } from 'lucide-react';
import LogoutModal from '../../components/LogoutModal';

const FAQ = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState(sessionStorage.getItem('username') || 'Guest');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    console.log('FAQ logout initiated');
    
    // Clear only user session data (preserve admin session)
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectAfterLogin');
    localStorage.clear();
    
    // Force immediate redirect
    window.location.replace('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on Rentify?",
          answer: "To create an account, click the 'Sign Up' button on the homepage, fill in your details including name, email, and password, then verify your email address. You can choose to register as either a tenant or property owner."
        },
        {
          question: "Is Rentify free to use?",
          answer: "Yes, Rentify is free for tenants to search and apply for properties. Property owners can list their first property for free, with premium features available for additional listings and enhanced visibility."
        },
        {
          question: "How do I verify my account?",
          answer: "Account verification involves uploading a government-issued ID and proof of address. This helps ensure the safety and trustworthiness of our platform for all users."
        }
      ]
    },
    {
      category: "For Tenants",
      questions: [
        {
          question: "How do I search for properties?",
          answer: "Use our search filters to specify location, price range, number of bedrooms, and other preferences. You can also use the map view to see properties in specific areas and save your favorite listings."
        },
        {
          question: "How do I contact a property owner?",
          answer: "Once you find a property you're interested in, click 'Contact Owner' on the listing page. You can send a message through our secure messaging system or request a viewing."
        },
        {
          question: "What documents do I need to apply for a property?",
          answer: "Typically, you'll need proof of income, employment verification, references, and a valid ID. Some owners may require additional documents like bank statements or previous rental history."
        },
        {
          question: "Can I schedule property viewings through Rentify?",
          answer: "Yes, you can request viewings directly through the platform. Property owners will respond with available times, and you can confirm your preferred slot."
        }
      ]
    },
    {
      category: "For Property Owners",
      questions: [
        {
          question: "How do I list my property?",
          answer: "Click 'Add Property' in your dashboard, fill in the property details, upload high-quality photos, set your rental price, and publish your listing. Make sure to include accurate descriptions and amenities."
        },
        {
          question: "How do I manage rental applications?",
          answer: "All applications appear in your dashboard where you can review tenant profiles, documents, and communicate with applicants. You can accept, decline, or request additional information."
        },
        {
          question: "What fees does Rentify charge property owners?",
          answer: "The first property listing is free. Additional listings and premium features like featured placement and advanced analytics are available through our subscription plans."
        },
        {
          question: "How do I screen potential tenants?",
          answer: "Rentify provides tenant verification badges, and you can request additional documents. We recommend checking references and conducting interviews before making a decision."
        }
      ]
    },
    {
      category: "Safety & Security",
      questions: [
        {
          question: "How does Rentify ensure user safety?",
          answer: "We verify all users, use secure messaging systems, provide safety guidelines, and have a reporting system for suspicious activity. Never share personal financial information outside the platform."
        },
        {
          question: "What should I do if I encounter a scam?",
          answer: "Report any suspicious activity immediately using our report feature. Never send money before viewing a property or meeting the owner in person. Rentify will investigate all reports promptly."
        },
        {
          question: "How is my personal data protected?",
          answer: "We use industry-standard encryption and security measures to protect your data. Your information is never shared with third parties without your consent. Read our Privacy Policy for full details."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm having trouble logging in. What should I do?",
          answer: "Try resetting your password using the 'Forgot Password' link. If you're still having issues, clear your browser cache or try a different browser. Contact support if problems persist."
        },
        {
          question: "Why can't I upload photos to my listing?",
          answer: "Ensure your photos are in JPG, PNG, or WebP format and under 5MB each. Check your internet connection and try refreshing the page. Contact support if the issue continues."
        },
        {
          question: "How do I delete my account?",
          answer: "Go to Settings > Account > Delete Account. Note that this action is permanent and will remove all your data, listings, and messages from the platform."
        }
      ]
    }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-container">
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
          --border-color: rgba(107, 124, 140, 0.2);
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
          --border-color: rgba(196, 205, 213, 0.2);
          --danger-color: #E67A72;
          --danger-hover: #D66A62;
        }

        .faq-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          color: var(--text-primary);
          overflow-x: hidden;
        }

        /* Navigation Bar - Matching HomePage */
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

        /* Sidebar - Matching HomePage */
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

        /* FAQ Header Section */
        .faq-header {
          background: linear-gradient(135deg, rgba(91, 141, 184, 0.1) 0%, rgba(123, 165, 204, 0.05) 100%);
          padding: 8rem 4rem 3rem 4rem;
          position: relative;
          overflow: hidden;
        }

        body.dark-theme .faq-header {
          background: linear-gradient(135deg, rgba(123, 165, 204, 0.15) 0%, rgba(91, 141, 184, 0.08) 100%);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
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
        }

        .back-button:hover {
          background: var(--accent-hover);
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        /* Main Content */
        .main-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 4rem 4rem 4rem;
        }

        .search-section {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(10px);
        }

        .search-wrapper {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--card-bg);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
        }

        body.dark-theme .search-input:focus {
          box-shadow: 0 0 0 3px rgba(123, 165, 204, 0.15);
        }

        /* FAQ Categories */
        .faq-category {
          margin-bottom: 2rem;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
          padding: 1rem 1.5rem;
          background: var(--card-bg);
          border-radius: 12px;
          border-left: 4px solid var(--accent-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .faq-item {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-bottom: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .faq-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .faq-question {
          padding: 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: rgba(91, 141, 184, 0.05);
        }

        body.dark-theme .faq-question:hover {
          background: rgba(123, 165, 204, 0.1);
        }

        .faq-question h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          margin-right: 1rem;
        }

        .faq-icon {
          color: var(--accent-color);
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          color: var(--text-secondary);
          line-height: 1.7;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .faq-header {
            padding: 6rem 1.5rem 2rem 1.5rem;
          }

          .main-content {
            padding: 1.5rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .faq-question {
            padding: 1rem;
          }

          .faq-answer {
            padding: 0 1rem 1rem;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }

          .search-section {
            padding: 1.5rem;
          }

          .category-title {
            font-size: 1.25rem;
            padding: 0.875rem 1rem;
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
      <div className="faq-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <h1 className="header-title">Frequently Asked Questions</h1>
          <p className="header-subtitle">Find quick answers to common questions about Rentify</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Content */}
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              {category.questions.map((faq, faqIndex) => {
                const globalIndex = `${categoryIndex}-${faqIndex}`;
                return (
                  <div key={faqIndex} className="faq-item">
                    <div 
                      className="faq-question" 
                      onClick={() => toggleFAQ(globalIndex)}
                    >
                      <h3>{faq.question}</h3>
                      <div className="faq-icon">
                        {openFAQ === globalIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    {openFAQ === globalIndex && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No FAQs found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </div>
  );
};

export default FAQ;