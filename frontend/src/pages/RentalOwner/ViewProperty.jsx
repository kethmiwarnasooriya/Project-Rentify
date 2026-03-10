// src/pages/RentalOwner/ViewProperty.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Building2, Bed, Bath, Square, Calendar, User, Edit, Trash2, Loader2 } from 'lucide-react';
import apiClient, { fetchCsrfToken } from '../../api/axiosConfig';
import { useNotification } from '../../components/NotificationSystem';

const ViewProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      await fetchCsrfToken();
      const response = await apiClient.get(`/properties/${id}`);
      setProperty(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      showNotification('error', 'Error', 'Failed to load property data');
      navigate('/owner/dashboard');
    }
  };

  const handleEdit = () => {
    navigate(`/owner/edit-property/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/properties/${id}`);
        showNotification('success', 'Property Deleted', 'Property has been deleted successfully');
        navigate('/owner/dashboard');
      } catch (error) {
        console.error('Failed to delete property:', error);
        showNotification('error', 'Delete Failed', 'Failed to delete property. Please try again.');
      }
    }
  };

  const nextImage = () => {
    if (property?.imageFilenames?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.imageFilenames.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.imageFilenames?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.imageFilenames.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #668cb4 0%, #fffef7 100%)'
      }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'white' }} />
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #668cb4 0%, #fffef7 100%)'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h2>Property not found</h2>
          <button 
            onClick={() => navigate('/owner/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #668cb4 0%, #fffef7 100%)', 
      padding: '2rem' 
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
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
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#28a745',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Edit size={16} />
              Edit
            </button>
            
            <button
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#dc3545',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
        }}>
          {/* Image Gallery */}
          {property.imageFilenames && property.imageFilenames.length > 0 && (
            <div style={{ position: 'relative', height: '400px' }}>
              <img
                src={`https://project-rentify.up.railway.app/api/files/${property.imageFilenames[currentImageIndex]}`}
                alt={property.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {property.imageFilenames.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    ←
                  </button>
                  
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    →
                  </button>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {property.imageFilenames.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          background: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Property Details */}
          <div style={{ padding: '2rem' }}>
            {/* Title and Status */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '1rem' 
            }}>
              <h1 style={{ margin: 0, color: '#333', fontSize: '2rem' }}>
                {property.title}
              </h1>
              <span style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                background: property.status === 'active' ? '#d4edda' : 
                           property.status === 'rented' ? '#cce5ff' : '#f8d7da',
                color: property.status === 'active' ? '#155724' : 
                       property.status === 'rented' ? '#004085' : '#721c24'
              }}>
                {property.status}
              </span>
            </div>

            {/* Location and Price */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                <MapPin size={18} />
                <span style={{ fontSize: '1.1rem' }}>{property.location}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                LKR {property.price?.toLocaleString()}/month
              </div>
            </div>

            {/* Property Features */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <Building2 size={20} color="#007bff" />
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>Type</div>
                  <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {property.propertyType}
                  </div>
                </div>
              </div>

              {property.bedrooms > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <Bed size={20} color="#007bff" />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Bedrooms</div>
                    <div style={{ fontWeight: 'bold' }}>{property.bedrooms}</div>
                  </div>
                </div>
              )}

              {property.bathrooms > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <Bath size={20} color="#007bff" />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Bathrooms</div>
                    <div style={{ fontWeight: 'bold' }}>{property.bathrooms}</div>
                  </div>
                </div>
              )}

              {property.area > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <Square size={20} color="#007bff" />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>Area</div>
                    <div style={{ fontWeight: 'bold' }}>{property.area} sq ft</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Description</h3>
              <p style={{ 
                lineHeight: '1.6', 
                color: '#666',
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                margin: 0
              }}>
                {property.description}
              </p>
            </div>

            {/* Contact and Owner Info */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                padding: '1rem',
                background: '#e3f2fd',
                borderRadius: '8px',
                border: '1px solid #bbdefb'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Contact Information</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} />
                  <span>{property.contact}</span>
                </div>
              </div>

              <div style={{ 
                padding: '1rem',
                background: '#f3e5f5',
                borderRadius: '8px',
                border: '1px solid #e1bee7'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#7b1fa2' }}>Owner Information</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} />
                  <span>{property.ownerUsername}</span>
                </div>
              </div>
            </div>

            {/* Created Date */}
            {property.createdAt && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: '#666',
                fontSize: '0.875rem'
              }}>
                <Calendar size={16} />
                <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProperty;