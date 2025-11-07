import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';
import apiClient, { fetchCsrfToken } from '../api/axiosConfig';
import { useNotification } from '../components/NotificationSystem';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const savedTheme = sessionStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme === 'dark' ? 'dark-theme' : '';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      await fetchCsrfToken();
      const response = await apiClient.post('/auth/login', {
        username: username,
        password: password
      });

      const userData = response.data;
      console.log('Login successful:', userData);

      // Store user session in sessionStorage (separate from admin localStorage)
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', userData.username);
      sessionStorage.setItem('email', userData.email);
      
      // Use the role returned by the backend, or default to 'owner' if not provided
      const userRole = userData.roles && userData.roles.length > 0
                       ? userData.roles[0].replace('ROLE_', '').toLowerCase()
                       : 'owner';
      sessionStorage.setItem('userRole', userRole);

      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');

      if (redirectPath) {
        showNotification('success', 'Login Successful', `Welcome back to Rentify, ${userData.username}!`);
        setTimeout(() => navigate(redirectPath, { replace: true }), 1000);
      } else {
        showNotification('success', 'Login Successful', `Welcome ${userData.username}!`);
        setTimeout(() => navigate('/', { replace: true }), 1000);
      }

    } catch (err) {
      console.error('Login failed:', err);
      if (err.response) {
        setError(err.response.data || 'Invalid username or password.');
      } else if (err.request) {
        setError('Network Error: Could not connect to the server.');
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => navigate('/');
  const handleForgotPassword = (e) => {
    e.preventDefault();
    showNotification('info', 'Coming Soon', 'Password reset feature will be available soon.');
  };
  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/signup');
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
          --bg-gradient-start: #F5F1E8;
          --bg-gradient-end: #FBF8F0;
          --text-primary: #1F2E3D;
          --text-secondary: #6B7C8C;
          --accent-color: #5B8DB8;
          --accent-hover: #4A7BA4;
          --card-bg: rgba(251, 248, 240, 0.95);
          --danger-color: #C85A54;
          --input-bg: #FBF8F0;
          --input-border: rgba(107, 124, 140, 0.3);
        }

        body.dark-theme {
          --bg-gradient-start: #1a2734;
          --bg-gradient-end: #2a3844;
          --text-primary: #F5F1E8;
          --text-secondary: #C4CDD5;
          --accent-color: #7BA5CC;
          --accent-hover: #6B9AC4;
          --card-bg: rgba(42, 56, 68, 0.95);
          --danger-color: #E67A72;
          --input-bg: #1a2734;
          --input-border: rgba(196, 205, 213, 0.3);
        }

        .login-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .circle {
          position: fixed;
          border-radius: 50%;
          background: rgba(91, 141, 184, 0.25);
          animation: float 20s infinite ease-in-out;
          box-shadow: 0 0 60px rgba(91, 141, 184, 0.3);
          filter: blur(1px);
          pointer-events: none;
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
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 180px;
          height: 180px;
          bottom: 10%;
          left: 5%;
          animation-delay: 4s;
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

        .back-button {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          color: var(--text-primary);
          border: 1px solid rgba(91, 141, 184, 0.3);
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
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateX(-5px);
          border-color: var(--accent-color);
        }

        .login-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(91, 141, 184, 0.2);
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
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

        .logo-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: var(--accent-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          font-weight: bold;
          font-size: 1.5rem;
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.3);
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-message {
          background: rgba(200, 90, 84, 0.1);
          border: 1px solid var(--danger-color);
          color: var(--danger-color);
          padding: 0.875rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }



        .input-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .input-wrapper:focus-within .input-icon,
        .input-wrapper:has(.form-input:not(:placeholder-shown)) .input-icon {
          opacity: 0;
        }

        .form-input {
          width: 100%;
          height: 3.25rem;
          padding: 0 3rem 0 1rem;
          border: 2px solid var(--input-border);
          border-radius: 8px;
          font-size: 1rem;
          background: var(--input-bg);
          color: var(--text-primary);
          transition: all 0.3s ease;
          line-height: 1.5;
        }

        .form-input::placeholder {
          color: var(--text-secondary);
          opacity: 0.8;
          font-size: 0.95rem;
          transition: opacity 0.3s ease;
        }

        .form-input:focus::placeholder,
        .form-input:not(:placeholder-shown)::placeholder {
          opacity: 0;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 3.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          z-index: 2;
        }

        .password-toggle:hover {
          color: var(--accent-color);
        }

        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-wrapper input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-wrapper label {
          color: var(--text-primary);
          cursor: pointer;
        }

        .forgot-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
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
          color: #FBF8F0;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(91, 141, 184, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .login-button:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(91, 141, 184, 0.4);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FBF8F0;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
          position: relative;
          margin: 1.5rem 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: var(--input-border);
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .signup-link {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .signup-link a {
          color: var(--accent-color);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .signup-link a:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .login-container {
            padding: 1rem;
          }

          .login-card {
            padding: 2rem;
          }

          .back-button {
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .circle {
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      <button className="back-button" onClick={handleBackToHome}>
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

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
                disabled={isLoading}
                required
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
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a onClick={handleForgotPassword} className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="divider">OR</div>

          <div className="signup-link">
            Don't have an account? <a onClick={handleSignup}>Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
