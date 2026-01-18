import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/admin.service';
import { format } from 'date-fns';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PrivateRoute from '../components/common/PrivateRoute';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Admin access required');
      setLoading(false);
      return;
    }
    fetchData();
  }, [activeTab, page, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      if (activeTab === 'users') {
        response = await adminService.getUsers(page, 20);
        setUsers(response.data.users || []);
      } else {
        response = await adminService.getEvents(page, 20);
        setEvents(response.data.events || []);
      }
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await adminService.deleteEvent(eventId);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await adminService.deleteComment(commentId);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Admin access required" />
      </div>
    );
  }

  if (loading && users.length === 0 && events.length === 0) {
    return <Loading />;
  }

  return (
    <PrivateRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab('users');
                  setPage(1);
                }}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setActiveTab('events');
                  setPage(1);
                }}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Events
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">All Users ({pagination?.total || 0})</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={user.profile_pic || '/default-avatar.png'}
                                alt={user.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">All Events ({pagination?.total || 0})</h2>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Hosted by: {event.hostedBy?.name || event.hostedBy?.username}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.attendees?.length || 0} attendees
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminPanel;
