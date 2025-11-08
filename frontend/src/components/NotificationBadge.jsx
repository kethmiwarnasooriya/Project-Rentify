import React from 'react';
import './NotificationBadge.css';

const NotificationBadge = ({ count, size = 'medium' }) => {
  if (!count || count === 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span className={`notification-badge ${size}`}>
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
