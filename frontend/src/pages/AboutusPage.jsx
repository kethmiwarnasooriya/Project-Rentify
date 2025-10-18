// AboutUsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, FileCheck, Home, CheckCircle, Target, Heart } from 'lucide-react';
import aboutUsImage from '../assets/aboutus.png';


const AboutUsPage = () => {
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

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
          --primary-color: #3b82f6;
          --primary-dark: #2563eb;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --bg-light: #f8fafc;
          --card-bg: #ffffff;
          --accent-color: #3b82f6;
        }

        body.dark-theme {
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
          --bg-light: #0f172a;
          --card-bg: #1e293b;
        }

        .about-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: var(--bg-light);
          color: var(--text-primary);
        }

        /* Header Section */
        .about-header {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .page-title {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          animation: fadeInUp 0.6s ease;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          max-width: 600px;
          animation: fadeInUp 0.6s ease 0.2s backwards;
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

        /* Decorative circles */
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 20s infinite ease-in-out;
        }

        .circle-1 {
          width: 100px;
          height: 100px;
          top: 10%;
          right: 10%;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          bottom: 10%;
          left: 5%;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }

        /* Main Content */
        .about-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        /* Hero Section with Image */
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
          color: var(--primary-color);
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
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .image-wrapper img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(59, 130, 246, 0.1));
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
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          animation: fadeInUp 0.6s ease;
          animation-fill-mode: backwards;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
          border-color: var(--primary-color);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
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
          padding: 4rem 3rem;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          margin-bottom: 5rem;
          position: relative;
          overflow: hidden;
        }

        .mission-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(30%, -30%);
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
          background: var(--primary-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
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
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          padding: 2.5rem;
          border-radius: 16px;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
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
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
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
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          border-radius: 24px;
          color: white;
          margin-bottom: 2rem;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-section p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          background: white;
          color: var(--primary-color);
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-text h2 {
            font-size: 2rem;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .about-content {
            padding: 3rem 1.5rem;
          }

          .mission-section {
            padding: 3rem 2rem;
          }
        }

        @media (max-width: 640px) {
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
        }
      `}</style>

      {/* Header */}
      <div className="about-header">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        
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
              {/* Replace this src with your photo.png path */}
              <img 
                src={aboutUsImage} 
                alt="Modern rental property" 
              />
              <div className="image-overlay"></div>
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

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied users on Rentify today</p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            <CheckCircle size={20} />
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;