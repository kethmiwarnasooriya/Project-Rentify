import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, removing: true } : n));
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  }, []);

  const showNotification = useCallback((type, title, message) => {
    const id = Date.now();
    const newNotification = { id, type, title, message };
    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <>
      <style>{`
        /* Notification Container */
        .notification-container {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 420px;
        }

        /* Notification Toast with EPIC animations */
        .notification {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border-radius: 50px;
          padding: 1.5rem 2rem;
          box-shadow: var(--shadow);
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          animation: epicEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
          transform-origin: top right;
        }

        @keyframes epicEntry {
          0% {
            transform: translateX(500px) rotateZ(20deg) scale(0.8);
            opacity: 0;
          }
          60% {
            transform: translateX(-10px) rotateZ(-2deg) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotateZ(0deg) scale(1);
            opacity: 1;
          }
        }

        .notification::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
          pointer-events: none;
        }

        /* Animated gradient border */
        .notification::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, currentColor, transparent, currentColor);
          border-radius: 50px;
          z-index: -1;
          animation: rotateBorder 3s linear infinite;
          opacity: 0.6;
        }

        @keyframes rotateBorder {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .notification.removing {
          animation: epicExit 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }

        @keyframes epicExit {
          0% {
            transform: translateX(0) rotateZ(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(500px) rotateZ(15deg) scale(0.7);
            opacity: 0;
          }
        }

        .notification.success {
          color: var(--success-color, #4A9D7C);
          box-shadow: 0 10px 40px var(--success-glow, rgba(74, 157, 124, 0.4)), 0 0 0 1px var(--success-color, #4A9D7C);
        }

        .notification.error {
          color: var(--error-color, #C85A54);
          box-shadow: 0 10px 40px var(--error-glow, rgba(200, 90, 84, 0.4)), 0 0 0 1px var(--error-color, #C85A54);
        }

        .notification.warning {
          color: var(--warning-color, #D4A574);
          box-shadow: 0 10px 40px var(--warning-glow, rgba(212, 165, 116, 0.4)), 0 0 0 1px var(--warning-color, #D4A574);
        }

        .notification.info {
          color: var(--info-color, #668cb4);
          box-shadow: 0 10px 40px var(--info-glow, rgba(102, 140, 180, 0.4)), 0 0 0 1px var(--info-color, #668cb4);
        }

        .notification-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          animation: iconPulse 2s ease-in-out infinite;
          filter: drop-shadow(0 0 8px currentColor);
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .notification.success .notification-icon {
          color: var(--success-color, #4A9D7C);
          animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(0.8) rotate(-10deg);
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          75% {
            transform: scale(0.9) rotate(-5deg);
          }
        }

        .notification.error .notification-icon {
          color: var(--error-color, #C85A54);
          animation: iconShake 0.5s ease-in-out;
        }

        @keyframes iconShake {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-5px);
          }
          40%, 80% {
            transform: translateX(5px);
          }
        }

        .notification.warning .notification-icon {
          color: var(--warning-color, #D4A574);
          animation: iconWobble 0.8s ease-in-out;
        }

        @keyframes iconWobble {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg);
          }
          75% {
            transform: rotate(15deg);
          }
        }

        .notification.info .notification-icon {
          color: var(--info-color, #668cb4);
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.4rem;
          color: var(--text-primary, #1F2E3D);
          animation: textSlideIn 0.5s ease-out 0.2s backwards;
        }

        @keyframes textSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .notification-message {
          font-size: 0.9rem;
          color: var(--text-secondary, #6B7C8C);
          line-height: 1.5;
          animation: textSlideIn 0.5s ease-out 0.3s backwards;
        }

        .notification-close {
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          cursor: pointer;
          color: var(--text-secondary, #6B7C8C);
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        .notification-close:hover {
          background: rgba(0, 0, 0, 0.2);
          color: var(--text-primary, #1F2E3D);
          transform: rotate(90deg) scale(1.1);
        }

        /* Sparkle effects */
        .sparkle-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: currentColor;
          border-radius: 50%;
          animation: sparkleFloat 2s ease-out forwards;
          opacity: 0;
        }

        @keyframes sparkleFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0);
          }
        }

        .sparkle:nth-child(1) { left: 20%; animation-delay: 0s; }
        .sparkle:nth-child(2) { left: 40%; animation-delay: 0.2s; }
        .sparkle:nth-child(3) { left: 60%; animation-delay: 0.4s; }
        .sparkle:nth-child(4) { left: 80%; animation-delay: 0.6s; }

        /* Progress bar with gradient */
        .notification-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, currentColor, transparent);
          animation: progress 5s linear;
          border-radius: 0 0 0 50px;
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .notification.success .notification-progress {
          color: var(--success-color, #4A9D7C);
          box-shadow: 0 0 10px currentColor;
        }

        .notification.error .notification-progress {
          color: var(--error-color, #C85A54);
          box-shadow: 0 0 10px currentColor;
        }

        .notification.warning .notification-progress {
          color: var(--warning-color, #D4A574);
          box-shadow: 0 0 10px currentColor;
        }

        .notification.info .notification-progress {
          color: var(--info-color, #668cb4);
          box-shadow: 0 0 10px currentColor;
        }

        @media (max-width: 768px) {
          .notification-container {
            right: 1rem;
            left: 1rem;
            max-width: none;
          }
        }
      `}</style>

      <div className="notification-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification ${notification.type} ${notification.removing ? 'removing' : ''}`}
          >
            <div className="sparkle-container">
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
            </div>
            <div className="notification-icon">
              {notification.type === 'success' && <CheckCircle size={28} />}
              {notification.type === 'error' && <XCircle size={28} />}
              {notification.type === 'warning' && <AlertCircle size={28} />}
              {notification.type === 'info' && <Info size={28} />}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              <X size={18} />
            </button>
            <div className="notification-progress"></div>
          </div>
        ))}
      </div>
    </>
  );
};
