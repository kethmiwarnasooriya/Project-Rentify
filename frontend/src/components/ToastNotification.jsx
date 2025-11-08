import React, { useEffect } from 'react';
import { X, MessageCircle, Calendar, CheckCircle, XCircle } from 'lucide-react';
import './ToastNotification.css';

const ToastNotification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'message':
        return <MessageCircle size={20} />;
      case 'reservation':
        return <Calendar size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      default:
        return <MessageCircle size={20} />;
    }
  };

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default ToastNotification;
