import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, Phone, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient, { fetchCsrfToken } from '../api/axiosConfig';
import { useNotification } from '../components/NotificationSystem';

const SignupPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [theme, setTheme] = useState(() => sessionStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    if (!formData.username.trim() || formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim() || !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'terms') {
      setTermsAccepted(checked);
      if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setFormError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'owner' // Default role since users can act as both owner and tenant
        };

        console.log('Submitting signup data:', payload);
        await fetchCsrfToken();
        const response = await apiClient.post('/auth/register', payload);

        console.log('Signup successful:', response.data);
        showNotification('success', 'Account Created Successfully', 'Welcome to Rentify! Please login to continue.');
        setTimeout(() => navigate('/login', { replace: true }), 1500);

      } catch (err) {
        console.error('Signup failed:', err);
        if (err.response && err.response.data) {
          if (err.response.data.validationErrors) {
            setErrors(prev => ({ ...prev, ...err.response.data.validationErrors }));
            setFormError("Please correct the errors below.");
          } else if (typeof err.response.data === 'string') {
            setFormError(err.response.data);
          } else if (err.response.data.message) {
            setFormError(err.response.data.message);
          } else {
            setFormError('Signup failed due to a server error. Please try again.');
          }
        } else if (err.request) {
          setFormError('Network Error: Could not connect to the server.');
        } else {
          setFormError('An unexpected error occurred during signup.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormError('Please fix the errors in the form.');
      console.log("Frontend validation errors:", errors);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: '#C85A54' };
    if (strength <= 4) return { strength: 66, label: 'Medium', color: '#E8A54A' };
    return { strength: 100, label: 'Strong', color: '#5B9A8B' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="signup-container">
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
          --error-bg: rgba(200, 90, 84, 0.1);
          --error-color: #C85A54;
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
          --error-bg: rgba(230, 122, 114, 0.1);
          --error-color: #E67A72;
        }

        .signup-container {
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

        .signup-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          width: 100%;
          max-width: 650px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(91, 141, 184, 0.2);
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
          max-height: 90vh;
          overflow-y: auto;
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
          margin-bottom: 2rem;
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

        .signup-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .signup-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .error-message {
          background: var(--error-bg);
          border: 1px solid var(--error-color);
          color: var(--error-color);
          padding: 0.875rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
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

        .form-input.error {
          border-color: var(--error-color);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
        }

        select.form-input {
          padding-left: 1rem;
          padding-right: 3rem;
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

        .error-text {
          color: var(--error-color);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .password-strength {
          margin-top: 0.5rem;
        }

        .strength-bar {
          height: 4px;
          background: var(--input-border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
        }

        .strength-label {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .terms-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          margin-top: 0.2rem;
        }

        .terms-checkbox label {
          cursor: pointer;
          line-height: 1.5;
        }

        .terms-checkbox a {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .terms-checkbox a:hover {
          text-decoration: underline;
        }

        .signup-button {
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

        .signup-button:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(91, 141, 184, 0.4);
        }

        .signup-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
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
          margin: 1rem 0;
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

        .login-link {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .login-link a {
          color: var(--accent-color);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .login-link a:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .signup-container {
            padding: 1rem;
          }

          .signup-card {
            padding: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
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

      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="signup-card">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">R</div>
            <span className="logo-text">Rentify</span>
          </div>
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join us today and access both owner and tenant features</p>
        </div>

        <form className="signup-form" onSubmit={handleSignup} noValidate>
          {formError && (
            <div className="error-message">
              <AlertCircle size={18}/> {formError}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  className={`form-input ${errors.fullName ? 'error' : ''}`} 
                  placeholder="Saman Perera" 
                  disabled={isSubmitting} 
                  required 
                />
              </div>
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  className={`form-input ${errors.username ? 'error' : ''}`} 
                  placeholder="sperera" 
                  disabled={isSubmitting} 
                  required 
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className={`form-input ${errors.email ? 'error' : ''}`} 
                placeholder="saman@example.com" 
                disabled={isSubmitting} 
                required 
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className={`form-input ${errors.phone ? 'error' : ''}`} 
                placeholder="+94 761234567" 
                disabled={isSubmitting} 
                required 
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className={`form-input ${errors.password ? 'error' : ''}`} 
                  placeholder="••••••••" 
                  disabled={isSubmitting} 
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)} 
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
              {formData.password && !errors.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${passwordStrength.strength}%`, 
                        backgroundColor: passwordStrength.color 
                      }} 
                    />
                  </div>
                  <span 
                    className="strength-label" 
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`} 
                  placeholder="••••••••" 
                  disabled={isSubmitting} 
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>



          <div className="terms-checkbox">
            <input 
              type="checkbox" 
              id="terms" 
              name="terms" 
              checked={termsAccepted} 
              onChange={handleChange} 
              required 
              disabled={isSubmitting}
            />
            <label htmlFor="terms">
              I agree to the <a onClick={() => navigate('/terms')}>Terms of Service</a> and <a onClick={() => navigate('/privacy-policy')}>Privacy Policy</a>
            </label>
          </div>
          {errors.terms && <span className="error-text">{errors.terms}</span>}

          <button type="submit" className="signup-button" disabled={isSubmitting || !termsAccepted}>
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Create Account
              </>
            )}
          </button>

          <div className="divider">OR</div>

          <div className="login-link">
            Already have an account? <a onClick={() => navigate('/login')}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
