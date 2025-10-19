import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Simple authentication (replace with real authentication)
    if (username && password) {
      // Set login status
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', username);

      // Check if there's a redirect path and role
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      const intendedRole = sessionStorage.getItem('intendedRole');

      console.log('Redirect Path:', redirectPath);
      console.log('Intended Role:', intendedRole);

      if (redirectPath && intendedRole) {
        // Set the user role
        sessionStorage.setItem('userRole', intendedRole);
        
        // Clear the temporary redirect data
        sessionStorage.removeItem('redirectAfterLogin');
        sessionStorage.removeItem('intendedRole');
        
        // Navigate to the intended page
        console.log('Navigating to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        // Default redirect to home
        navigate('/', { replace: true });
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
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
          --card-bg: rgba(255, 255, 255, 0.98);
          --input-bg: #f8fafc;
          --input-border: #e2e8f0;
          --error-color: #ef4444;
        }

        body.dark-theme {
          --bg-gradient-start: #1e3a8a;
          --bg-gradient-end: #1e40af;
          --text-primary: #ffffff;
          --text-secondary: #ffffff;
          --accent-color: #60a5fa;
          --accent-hover: #3b82f6;
          --card-bg: rgba(30, 41, 59, 0.98);
          --input-bg: rgba(51, 65, 85, 0.5);
          --input-border: rgba(100, 116, 139, 0.5);
        }

        .login-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Animated background circles */
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 20s infinite ease-in-out;
        }

        .circle-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 60px;
          height: 60px;
          top: 20%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          bottom: 15%;
          left: 5%;
          animation-delay: 4s;
        }

        .circle-4 {
          width: 70px;
          height: 70px;
          bottom: 20%;
          right: 10%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(20px);
            opacity: 0.6;
          }
        }

        .back-button {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .login-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          position: relative;
          z-index: 1;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: var(--accent-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-color);
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: var(--text-primary);
          opacity: 0.7;
          font-size: 0.95rem;
        }

        .login-form {
          margin-top: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-primary);
          opacity: 0.5;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid var(--input-border);
          border-radius: 10px;
          font-size: 1rem;
          background: var(--input-bg);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-primary);
          opacity: 0.5;
          cursor: pointer;
          padding: 0.25rem;
          transition: opacity 0.2s ease;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error-color);
          color: var(--error-color);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-wrapper input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-wrapper label {
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .forgot-link {
          color: var(--accent-color);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 1rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .login-button:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: var(--text-primary);
          opacity: 0.5;
          font-size: 0.9rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--input-border);
        }

        .divider::before {
          margin-right: 1rem;
        }

        .divider::after {
          margin-left: 1rem;
        }

        .signup-link {
          text-align: center;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .signup-link a {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .signup-link a:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-card {
            padding: 2rem 1.5rem;
          }

          .back-button {
            top: 1rem;
            left: 1rem;
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }

          .logo-text {
            font-size: 1.75rem;
          }
        }
      `}</style>

      {/* Animated background circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Back to Home
      </button>

      {/* Login Card */}
      <div className="login-card">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">R</div>
            <span className="logo-text">Rentify</span>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please login to your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="checkbox-wrapper">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="divider">OR</div>

          <div className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;