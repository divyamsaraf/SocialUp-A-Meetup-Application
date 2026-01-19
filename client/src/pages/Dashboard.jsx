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
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { shadows } from '../theme';
import { borderRadius } from '../theme';

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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <LayoutContainer>
        <div 
          style={{
            paddingTop: spacing[6],
            paddingBottom: spacing[8],
          }}
        >
          <div style={{ marginBottom: spacing[6] }}>
            <h1 
              style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing[2],
              }}
            >
              Welcome back, {user?.name || user?.username}!
            </h1>
            <p 
              style={{
                color: colors.text.secondary,
                fontSize: typography.fontSize.base,
              }}
            >
              This is your space to turn interests into real connections.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: spacing[6] }}>
              <ErrorMessage message={error} />
            </div>
          )}

          {stats && (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{
                gap: spacing[6],
                marginBottom: spacing[8],
              }}
            >
              <Card>
                <div style={{ padding: spacing[5] }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span 
                        aria-label={`${stats.eventsCreated} events created`}
                        style={{
                          fontSize: typography.fontSize['3xl'],
                          fontWeight: typography.fontWeight.bold,
                          color: colors.primary[600],
                        }}
                      >
                        {stats.eventsCreated}
                      </span>
                    </div>
                    <div className="flex-1" style={{ marginLeft: spacing[5] }}>
                      <p 
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.text.secondary,
                        }}
                      >
                        Events Created
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ padding: spacing[5] }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span 
                        aria-label={`${stats.eventsRSVPd} events RSVP'd`}
                        style={{
                          fontSize: typography.fontSize['3xl'],
                          fontWeight: typography.fontWeight.bold,
                          color: colors.success[600],
                        }}
                      >
                        {stats.eventsRSVPd}
                      </span>
                    </div>
                    <div className="flex-1" style={{ marginLeft: spacing[5] }}>
                      <p 
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.text.secondary,
                        }}
                      >
                        Events RSVP'd
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ padding: spacing[5] }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span 
                        aria-label={`${stats.upcomingRSVPs} upcoming events`}
                        style={{
                          fontSize: typography.fontSize['3xl'],
                          fontWeight: typography.fontWeight.bold,
                          color: colors.secondary[600],
                        }}
                      >
                        {stats.upcomingRSVPs}
                      </span>
                    </div>
                    <div className="flex-1" style={{ marginLeft: spacing[5] }}>
                      <p 
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.text.secondary,
                        }}
                      >
                        Upcoming Events
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div 
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{
              gap: spacing[8],
            }}
          >
            <Card style={{ padding: spacing[6] }}>
              <h2 
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing[4],
                }}
              >
                Upcoming Events
              </h2>
              {upcomingEvents.length === 0 ? (
                <p 
                  style={{
                    color: colors.text.secondary,
                  }}
                >
                  No upcoming events yet — find one that matches your interests.
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="block transition-colors"
                      style={{
                        padding: spacing[4],
                        backgroundColor: colors.background.tertiary,
                        borderRadius: borderRadius.lg,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surface.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.background.tertiary;
                      }}
                      aria-label={`View event: ${event.title}`}
                    >
                      <h3 
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing[1],
                        }}
                      >
                        {event.title}
                      </h3>
                      <p 
                        style={{
                          color: colors.text.secondary,
                          fontSize: typography.fontSize.sm,
                          marginBottom: spacing[1],
                        }}
                      >
                        {format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}
                      </p>
                      <p 
                        style={{
                          color: colors.text.tertiary,
                          fontSize: typography.fontSize.xs,
                        }}
                      >
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
