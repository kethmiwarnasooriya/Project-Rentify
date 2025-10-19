import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Check both localStorage and sessionStorage, and body class
  const getTheme = () => {
    if (document.body.classList.contains('dark-theme')) return 'dark';
    return localStorage.getItem('theme') || sessionStorage.getItem('theme') || 'light';
  };
  
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    // Update theme when it changes
    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    // Listen for storage changes
    window.addEventListener('storage', handleThemeChange);
    
    // Check theme periodically (for same-tab changes)
    const interval = setInterval(handleThemeChange, 100);
    
    // Use MutationObserver to watch for body class changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: ${theme === 'dark' ? '#1e293b' : '#f8fafc'};
          border-top: 1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'};
          color: ${theme === 'dark' ? '#ffffff' : '#1e293b'};
          margin-top: auto;
          width: 100%;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem 1rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          font-weight: 700;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
        }

        .footer-logo-icon {
          width: 40px;
          height: 40px;
          background: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .footer-description {
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-links button {
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          display: inline-block;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }

        .footer-links button:hover {
          color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          transform: translateX(5px);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          font-size: 0.95rem;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          flex-shrink: 0;
          margin-top: 2px;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${theme === 'dark' ? '#0f172a' : '#ffffff'};
          border: 1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .social-link:hover {
          background: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          color: white;
          border-color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
          transform: translateY(-3px);
        }

        .footer-bottom {
          border-top: 1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'};
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-heart {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .footer-legal {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-legal button {
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
        }

        .footer-legal button:hover {
          color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
        }

        @media (max-width: 768px) {
          .footer-content {
            padding: 2rem 1rem 1rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            padding: 1rem;
          }

          .footer-legal {
            justify-content: center;
          }
        }
      `}</style>

      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Building2 size={24} />
              </div>
              Rentify
            </div>
            <p className="footer-description">
              Your trusted platform for finding the perfect rental property. 
              Connecting property owners with tenants seamlessly since 2025.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <button onClick={() => handleNavigation('/')}>Home</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/about')}>About Us</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/contact')}>Contact</button>
              </li>
            
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li>
                <button onClick={() => alert('Help Center coming soon!')}>Help Center</button>
              </li>
              <li>
                <button onClick={() => alert('FAQ coming soon!')}>FAQ</button>
              </li>
              <li>
                <button onClick={() => alert('Blog coming soon!')}>Blog</button>
              </li>
              <li>
                <button onClick={() => alert('Guides coming soon!')}>Property Guides</button>
              </li>
              <li>
                <button onClick={() => alert('Terms coming soon!')}>Terms of Service</button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin className="contact-icon" size={20} />
                <span>123 Main Street, Negombo, Sri Lanka</span>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" size={20} />
                <span>+94 77 123 4567</span>
              </div>
              <div className="contact-item">
                <Mail className="contact-icon" size={20} />
                <span>support@rentify.lk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © {currentYear} Rentify. Made with <Heart className="footer-heart" size={16} fill="currentColor" /> in Sri Lanka
        </div>
        <div className="footer-legal">
          <button onClick={() => alert('Privacy Policy coming soon!')}>Privacy Policy</button>
          <button onClick={() => alert('Terms coming soon!')}>Terms & Conditions</button>
          <button onClick={() => alert('Cookie Policy coming soon!')}>Cookie Policy</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;