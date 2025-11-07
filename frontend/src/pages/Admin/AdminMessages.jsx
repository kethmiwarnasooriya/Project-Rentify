import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import performAdminLogout from '../../utils/adminLogout';
import './AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setSelectedStatus(statusParam);
    }
    console.log('AdminMessages component mounted, fetching messages...');
    fetchMessages();
  }, [searchParams]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin messages...');
      const statusParam = searchParams.get('status');
      let response;
      
      if (statusParam && statusParam !== 'all') {
        console.log(`Fetching messages with status: ${statusParam}`);
        response = await apiClient.get(`/admin/messages/status/${statusParam}`);
        console.log('Messages by status response:', response.data);
        setMessages(Array.isArray(response.data) ? response.data : []);
      } else {
        console.log('Fetching all messages');
        response = await apiClient.get('/admin/messages');
        console.log('All messages response:', response.data);
        const data = response.data.content || response.data;
        console.log('Processed messages data:', data);
        setMessages(Array.isArray(data) ? data : []);
      }
      console.log('Messages set to state:', Array.isArray(response.data) ? response.data : (response.data.content || response.data));
    } catch (error) {
      console.error('Error fetching messages:', error);
      console.error('Error details:', error.response);
      setMessages([]); // Ensure messages is always an array
      if (error.response?.status === 403) {
        console.log('Access denied, redirecting to admin login');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === 'all') {
      navigate('/admin/messages');
    } else {
      navigate(`/admin/messages?status=${status}`);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      await apiClient.put(`/admin/messages/${messageId}/status?status=${newStatus}`);
      fetchMessages(); // Refresh the list
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'read': return 'status-read';
      case 'replied': return 'status-replied';
      default: return 'status-default';
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      updateMessageStatus(message.id, 'read');
    }
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
    setReplyText('');
    setIsReplying(false);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    if (!selectedMessage || !selectedMessage.id) {
      alert('Error: No message selected');
      return;
    }

    setIsReplying(true);
    try {
      console.log('Sending reply to message ID:', selectedMessage.id);
      console.log('Reply text:', replyText);
      
      const response = await apiClient.post(`/admin/messages/${selectedMessage.id}/reply`, {
        reply: replyText
      });
      
      console.log('Reply sent successfully:', response.data);
      alert('Reply sent successfully! The user will see it in their notifications.');
      
      // Refresh messages to show updated status
      await fetchMessages();
      closeMessageModal();
    } catch (error) {
      console.error('Error sending reply:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMsg = 'Failed to send reply. ';
      
      if (error.response?.status === 403) {
        errorMsg += 'Access denied. Please login as admin again.';
      } else if (error.response?.status === 404) {
        errorMsg += 'Message not found.';
      } else if (error.response?.status === 400) {
        errorMsg += 'Invalid reply data.';
      } else if (error.response?.data?.message) {
        errorMsg += error.response.data.message;
      } else if (error.message) {
        errorMsg += error.message;
      } else {
        errorMsg += 'Please check console for details.';
      }
      
      alert(errorMsg);
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading messages...</div>;
  }

  return (
    <div className="admin-messages">
      <div className="admin-header">
        <h1>Message Management</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="back-btn">
            Back to Dashboard
          </button>
          <button onClick={performAdminLogout} className="logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-buttons">
          <button 
            className={selectedStatus === 'all' ? 'active' : ''}
            onClick={() => handleStatusFilter('all')}
          >
            All Messages ({messages.length})
          </button>
          <button 
            className={selectedStatus === 'new' ? 'active' : ''}
            onClick={() => handleStatusFilter('new')}
          >
            New
          </button>
          <button 
            className={selectedStatus === 'read' ? 'active' : ''}
            onClick={() => handleStatusFilter('read')}
          >
            Read
          </button>
          <button 
            className={selectedStatus === 'replied' ? 'active' : ''}
            onClick={() => handleStatusFilter('replied')}
          >
            Replied
          </button>
        </div>
      </div>

      <div className="messages-table-container">
        <table className="messages-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(message => (
              <tr key={message.id} className={message.status === 'new' ? 'unread' : ''}>
                <td>{message.id}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td className="subject-cell">
                  <span className="subject-text">{message.subject}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(message.status)}`}>
                    {message.status.toUpperCase()}
                  </span>
                </td>
                <td>{formatDate(message.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => openMessageModal(message)}
                      className="action-btn view-message"
                    >
                      {message.status === 'replied' ? 'View' : 'Reply'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {messages.length === 0 && (
        <div className="no-messages">
          No messages found for the selected filter.
        </div>
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <div className="message-modal-overlay" onClick={closeMessageModal}>
          <div className="message-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Details</h2>
              <button onClick={closeMessageModal} className="close-btn">&times;</button>
            </div>
            <div className="modal-content">
              <div className="message-info">
                <div className="info-row">
                  <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                </div>
                <div className="info-row">
                  <strong>Subject:</strong> {selectedMessage.subject}
                </div>
                <div className="info-row">
                  <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
                </div>
                <div className="info-row">
                  <strong>Status:</strong> 
                  <span className={`status-badge ${getStatusBadgeClass(selectedMessage.status)}`}>
                    {selectedMessage.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="message-body">
                <strong>Message:</strong>
                <div className="message-text">{selectedMessage.message}</div>
              </div>

              {selectedMessage.reply ? (
                <div className="reply-section">
                  <strong>Your Reply:</strong>
                  <div className="reply-text">{selectedMessage.reply}</div>
                  <div className="reply-date">
                    Replied on: {formatDate(selectedMessage.repliedAt)}
                  </div>
                </div>
              ) : (
                <div className="reply-form">
                  <strong>Send Reply to User:</strong>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here... The user will receive this in their notifications."
                    rows="5"
                    className="reply-textarea"
                    autoFocus
                  />
                  <div className="reply-hint">
                    💡 Tip: The user will be notified and can view your reply in their notifications page.
                  </div>
                </div>
              )}

              <div className="modal-actions">
                {selectedMessage.status !== 'replied' ? (
                  <>
                    <button 
                      onClick={closeMessageModal}
                      className="action-btn cancel-btn"
                      disabled={isReplying}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReplySubmit}
                      className="action-btn send-reply"
                      disabled={isReplying || !replyText.trim()}
                    >
                      {isReplying ? 'Sending Reply...' : 'Send Reply'}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={closeMessageModal}
                    className="action-btn close-modal"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;