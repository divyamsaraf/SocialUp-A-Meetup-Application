import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notification.service';
import Loading from '../common/Loading';

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
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <div className="flex space-x-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-4">
            <Loading />
          </div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-2xl mr-3">
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
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </Link>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(notification._id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-600"
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
