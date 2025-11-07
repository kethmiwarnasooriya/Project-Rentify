import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Mail, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import './UserNotifications.css';

const UserNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserMessages();
  }, []);

  const markRepliesAsSeen = () => {
    // Update the last check timestamp only after user actually views the notifications
    localStorage.setItem('lastReplyCheck', Date.now().toString());
  };

  const fetchUserMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users/me/messages');
      const fetchedMessages = response.data || [];
      setMessages(fetchedMessages);
      
      // Mark replies as seen after fetching (user has now seen them)
      markRepliesAsSeen();
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'replied':
        return <CheckCircle size={20} className="status-icon replied" />;
      case 'read':
        return <Mail size={20} className="status-icon read" />;
      default:
        return <Clock size={20} className="status-icon pending" />;
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="user-notifications">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-notifications">
      <div className="notifications-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>
          <Bell size={28} />
          My Messages & Notifications
        </h1>
      </div>

      <div className="notifications-content">
        {messages.length === 0 ? (
          <div className="no-messages">
            <Mail size={48} />
            <h3>No Messages Yet</h3>
            <p>You haven't sent any messages to the admin yet.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => {
              const lastChecked = localStorage.getItem('lastReplyCheck') || '0';
              const isNewReply = message.reply && 
                message.repliedAt && 
                new Date(message.repliedAt).getTime() > parseInt(lastChecked);
              
              return (
              <div
                key={message.id}
                className={`message-card ${message.status} ${isNewReply ? 'new-reply' : ''}`}
                onClick={() => openMessageModal(message)}
              >
                <div className="message-card-header">
                  <div className="message-subject">
                    {getStatusIcon(message.status)}
                    <h3>{message.subject}</h3>
                  </div>
                  <span className={`status-badge ${message.status}`}>
                    {message.status.toUpperCase()}
                  </span>
                </div>
                <div className="message-preview">
                  {message.message.substring(0, 100)}
                  {message.message.length > 100 && '...'}
                </div>
                <div className="message-meta">
                  <span>Sent: {formatDate(message.createdAt)}</span>
                  {message.reply && (
                    <span className="has-reply">
                      ✓ Admin Replied
                      {isNewReply && <span className="new-badge">NEW</span>}
                    </span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={closeMessageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Details</h2>
              <button onClick={closeMessageModal} className="close-button">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <label>Subject:</label>
                <p>{selectedMessage.subject}</p>
              </div>

              <div className="detail-section">
                <label>Your Message:</label>
                <div className="message-box user-message">
                  {selectedMessage.message}
                </div>
                <span className="message-date">
                  Sent on {formatDate(selectedMessage.createdAt)}
                </span>
              </div>

              {selectedMessage.reply ? (
                <div className="detail-section reply-section">
                  <label>Admin Reply:</label>
                  <div className="message-box admin-reply">
                    {selectedMessage.reply}
                  </div>
                  <span className="message-date">
                    Replied on {formatDate(selectedMessage.repliedAt)}
                  </span>
                </div>
              ) : (
                <div className="detail-section pending-section">
                  <Clock size={24} />
                  <p>Waiting for admin response...</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeMessageModal} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
