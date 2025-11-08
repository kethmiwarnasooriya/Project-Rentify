import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Mail, Phone, Clock, CheckCircle, XCircle, MessageSquare, Ban } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import './IncomingReservations.css';

const IncomingReservations = ({ onUpdate }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, confirmed, rejected, cancelled
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [responseAction, setResponseAction] = useState(''); // 'approve' or 'reject'
  const [responseMessage, setResponseMessage] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/reservations/incoming');
      setReservations(response.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const openResponseModal = (reservation, action) => {
    setSelectedReservation(reservation);
    setResponseAction(action);
    setResponseMessage('');
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSelectedReservation(null);
    setResponseAction('');
    setResponseMessage('');
  };

  const openCancelModal = (reservation) => {
    setSelectedReservation(reservation);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleResponse = async () => {
    if (!selectedReservation) return;

    setIsSubmitting(true);
    try {
      const endpoint = responseAction === 'approve' 
        ? `/reservations/${selectedReservation.id}/approve`
        : `/reservations/${selectedReservation.id}/reject`;

      await apiClient.put(endpoint, {
        response: responseMessage || null
      });

      alert(`Reservation ${responseAction}d successfully! The tenant will be notified.`);
      closeResponseModal();
      fetchReservations();
      if (onUpdate) onUpdate(); // Refresh notification count
    } catch (error) {
      console.error(`Error ${responseAction}ing reservation:`, error);
      alert(`Failed to ${responseAction} reservation. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    setIsSubmitting(true);
    try {
      await apiClient.put(`/reservations/${selectedReservation.id}/cancel`, {
        reason: cancelReason || 'Cancelled by owner'
      });

      alert('Reservation cancelled successfully! The tenant will be notified.');
      setShowCancelModal(false);
      fetchReservations();
      if (onUpdate) onUpdate(); // Refresh notification count
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
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

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="reservations-loading">
        <div className="spinner"></div>
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="incoming-reservations">
      <div className="reservations-header">
        <div className="header-title">
          <h2>Incoming Reservations</h2>
          {pendingCount > 0 && (
            <span className="pending-badge">{pendingCount} Pending</span>
          )}
        </div>
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
          <p>When tenants reserve your properties, they'll appear here.</p>
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
                    {reservation.property?.location || 'Location'}
                  </p>
                </div>
                <span className={getStatusClass(reservation.status)}>
                  {reservation.status.toUpperCase()}
                </span>
              </div>

              <div className="tenant-info">
                <h4>Tenant Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <User size={16} />
                    <span>{reservation.tenant?.fullName || 'Tenant'}</span>
                  </div>
                  <div className="info-item">
                    <Mail size={16} />
                    <span>{reservation.tenant?.email || 'N/A'}</span>
                  </div>
                  {reservation.tenant?.phone && (
                    <div className="info-item">
                      <Phone size={16} />
                      <span>{reservation.tenant.phone}</span>
                    </div>
                  )}
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
                <div className="tenant-message">
                  <strong>Tenant's Message:</strong>
                  <p>{reservation.message}</p>
                </div>
              )}

              {reservation.ownerResponse && (
                <div className="owner-response">
                  <strong>Your Response:</strong>
                  <p>{reservation.ownerResponse}</p>
                </div>
              )}

              {reservation.tenantResponse && (
                <div className="tenant-response-display">
                  <strong>Tenant's Response:</strong>
                  <p>{reservation.tenantResponse}</p>
                </div>
              )}

              {reservation.status === 'pending' && (
                <div className="reservation-actions">
                  <button 
                    className="reject-btn"
                    onClick={() => openResponseModal(reservation, 'reject')}
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button 
                    className="approve-btn"
                    onClick={() => openResponseModal(reservation, 'approve')}
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                </div>
              )}

              {(reservation.status === 'approved' || reservation.status === 'confirmed') && (
                <div className="reservation-actions">
                  <button 
                    className="cancel-btn-owner"
                    onClick={() => openCancelModal(reservation)}
                  >
                    <XCircle size={18} />
                    Cancel Reservation
                  </button>
                </div>
              )}

              {(reservation.status === 'cancelled' || reservation.status === 'rejected') && (
                <div className="reservation-actions">
                  <button 
                    className="delete-btn-owner"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    <Ban size={18} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="response-modal-overlay" onClick={closeResponseModal}>
          <div className="response-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {responseAction === 'approve' ? 'Approve' : 'Reject'} Reservation
              </h3>
              <button className="close-btn" onClick={closeResponseModal}>×</button>
            </div>

            <div className="modal-content">
              <div className="reservation-summary">
                <p><strong>Property:</strong> {selectedReservation?.property?.title}</p>
                <p><strong>Tenant:</strong> {selectedReservation?.tenant?.fullName}</p>
                <p><strong>Dates:</strong> {formatDate(selectedReservation?.startDate)} 
                  {selectedReservation?.endDate && ` - ${formatDate(selectedReservation.endDate)}`}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="responseMessage">
                  <MessageSquare size={18} />
                  Message to Tenant (Optional)
                </label>
                <textarea
                  id="responseMessage"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows="4"
                  placeholder={
                    responseAction === 'approve'
                      ? "e.g., Your reservation is approved! Please contact me to discuss move-in details."
                      : "e.g., Sorry, this property is not available for the selected dates."
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={closeResponseModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className={responseAction === 'approve' ? 'approve-btn' : 'reject-btn'}
                onClick={handleResponse}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? `${responseAction === 'approve' ? 'Approving' : 'Rejecting'}...`
                  : `${responseAction === 'approve' ? 'Approve' : 'Reject'} Reservation`
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="response-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="response-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Reservation</h3>
              <button className="close-btn" onClick={() => setShowCancelModal(false)}>×</button>
            </div>

            <div className="modal-content">
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
                  placeholder="Let the tenant know why you're cancelling..."
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
        </div>
      )}
    </div>
  );
};

export default IncomingReservations;
