import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notification.service';
import Loading from '../common/Loading';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { zIndex } from '../../theme';

const NotificationPanel = ({ onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await notificationService.getNotifications(1, 20);
      setNotifications(response.data.notifications || []);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.payload?.eventId) {
      return `/events/${notification.payload.eventId}`;
    }
    if (notification.payload?.groupId) {
      return `/groups/${notification.payload.groupId}`;
    }
    return '#';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'rsvp_confirmation':
        return '✓';
      case 'event_reminder':
        return '⏰';
      case 'event_update':
        return '✏️';
      case 'event_cancellation':
        return '❌';
      case 'group_invite':
        return '👥';
      case 'new_comment':
        return '💬';
      case 'event_created':
        return '🎉';
      default:
        return '🔔';
    }
  };

  return (
    <div 
      className="absolute right-0 flex flex-col overflow-hidden"
      style={{
        marginTop: spacing[2],
        width: '24rem',
        backgroundColor: colors.surface.default,
        borderRadius: borderRadius.lg,
        boxShadow: shadows.xl,
        border: `1px solid ${colors.border.default}`,
        zIndex: zIndex.modal,
        maxHeight: '24rem',
      }}
    >
      <div 
        className="flex items-center justify-between"
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <h3 
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
          }}
        >
          Notifications
        </h3>
        <div className="flex" style={{ gap: spacing[2] }}>
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.primary[600],
              }}
              className="hover:opacity-80"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              color: colors.text.tertiary,
            }}
            className="hover:opacity-80"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div style={{ padding: spacing[4] }}>
            <Loading />
          </div>
        ) : error ? (
          <div 
            style={{
              padding: spacing[4],
              color: colors.error[600],
            }}
          >
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div 
            style={{
              padding: spacing[4],
              textAlign: 'center',
              color: colors.text.tertiary,
            }}
          >
            No notifications
          </div>
        ) : (
          <div style={{ borderTop: `1px solid ${colors.border.light}` }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="hover:opacity-90"
                style={{
                  padding: spacing[4],
                  backgroundColor: !notification.read ? colors.primary[50] : 'transparent',
                  borderBottom: `1px solid ${colors.border.light}`,
                }}
              >
                <div className="flex items-start">
                  <div 
                    className="flex-shrink-0"
                    style={{
                      fontSize: typography.fontSize['2xl'],
                      marginRight: spacing[3],
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.read) {
                          handleMarkAsRead(notification._id);
                        }
                        onClose();
                      }}
                      className="block"
                    >
                      <p 
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.text.primary,
                        }}
                      >
                        {notification.title}
                      </p>
                      <p 
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginTop: spacing[1],
                        }}
                      >
                        {notification.message}
                      </p>
                      <p 
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.tertiary,
                          marginTop: spacing[1],
                        }}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </Link>
                  </div>
                  <div className="flex-shrink-0" style={{ marginLeft: spacing[2] }}>
                    {!notification.read && (
                      <div 
                        style={{
                          height: '0.5rem',
                          width: '0.5rem',
                          backgroundColor: colors.primary[600],
                          borderRadius: '50%',
                        }}
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(notification._id);
                      }}
                      style={{
                        marginLeft: spacing[2],
                        color: colors.text.tertiary,
                      }}
                      className="hover:text-red-600"
                      aria-label="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
