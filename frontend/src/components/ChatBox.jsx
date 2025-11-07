import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import './ChatBox.css';

const ChatBox = ({ otherUser, propertyId, propertyTitle, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUsername = sessionStorage.getItem('username');

  useEffect(() => {
    if (isOpen && otherUser) {
      fetchMessages();
      markAsRead();
    }
  }, [isOpen, otherUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/messages/conversation/${otherUser.id}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await apiClient.put(`/messages/read/${otherUser.id}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await apiClient.post('/messages', {
        receiverId: otherUser.id,
        propertyId: propertyId || null,
        content: newMessage.trim()
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="chatbox-overlay" onClick={onClose}>
      <div className="chatbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="chatbox-header">
          <div className="chat-user-info">
            <MessageCircle size={24} />
            <div>
              <h3>{otherUser.username}</h3>
              {propertyTitle && <p className="property-context">About: {propertyTitle}</p>}
            </div>
          </div>
          <button className="close-chat-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="chatbox-messages">
          {loading ? (
            <div className="loading-messages">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <MessageCircle size={48} />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender.username === currentUsername ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <p>{msg.content}</p>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbox-input" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !newMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
