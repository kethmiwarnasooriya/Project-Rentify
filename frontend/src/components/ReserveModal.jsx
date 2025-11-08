import React, { useState } from 'react';
import { X, Calendar, MessageSquare } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import './ReserveModal.css';

const ReserveModal = ({ property, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate) {
      setError('Please select a start date');
      return;
    }

    // Validate start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedStart = new Date(formData.startDate);
    
    if (selectedStart < today) {
      setError('Start date cannot be in the past');
      return;
    }

    // Validate end date is after start date
    if (formData.endDate) {
      const selectedEnd = new Date(formData.endDate);
      if (selectedEnd <= selectedStart) {
        setError('End date must be after start date');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    const reservationData = {
      propertyId: property.id,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      message: formData.message || null
    };

    try {
      await apiClient.post('/reservations', reservationData);
      
      alert('Reservation request sent successfully!');
      setFormData({ startDate: '', endDate: '', message: '' });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('=== RESERVATION ERROR ===');
      console.error('Full error:', err);
      console.error('Response:', err.response);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      console.error('Request data:', reservationData);
      
      let errorMsg = 'Failed to create reservation. Please try again.';
      
      if (err.response?.data) {
        // Check all possible error formats
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      } else if (err.response?.status === 401) {
        errorMsg = 'Please login to make a reservation';
      } else if (err.response?.status === 403) {
        errorMsg = 'You do not have permission to make reservations. Make sure you are logged in as a TENANT.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      console.error('Final error message:', errorMsg);
      setError(errorMsg);
      alert('ERROR: ' + errorMsg); // Show alert for better visibility
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="reserve-modal-overlay" onClick={onClose}>
      <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reserve-modal-header">
          <h2>Reserve Property</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="property-summary">
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p className="property-price">LKR {property.price?.toLocaleString()}/month</p>
        </div>

        <form onSubmit={handleSubmit} className="reserve-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="startDate">
              <Calendar size={18} />
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              <Calendar size={18} />
              End Date (Optional)
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
            <small>Leave empty if you're not sure about the end date</small>
          </div>

          <div className="form-group">
            <label htmlFor="message">
              <MessageSquare size={18} />
              Message to Owner (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell the owner about your requirements, move-in preferences, etc."
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Reservation Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReserveModal;
