// src/pages/RentalOwner/EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin, Phone, FileText, Building2, Image, Save, Loader2 } from 'lucide-react';
import apiClient, { fetchCsrfToken } from '../../api/axiosConfig';
import { useNotification } from '../../components/NotificationSystem';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      await fetchCsrfToken();
      const response = await apiClient.get(`/properties/${id}`);
      const property = response.data;

      setFormData({
        title: property.title || '',
        description: property.description || '',
        location: property.location || '',
        price: property.price?.toString() || '',
        contact: property.contact || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        propertyType: property.propertyType || 'apartment'
      });

      setExistingImages(property.imageFilenames || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      showNotification('error', 'Error', 'Failed to load property data');
      navigate('/owner/dashboard');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 10) {
      showNotification('warning', 'Image Limit Reached', 'You can upload maximum 10 images');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';

    const totalImages = existingImages.length + images.length;
    if (totalImages === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Upload new images if any
      const newImageFilenames = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
          const uploadResponse = await apiClient.post('/files/upload', formDataUpload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          newImageFilenames.push(uploadResponse.data.filename);
        } catch (uploadError) {
          console.error(`Failed to upload image ${file.name}:`, uploadError);
          throw new Error(`Failed to upload image: ${file.name}`);
        }
      }

      // Combine existing and new image filenames
      const allImageFilenames = [...existingImages, ...newImageFilenames];

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
        imageFilenames: allImageFilenames
      };

      await apiClient.put(`/properties/${id}`, propertyData);

      showNotification('success', 'Property Updated', 'Your property has been updated successfully!');
      setTimeout(() => navigate('/owner/dashboard'), 1500);

    } catch (error) {
      console.error('Failed to update property:', error);

      let errorTitle = 'Failed to Update Property';
      let errorMsg = 'Please check your information and try again.';

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
      }

      showNotification('error', errorTitle, errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #668cb4 0%, #fffef7 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/owner/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ marginBottom: '2rem', color: '#333' }}>Edit Property</h1>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.title ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Beautiful 2BR Apartment in Colombo"
              />
              {errors.title && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.title}</span>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.description ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Describe your property..."
              />
              {errors.description && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.description}</span>}
            </div>

            {/* Location and Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.location ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Colombo, Sri Lanka"
                />
                {errors.location && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.location}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Monthly Rent (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.price ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="50000"
                />
                {errors.price && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.price}</span>}
              </div>
            </div>

            {/* Property Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="2"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="1"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="1200"
                />
              </div>
            </div>

            {/* Contact */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Contact Information *
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.contact ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="+94 77 123 4567"
              />
              {errors.contact && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.contact}</span>}
            </div>

            {/* Images */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Property Images * (Max 10)
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#666' }}>Current Images:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                    {existingImages.map((filename, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={`http://localhost:8080/api/files/${filename}`}
                          alt={`Property ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #ddd'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviews.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#666' }}>New Images:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #28a745'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: '#28a745',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  <Upload size={20} />
                  Add More Images
                </label>
              </div>

              {errors.images && <span style={{ color: '#dc3545', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>{errors.images}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '1rem',
                background: isSubmitting ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Updating Property...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Property
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;