import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import RecommendationSection from '../components/recommendations/RecommendationSection';
import LayoutContainer from '../components/common/LayoutContainer';
import Card from '../components/ui/Card';
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
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        <div className="pt-6 pb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || user?.username}!
            </h1>
            <p className="text-gray-600 text-base">
              This is your space to turn interests into real connections.
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card>
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-3xl font-bold text-blue-600" aria-label={`${stats.eventsCreated} events created`}>
                        {stats.eventsCreated}
                      </span>
                    </div>
                    <div className="ml-5 flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Events Created
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-3xl font-bold text-green-600" aria-label={`${stats.eventsRSVPd} events RSVP'd`}>
                        {stats.eventsRSVPd}
                      </span>
                    </div>
                    <div className="ml-5 flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Events RSVP'd
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-3xl font-bold text-purple-600" aria-label={`${stats.upcomingRSVPs} upcoming events`}>
                        {stats.upcomingRSVPs}
                      </span>
                    </div>
                    <div className="ml-5 flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Upcoming Events
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
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
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label={`View event: ${event.title}`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-1">
                        {format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {event.eventCategory} • {event.attendees?.length || 0} attendees
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            <div>
              <RecommendationSection limit={5} />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
};

export default Dashboard;
