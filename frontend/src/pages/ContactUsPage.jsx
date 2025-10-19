import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Info, Mail, Settings, LogOut, MapPin, Phone, Clock, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactUsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState(() => {
    return sessionStorage.getItem('username') || 'Guest';
  });
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectAfterLogin');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-page-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --bg-gradient-start: #2563eb;
          --bg-gradient-end: #3b82f6;
          --text-primary: #1e293b;
          --text-secondary: #ffffff;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --nav-bg: rgba(255, 255, 255, 0.98);
          --card-bg: rgba(255, 255, 255, 0.95);
          --danger-color: #ef4444;
          --danger-hover: #dc2626;
          --success-color: #10b981;
          --success-hover: #059669;
          --input-bg: #f8fafc;
          --input-border: #e2e8f0;
        }

        body.dark-theme {
          --bg-gradient-start: #1e3a8a;
          --bg-gradient-end: #1e40af;
          --text-primary: #ffffff;
          --text-secondary: #ffffff;
          --accent-color: #60a5fa;
          --accent-hover: #3b82f6;
          --nav-bg: rgba(30, 41, 59, 0.98);
          --card-bg: rgba(30, 41, 59, 0.95);
          --danger-color: #f87171;
          --danger-hover: #ef4444;
          --success-color: #34d399;
          --success-hover: #10b981;
          --input-bg: #1e293b;
          --input-border: #334155;
        }

        .contact-page-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          color: var(--text-primary);
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-color);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--accent-color);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
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
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .nav-links a:hover {
          color: var(--accent-color);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .login-btn {
          background: var(--accent-color);
          color: white;
          padding: 0.65rem 1.75rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          background: var(--accent-hover);
        }

        .hamburger {
          cursor: pointer;
          color: var(--text-primary);
          margin-left: 0.5rem;
        }

        /* Sidebar Menu */
        .sidebar {
          position: fixed;
          top: 0;
          right: ${sidebarOpen ? '0' : '-350px'};
          width: 350px;
          height: 100vh;
          background: var(--nav-bg);
          backdrop-filter: blur(10px);
          padding: 2rem;
          z-index: 2000;
          transition: right 0.3s ease;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
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
          border-top: 1px solid rgba(128, 128, 128, 0.3);
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
          color: white;
        }

        .theme-btn:hover {
          transform: translateY(-2px);
        }

        .logout-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(128, 128, 128, 0.3);
        }

        .logout-btn {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--danger-color);
          background: var(--danger-color);
          color: white;
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
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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
        .contact-content {
          padding: 8rem 4rem 4rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header {
          text-align: center;
          margin-bottom: 4rem;
          color: var(--text-secondary);
        }

        .page-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .page-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        /* Contact Info Cards */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .info-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-card p {
          color: var(--text-primary);
          opacity: 0.8;
          line-height: 1.6;
        }

        /* Contact Form */
        .contact-form-container {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--input-border);
          border-radius: 8px;
          font-size: 1rem;
          background: var(--input-bg);
          color: var(--text-primary);
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }

        .form-error {
          color: var(--danger-color);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message {
          background: var(--success-color);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          animation: slideDown 0.3s ease-out;
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

        /* Map Section */
        .map-section {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .map-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .map-placeholder {
          width: 100%;
          height: 400px;
          background: var(--input-bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          font-size: 1.1rem;
          border: 2px solid var(--input-border);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-content {
            padding: 7rem 2rem 3rem 2rem;
          }

          .page-header h1 {
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

          .contact-content {
            padding: 6rem 1.5rem 2rem 1.5rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .page-header p {
            font-size: 1rem;
          }

          .contact-form-container,
          .map-section {
            padding: 2rem;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
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

      {/* Main Content */}
      <div className="contact-content">
        <div className="page-header">
          <h1>Get In Touch</h1>
          <p>Have a question or need assistance? We're here to help. Reach out to us and we'll get back to you as soon as possible.</p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <h3>Our Office</h3>
              </div>
              <p>123 Rental Street, Property District<br />Colombo, Sri Lanka 10250</p>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <h3>Phone</h3>
              </div>
              <p>Main: +94 11 234 5678<br />Support: +94 77 123 4567</p>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <h3>Email</h3>
              </div>
              <p>General: info@rentify.com<br />Support: support@rentify.com</p>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <Clock size={24} />
                </div>
                <h3>Business Hours</h3>
              </div>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h2 className="form-title">Send Us a Message</h2>
            
            {submitSuccess && (
              <div className="success-message">
                <Send size={20} />
                Thank you for contacting us! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {formErrors.name && <p className="form-error">{formErrors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && <p className="form-error">{formErrors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
                {formErrors.subject && <p className="form-error">{formErrors.subject}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleInputChange}
                />
                {formErrors.message && <p className="form-error">{formErrors.message}</p>}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;