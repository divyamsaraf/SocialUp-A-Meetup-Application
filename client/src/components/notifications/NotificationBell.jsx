import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notification.service';
import NotificationPanel from './NotificationPanel';
import { colors } from '../../theme';
import { icons } from '../../theme';
import { spacing } from '../../theme';

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative focus:outline-none"
        style={{
          padding: spacing[2],
          color: colors.text.secondary,
        }}
        className="hover:opacity-80"
        aria-label="Notifications"
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            width: icons.size.md,
            height: icons.size.md,
            strokeWidth: icons.strokeWidth.normal,
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span 
            className="absolute top-0 right-0 flex items-center justify-center"
            style={{
              height: '1.25rem',
              width: '1.25rem',
              borderRadius: '50%',
              backgroundColor: colors.error[600],
              color: colors.text.inverse,
              fontSize: '0.75rem',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {showPanel && (
        <NotificationPanel
          onClose={() => setShowPanel(false)}
          onNotificationRead={fetchUnreadCount}
        />
      )}
    </div>
  );
};

export default NotificationBell;
