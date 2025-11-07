import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Ban } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import './MyReservations.css';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, confirmed, rejected, cancelled
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/reservations/my-reservations');
      const data = response.data || [];
      setReservations(data);
      
      // Mark all as viewed when fetched
      data.forEach(reservation => {
        if (reservation.status === 'ACCEPTED' || reservation.status === 'REJECTED') {
          localStorage.setItem(`viewed_reservation_${reservation.id}`, 'true');
        }
      });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (reservation) => {
    setSelectedReservation(reservation);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const openConfirmModal = (reservation) => {
    setSelectedReservation(reservation);
    setConfirmMessage('');
    setShowConfirmModal(true);
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    setIsSubmitting(true);
    try {
      await apiClient.put(`/reservations/${selectedReservation.id}/cancel`, {
        reason: cancelReason || 'Cancelled by tenant'
      });
      alert('Reservation cancelled successfully!');
      setShowCancelModal(false);
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedReservation) return;

    console.log('=== CONFIRMING RESERVATION ===');
    console.log('Reservation ID:', selectedReservation.id);
    console.log('Current Status:', selectedReservation.status);
    console.log('Message:', confirmMessage);

    setIsSubmitting(true);
    try {
      const response = await apiClient.put(`/reservations/${selectedReservation.id}/confirm`, {
        response: confirmMessage || 'Confirmed by tenant'
      });
      console.log('Confirm response:', response.data);
      alert('Reservation confirmed! The property is now reserved for you.');
      setShowConfirmModal(false);
      fetchReservations();
    } catch (error) {
      console.error('=== CONFIRM ERROR ===');
      console.error('Full error:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      let errorMsg = 'Failed to confirm reservation. ';
      if (error.response?.data?.error) {
        errorMsg += error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg += error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMsg += 'You do not have permission to confirm this reservation.';
      } else if (error.response?.status === 404) {
        errorMsg += 'Reservation not found.';
      } else {
        errorMsg += 'Please try again.';
      }
      
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this reservation? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('=== DELETING RESERVATION ===');
      console.log('Reservation ID:', id);
      
      await apiClient.delete(`/reservations/${id}`);
      alert('Reservation deleted successfully!');
      fetchReservations();
    } catch (error) {
      console.error('=== DELETE ERROR ===');
      console.error('Full error:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      let errorMsg = 'Failed to delete reservation. ';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.status === 404) {
        errorMsg = 'Endpoint not found. Please restart the backend.';
      } else if (error.response?.status === 403) {
        errorMsg = 'You can only delete cancelled or rejected reservations.';
      } else {
        errorMsg += 'Please try again.';
      }
      
      alert(errorMsg);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="status-icon approved" />;
      case 'confirmed':
        return <CheckCircle size={20} className="status-icon confirmed" />;
      case 'rejected':
        return <XCircle size={20} className="status-icon rejected" />;
      case 'cancelled':
        return <Ban size={20} className="status-icon cancelled" />;
      default:
        return <Clock size={20} className="status-icon pending" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="reservations-loading">
        <div className="spinner"></div>
        <p>Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div className="my-reservations">
      <div className="reservations-header">
        <h2>My Reservations</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({reservations.length})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={filter === 'confirmed' ? 'active' : ''}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="no-reservations">
          <Calendar size={48} />
          <h3>No Reservations Yet</h3>
          <p>Start browsing properties and make your first reservation!</p>
        </div>
      ) : (
        <div className="reservations-list">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className={`reservation-card ${reservation.status}`}>
              <div className="reservation-header">
                <div className="property-info">
                  <h3>{reservation.property?.title || 'Property'}</h3>
                  <p className="property-location">
                    <MapPin size={16} />
                    {reservation.property?.location || 'Location not available'}
                  </p>
                </div>
                <div className="status-container">
                  {getStatusIcon(reservation.status)}
                  <span className={getStatusClass(reservation.status)}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="reservation-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>
                    <strong>Start:</strong> {formatDate(reservation.startDate)}
                  </span>
                </div>
                {reservation.endDate && (
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>
                      <strong>End:</strong> {formatDate(reservation.endDate)}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <Clock size={16} />
                  <span>
                    <strong>Requested:</strong> {formatDate(reservation.createdAt)}
                  </span>
                </div>
              </div>

              {reservation.message && (
                <div className="reservation-message">
                  <strong>Your Message:</strong>
                  <p>{reservation.message}</p>
                </div>
              )}

              {reservation.ownerResponse && (
                <div className="owner-response">
                  <strong>Owner's Response:</strong>
                  <p>{reservation.ownerResponse}</p>
                </div>
              )}

              {reservation.tenantResponse && (
                <div className="tenant-response">
                  <strong>Your Response:</strong>
                  <p>{reservation.tenantResponse}</p>
                </div>
              )}

              <div className="reservation-actions">
                {reservation.status === 'approved' && (
                  <>
                    <button 
                      className="confirm-btn"
                      onClick={() => openConfirmModal(reservation)}
                    >
                      <CheckCircle size={18} />
                      Confirm Reservation
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => openCancelModal(reservation)}
                    >
                      <XCircle size={18} />
                      Cancel
                    </button>
                  </>
                )}
                {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                  <button 
                    className="cancel-btn"
                    onClick={() => openCancelModal(reservation)}
                  >
                    <XCircle size={18} />
                    Cancel Reservation
                  </button>
                )}
                {(reservation.status === 'cancelled' || reservation.status === 'rejected') && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    <Ban size={18} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Reservation</h3>
            <p>Are you sure you want to cancel this reservation?</p>
            {selectedReservation?.status === 'confirmed' && (
              <p className="warning-text">
                ⚠️ This property will become available again for others to reserve.
              </p>
            )}
            <div className="form-group">
              <label>Reason (optional):</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let the owner know why you're cancelling..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="secondary-btn" 
                onClick={() => setShowCancelModal(false)}
                disabled={isSubmitting}
              >
                Keep Reservation
              </button>
              <button 
                className="danger-btn" 
                onClick={handleCancelReservation}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Reservation</h3>
            <p>
              By confirming, you agree to proceed with this reservation. 
              The property will be marked as unavailable.
            </p>
            <div className="property-summary">
              <h4>{selectedReservation?.property?.title}</h4>
              <p>{selectedReservation?.property?.location}</p>
              <p><strong>Dates:</strong> {formatDate(selectedReservation?.startDate)} 
                {selectedReservation?.endDate && ` - ${formatDate(selectedReservation?.endDate)}`}
              </p>
            </div>
            <div className="form-group">
              <label>Message to Owner (optional):</label>
              <textarea
                value={confirmMessage}
                onChange={(e) => setConfirmMessage(e.target.value)}
                placeholder="Thank you for approving! Looking forward to..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="secondary-btn" 
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Not Yet
              </button>
              <button 
                className="primary-btn" 
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
