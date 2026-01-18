import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import { eventService } from '../services/event.service';
import { format } from 'date-fns';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const [userRes, eventsRes] = await Promise.all([
        isOwnProfile ? userService.getProfile() : userService.getUserById(id),
        userService.getUserEvents(id),
      ]);
      setUser(userRes.data.user);
      setEvents(eventsRes.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !user) {
    return <ErrorMessage message={error} />;
  }

  if (!user) {
    return <div className="p-8">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-16 mb-4">
            <img
              src={user.profile_pic || '/default-avatar.png'}
              alt={user.name || user.username}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {isOwnProfile && (
              <Link
                to={`/profile/${id}/edit`}
                className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.name || user.username || 'User'}
          </h1>
          {user.bio && (
            <p className="text-gray-600 mb-4">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            {user.location && (
              <span>Location: {user.location}</span>
            )}
            {user.email && isOwnProfile && (
              <span>Email: {user.email}</span>
            )}
          </div>

          {user.interests && user.interests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Events ({events.length})
            </h2>
            {events.length === 0 ? (
              <p className="text-gray-500">No events created yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <Link
                    key={event._id}
                    to={`/events/${event._id}`}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.attendees?.length || 0} attendees
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
