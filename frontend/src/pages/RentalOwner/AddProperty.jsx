import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin, Phone, FileText, Building2, Image } from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const [theme] = useState(() => sessionStorage.getItem('theme') || 'light');
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

  React.useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
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
      alert('You can upload maximum 10 images');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const properties = JSON.parse(sessionStorage.getItem('properties') || '[]');
    const newProperty = {
      id: Date.now(),
      ...formData,
      images: imagePreviews,
      createdAt: new Date().toISOString(),
      owner: username,
      status: 'active'
    };
    
    properties.push(newProperty);
    sessionStorage.setItem('properties', JSON.stringify(properties));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Property added successfully!');
      navigate('/owner/dashboard');
    }, 1000);
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
      navigate('/owner/dashboard');
    }
  };

  return (
    <div className="add-property-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bg-color: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --nav-bg: rgba(255, 255, 255, 0.98);
          --card-bg: white;
          --border-color: #e2e8f0;
          --error-color: #ef4444;
        }
        body.dark-theme {
          --bg-color: #0f172a;
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --accent-color: #60a5fa;
          --accent-hover: #3b82f6;
          --nav-bg: rgba(30, 41, 59, 0.98);
          --card-bg: #1e293b;
          --border-color: #334155;
        }
        .add-property-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
        }
        .top-nav {
          position: fixed;
          top: 0;
          width: 100%;
          background: var(--nav-bg);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }
        .back-btn:hover {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent-color);
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }
        .main-content {
          margin-top: 5rem;
          padding: 2rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }
        .page-header { margin-bottom: 2rem; }
        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .page-header p { color: var(--text-secondary); }
        .form-card {
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .form-section { margin-bottom: 2rem; }
        .section-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-color);
        }
        .form-grid { display: grid; gap: 1.5rem; }
        .form-grid-2 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-group textarea {
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
        }
        .error-message {
          color: var(--error-color);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
        .image-upload-section { margin-bottom: 2rem; }
        .upload-area {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--bg-color);
        }
        .upload-area:hover {
          border-color: var(--accent-color);
          background: rgba(59, 130, 246, 0.05);
        }
        .upload-area input { display: none; }
        .upload-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          background: var(--accent-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .upload-area h3 { margin-bottom: 0.5rem; }
        .upload-area p {
          color: var(--text-secondary);
          font-size: 0.9rem;
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
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-color);
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
          width: 28px;
          height: 28px;
          background: var(--error-color);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
        }
        .remove-image:hover {
          transform: scale(1.1);
          background: #dc2626;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }
        .btn {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-cancel {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
        .btn-cancel:hover { background: var(--bg-color); }
        .btn-submit {
          background: var(--accent-color);
          color: white;
        }
        .btn-submit:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        @media (max-width: 768px) {
          .top-nav { padding: 1rem; }
          .main-content {
            padding: 1rem;
            margin-top: 4rem;
          }
          .form-card { padding: 1.5rem; }
          .page-header h1 { font-size: 1.5rem; }
          .form-actions { flex-direction: column; }
          .btn {
            width: 100%;
            justify-content: center;
          }
          .image-previews {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>

      <nav className="top-nav">
        <div className="nav-left">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="logo">
            <Building2 size={24} />
            Add Property
          </div>
        </div>
        <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
      </nav>

      <div className="main-content">
        <div className="page-header">
          <h1>
            <Building2 size={32} />
            List Your Property
          </h1>
          <p>Fill in the details below to add a new property to your portfolio</p>
        </div>

        <div>
          <div className="form-card">
            <div className="form-section">
              <h2 className="section-title">
                <FileText size={20} />
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
                <MapPin size={20} />
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
                <Building2 size={20} />
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
                <Phone size={20} />
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
                <Image size={20} />
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
                      <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                        <X size={16} />
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
              <button type="button" className="btn btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Adding Property...' : 'Add Property'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;