import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import RecommendationSection from '../components/recommendations/RecommendationSection';
import api from '../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [feedEvents, setFeedEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [upcomingRes, feedRes, statsRes] = await Promise.all([
          api.get('/dashboard/upcoming'),
          api.get('/dashboard/feed'),
          api.get('/dashboard/stats'),
        ]);

        setUpcomingEvents(upcomingRes.data.data.events || []);
        setFeedEvents(feedRes.data.data.events || []);
        setStats(statsRes.data.data.stats || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.username}!
        </h1>
        <p className="text-gray-700 mt-1">
          This is your space to turn interests into real connections.
        </p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl font-bold text-blue-600">
                    {stats.eventsCreated}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Events Created
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl font-bold text-green-600">
                    {stats.eventsRSVPd}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Events RSVP'd
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl font-bold text-purple-600">
                    {stats.upcomingRSVPs}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming Events
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">
              No upcoming events yet — find one that matches your interests.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="block bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {event.eventCategory} • {event.attendees?.length || 0} attendees
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <RecommendationSection limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
