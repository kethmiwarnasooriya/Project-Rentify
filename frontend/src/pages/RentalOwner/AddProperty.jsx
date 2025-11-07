import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin, Phone, FileText, Building2, Image, Menu, Home, User, Info, Mail, Settings, LogOut } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import { useNotification } from '../../components/NotificationSystem';

const AddProperty = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => sessionStorage.getItem('theme') || 'light');
  const [username] = useState(sessionStorage.getItem('username') || 'Owner');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    contact: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'apartment'
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      showNotification('warning', 'Image Limit Reached', 'You can upload maximum 10 images');
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // First, upload all images to get actual filenames
      const imageFilenames = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const formData = new FormData();
        formData.append('file', file);

        console.log(`Uploading image ${i + 1}/${images.length}:`, file.name);

        try {
          const uploadResponse = await apiClient.post('/files/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('Image uploaded successfully:', uploadResponse.data);
          imageFilenames.push(uploadResponse.data.filename);
        } catch (uploadError) {
          console.error(`Failed to upload image ${file.name}:`, uploadError);
          throw new Error(`Failed to upload image: ${file.name}`);
        }
      }

      console.log('All images uploaded. Filenames:', imageFilenames);

      // Now create the property with actual uploaded filenames
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        contact: formData.contact,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseInt(formData.area) : 0,
        propertyType: formData.propertyType,
        imageFilenames: imageFilenames // Real uploaded filenames
      };

      console.log('Sending property data to backend:', propertyData);

      // Send JSON to backend
      const response = await apiClient.post('/properties', propertyData);

      console.log('Property added successfully:', response.data);
      showNotification('success', 'Property Added Successfully', 'Your property has been listed on Rentify!');
      setTimeout(() => navigate('/owner/dashboard'), 1500);

    } catch (error) {
      console.error('Failed to add property:', error);
      console.error('Error response:', error.response);

      let errorTitle = 'Failed to Add Property';
      let errorMsg = 'Please check your information and try again.';

      // Check if it's an image upload error
      if (error.message && error.message.includes('Failed to upload image')) {
        errorTitle = 'Image Upload Failed';
        errorMsg = error.message;
      } else if (error.response) {
        const validationErrors = error.response.data?.errors || error.response.data?.message;
        if (validationErrors) {
          errorTitle = 'Validation Failed';
          errorMsg = typeof validationErrors === 'string' ? validationErrors : JSON.stringify(validationErrors);
        } else {
          errorMsg = `Error ${error.response.status}: ${error.response.statusText || 'Server error'}`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      showNotification('error', errorTitle, errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
      navigate('/owner/dashboard');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('redirectAfterLogin');
    navigate('/login');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="add-property-container">
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
          --border-color: rgba(107, 124, 140, 0.3);
          --error-color: #C85A54;
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
          --border-color: rgba(123, 165, 204, 0.3);
          --error-color: #E67A72;
        }

        .add-property-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          color: var(--text-primary);
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
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

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #FBF8F0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #5B8DB8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
          font-weight: 600;
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

        /* Main Content */
        .main-content {
          padding-top: 8rem;
          padding-bottom: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          color: var(--text-primary);
          border: 1px solid rgba(91, 141, 184, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .back-button:hover {
          background: var(--accent-color);
          color: #FBF8F0;
          transform: translateX(-5px);
          border-color: var(--accent-color);
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .form-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          border: 1px solid rgba(91, 141, 184, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

        .form-section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-title svg {
          color: var(--accent-color);
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .form-grid-2 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.875rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-gradient-end);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.15);
        }

        body.dark-theme .form-group input:focus,
        body.dark-theme .form-group textarea:focus,
        body.dark-theme .form-group select:focus {
          box-shadow: 0 0 0 3px rgba(123, 165, 204, 0.15);
        }

        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }

        .error-message {
          color: var(--error-color);
          font-size: 0.85rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .image-upload-section {
          margin-bottom: 2rem;
        }

        .upload-area {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--bg-gradient-end);
        }

        .upload-area:hover {
          border-color: var(--accent-color);
          background: rgba(91, 141, 184, 0.05);
        }

        body.dark-theme .upload-area:hover {
          background: rgba(123, 165, 204, 0.05);
        }

        .upload-area input {
          display: none;
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          background: var(--accent-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FBF8F0;
        }

        .upload-area h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 1.2rem;
        }

        .upload-area p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .image-previews {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid var(--border-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 32px;
          height: 32px;
          background: var(--danger-color);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #FBF8F0;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .remove-image:hover {
          transform: scale(1.1);
          background: var(--danger-hover);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(91, 141, 184, 0.2);
        }

        .btn {
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-cancel {
          background: transparent;
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .btn-cancel:hover {
          background: var(--border-color);
        }

        .btn-submit {
          background: var(--accent-color);
          color: #FBF8F0;
          border: 2px solid var(--accent-color);
        }

        .btn-submit:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(91, 141, 184, 0.3);
        }

        body.dark-theme .btn-submit:hover {
          box-shadow: 0 4px 12px rgba(123, 165, 204, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            display: none;
          }

          .main-content {
            padding-top: 6rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .form-card {
            padding: 2rem;
          }

          .header-title {
            font-size: 2rem;
            flex-direction: column;
          }

          .sidebar {
            width: 280px;
            right: ${sidebarOpen ? '0' : '-280px'};
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .image-previews {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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
          <div className="user-info">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <span>{username}</span>
          </div>
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
      <div className="main-content">
        <div className="page-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="header-title">
            <Building2 size={36} />
            List Your Property
          </h1>
          <p className="header-subtitle">Fill in the details below to add a new property to your portfolio</p>
        </div>

        <div className="form-card">
          <div className="form-section">
            <h2 className="section-title">
              <FileText size={22} />
              Basic Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Modern 2BHK Apartment"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property, amenities, and unique features..."
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <MapPin size={22} />
              Location & Pricing
            </h2>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Area, Street"
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Monthly Rent (LKR) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="25000"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <Building2 size={22} />
              Property Details
            </h2>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="1"
                />
              </div>
              <div className="form-group">
                <label>Area (sq ft)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="1200"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <Phone size={22} />
              Contact Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                />
                {errors.contact && <span className="error-message">{errors.contact}</span>}
              </div>
            </div>
          </div>

          <div className="image-upload-section">
            <h2 className="section-title">
              <Image size={22} />
              Property Images *
            </h2>
            <label className="upload-area">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="upload-icon">
                <Upload size={32} />
              </div>
              <h3>Upload Property Images</h3>
              <p>Click to upload or drag and drop (Max 10 images)</p>
            </label>
            {errors.images && <span className="error-message">{errors.images}</span>}
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={handleBack}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Property...' : 'Add Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
