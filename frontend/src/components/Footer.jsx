import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const getTheme = () => {
    if (document.body.classList.contains('dark-theme')) return 'dark';
    return sessionStorage.getItem('theme') || 'light';
  };
  
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    window.addEventListener('storage', handleThemeChange);
    const interval = setInterval(handleThemeChange, 100);
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
        :root {
          --footer-bg: #F5F1E8;
          --footer-text: #1F2E3D;
          --footer-secondary: #6B7C8C;
          --footer-accent: #5B8DB8;
          --footer-border: rgba(107, 124, 140, 0.2);
        }

        body.dark-theme {
          --footer-bg: #1a2734;
          --footer-text: #F5F1E8;
          --footer-secondary: #C4CDD5;
          --footer-accent: #7BA5CC;
          --footer-border: rgba(196, 205, 213, 0.2);
        }

        .footer {
          background: var(--footer-bg);
          border-top: 1px solid var(--footer-border);
          color: var(--footer-text);
          margin-top: auto;
          width: 100%;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 4rem 1rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 2.5rem;
        }

        .footer-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1.25rem;
          color: var(--footer-accent);
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
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--footer-accent);
        }

        .footer-logo-icon {
          width: 40px;
          height: 40px;
          background: var(--footer-accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
        }

        .footer-description {
          color: var(--footer-secondary);
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.875rem;
        }

        .footer-links button {
          color: var(--footer-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          font-weight: 500;
          display: inline-block;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          text-align: left;
        }

        .footer-links button:hover {
          color: var(--footer-accent);
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
          color: var(--footer-secondary);
          font-size: 0.95rem;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: var(--footer-accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.25rem;
        }

        .social-link {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(91, 141, 184, 0.1);
          border: 1px solid var(--footer-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--footer-accent);
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .social-link:hover {
          background: var(--footer-accent);
          color: #FBF8F0;
          border-color: var(--footer-accent);
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
        }

        .footer-bottom {
          border-top: 1px solid var(--footer-border);
          padding: 1.75rem 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          color: var(--footer-secondary);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-heart {
          color: #C85A54;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .footer-legal {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-legal button {
          color: var(--footer-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        }

        .footer-legal button:hover {
          color: var(--footer-accent);
        }

        @media (max-width: 1024px) {
          .footer-content {
            padding: 2.5rem 2rem 1rem;
          }

          .footer-bottom {
            padding: 1.5rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            padding: 2rem 1.5rem 1rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem 1.5rem;
          }

          .footer-legal {
            justify-content: center;
          }
        }
      `}</style>

      <div className="footer-content">
        <div className="footer-grid">
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

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><button onClick={() => handleNavigation('/')}>Home</button></li>
              <li><button onClick={() => handleNavigation('/about')}>About Us</button></li>
              <li><button onClick={() => handleNavigation('/contact')}>Contact</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><button onClick={() => handleNavigation('/faq')}>FAQ</button></li>
              <li><button onClick={() => handleNavigation('/blog')}>Blog</button></li>
              <li><button onClick={() => handleNavigation('/property-guides')}>Property Guides</button></li>
              <li><button onClick={() => handleNavigation('/terms')}>Terms of Service</button></li>
            </ul>
          </div>

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

      <div className="footer-bottom">
        <div className="footer-copyright">
          © {currentYear} Rentify. Made with <Heart className="footer-heart" size={16} fill="currentColor" /> in Sri Lanka
        </div>
        <div className="footer-legal">
          <button onClick={() => handleNavigation('/privacy-policy')}>Privacy Policy</button>
          <button onClick={() => handleNavigation('/terms')}>Terms & Conditions</button>
          <button onClick={() => handleNavigation('/cookie-policy')}>Cookie Policy</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
