import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NotificationPopup.css';

const NotificationPopup = ({ notifications, onClose, onNavigate, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedTypes, setDismissedTypes] = useState([]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleNotificationClick = (type) => {
    if (onNavigate) {
      onNavigate(type);
    }
    handleClose();
  };

  const handleDismiss = (type, e) => {
    e.stopPropagation(); // Prevent navigation
    setDismissedTypes([...dismissedTypes, type]);
    
    if (onDismiss) {
      onDismiss(type);
    }
    
    // If all notifications are dismissed, close popup
    const remainingNotifications = notifications.filter(
      n => n.count > 0 && !dismissedTypes.includes(n.type) && n.type !== type
    );
    
    if (remainingNotifications.length === 0) {
      setTimeout(handleClose, 300);
    }
  };

  if (!isVisible) return null;

  const visibleNotifications = notifications.filter(
    n => n.count > 0 && !dismissedTypes.includes(n.type)
  );
  
  if (visibleNotifications.length === 0) return null;

  return (
    <div className="notification-popup-overlay" onClick={handleClose}>
      <div className={`notification-popup ${isVisible ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="notification-popup-header">
          <div className="notification-popup-title">
            <Bell size={24} />
            <h3>You have new notifications!</h3>
          </div>
          <button className="notification-popup-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="notification-popup-content">
          {visibleNotifications.map((notification, index) => (
            <div
              key={index}
              className="notification-item"
              onClick={() => handleNotificationClick(notification.type)}
            >
              <div className={`notification-item-icon ${notification.type}`}>
                {notification.icon}
              </div>
              <div className="notification-item-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
              </div>
              <div className="notification-item-actions">
                <div className="notification-item-badge">
                  {notification.count}
                </div>
                <button
                  className="notification-item-dismiss"
                  onClick={(e) => handleDismiss(notification.type, e)}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="notification-popup-footer">
          <button className="notification-popup-btn" onClick={handleClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
