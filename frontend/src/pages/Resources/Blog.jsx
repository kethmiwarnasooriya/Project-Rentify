import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X, Home, User, Info, Mail, Settings, LogOut, Calendar, Clock, Tag } from 'lucide-react';
import LogoutModal from '../../components/LogoutModal';

const Blog = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState(sessionStorage.getItem('username') || 'Guest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    console.log('Blog logout initiated');
    
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

  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for First-Time Renters",
      excerpt: "Essential advice for those looking to rent their first property. From understanding lease agreements to finding the perfect neighborhood, we cover everything you need to know.",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Tips",
      image: "🏠",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "How to Maximize Your Property's Rental Value",
      excerpt: "Strategies for property owners to increase rental income and attract quality tenants. Learn about market research, property improvements, and effective marketing techniques.",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Property Management",
      image: "💰",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "Understanding Rental Agreements",
      excerpt: "A comprehensive guide to rental contracts and legal terms. Protect yourself by knowing your rights and responsibilities as either a tenant or landlord.",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Legal",
      image: "📋",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      title: "Maintenance Tips for Property Owners",
      excerpt: "Keep your property in top condition with these maintenance best practices. Regular upkeep saves money and keeps tenants happy.",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Property Management",
      image: "🔧",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      id: 5,
      title: "Creating a Rental Budget That Works",
      excerpt: "Financial planning tips for renters. Learn how to budget effectively, save for deposits, and manage monthly expenses without stress.",
      date: "2023-12-28",
      readTime: "5 min read",
      category: "Tips",
      image: "💵",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      id: 6,
      title: "Tenant Screening Best Practices",
      excerpt: "Protect your property investment by choosing reliable tenants. Discover effective screening methods and red flags to watch for.",
      date: "2023-12-20",
      readTime: "8 min read",
      category: "Legal",
      image: "✓",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
    }
  ];

  const categories = ['All', 'Tips', 'Property Management', 'Legal'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="blog-container">
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

        .blog-container {
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

        /* Blog Header Section */
        .blog-header {
          background: linear-gradient(135deg, rgba(91, 141, 184, 0.1) 0%, rgba(123, 165, 204, 0.05) 100%);
          padding: 8rem 4rem 3rem 4rem;
          position: relative;
          overflow: hidden;
        }

        body.dark-theme .blog-header {
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 4rem 4rem 4rem;
        }

        /* Category Filter */
        .category-filter {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-primary);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .category-btn:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: #FBF8F0;
        }

        /* Blog Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .blog-card {
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-color);
        }

        .blog-image {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          position: relative;
          overflow: hidden;
        }

        .blog-content {
          padding: 1.5rem;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }

        .blog-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .blog-category {
          background: var(--accent-color);
          color: #FBF8F0;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .blog-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .blog-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }

          .blog-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .blog-header {
            padding: 6rem 1.5rem 2rem 1.5rem;
          }

          .main-content {
            padding: 1.5rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }

          .category-filter {
            justify-content: center;
          }

          .blog-image {
            height: 180px;
            font-size: 3rem;
          }

          .blog-title {
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
      <div className="blog-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <h1 className="header-title">Rentify Blog</h1>
          <p className="header-subtitle">Tips, guides, and insights for renters and property owners</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="blog-card" 
                onClick={() => alert('Full blog post coming soon!')}
              >
                <div className="blog-image" style={{ background: post.gradient }}>
                  {post.image}
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-category">{post.category}</span>
                    <span><Calendar size={14} /> {post.date}</span>
                    <span><Clock size={14} /> {post.readTime}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>Try selecting a different category</p>
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

export default Blog;