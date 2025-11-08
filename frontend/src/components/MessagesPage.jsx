import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, User, Clock } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import ChatBox from './ChatBox';
import './MessagesPage.css';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/messages/conversations');
      // Transform backend DTO to frontend format
      const transformed = (response.data || []).map(conv => ({
        otherUser: {
          id: conv.userId,
          username: conv.username,
          email: conv.email
        },
        property: conv.propertyId ? {
          id: conv.propertyId,
          title: conv.propertyTitle
        } : null,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCount
      }));
      setConversations(transformed);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (conversation) => {
    setSelectedUser(conversation.otherUser);
    setSelectedProperty(conversation.property);
    setShowChatBox(true);
  };

  const closeChat = () => {
    setShowChatBox(false);
    setSelectedUser(null);
    setSelectedProperty(null);
    fetchConversations(); // Refresh to update last message
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.property?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h2><MessageCircle size={28} /> Messages</h2>
        <div className="search-messages">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="conversations-list">
        {loading ? (
          <div className="loading-state">
            <MessageCircle size={48} />
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircle size={64} />
            <h3>No messages yet</h3>
            <p>{searchTerm ? 'No conversations match your search' : 'Start a conversation by contacting a property owner'}</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.otherUser.id}
              className={`conversation-item ${conv.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => openChat(conv)}
            >
              <div className="conversation-avatar">
                <User size={24} />
              </div>
              <div className="conversation-details">
                <div className="conversation-header">
                  <h4>{conv.otherUser.username}</h4>
                  <span className="conversation-time">
                    <Clock size={14} />
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                {conv.property && (
                  <p className="conversation-property">{conv.property.title}</p>
                )}
                <p className="conversation-preview">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="unread-badge">{conv.unreadCount}</div>
              )}
            </div>
          ))
        )}
      </div>

      {showChatBox && selectedUser && (
        <ChatBox
          otherUser={selectedUser}
          propertyId={selectedProperty?.id}
          propertyTitle={selectedProperty?.title}
          isOpen={showChatBox}
          onClose={closeChat}
        />
      )}
    </div>
  );
};

export default MessagesPage;
