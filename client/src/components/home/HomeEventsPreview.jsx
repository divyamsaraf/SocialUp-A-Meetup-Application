import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../../contexts/LocationContext';
import { eventService } from '../../services/event.service';
import EventCard from '../events/EventCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { icons } from '../../theme';

const HomeEventsPreview = ({ onLocationEdit }) => {
  const { selectedLocation, loading: locationLoading } = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const filters = { upcoming: true };
      
      if (selectedLocation) {
        if (selectedLocation.lat && selectedLocation.lng) {
          filters.lat = selectedLocation.lat;
          filters.lng = selectedLocation.lng;
          filters.radiusMiles = 25;
        } else if (selectedLocation.city) {
          filters.city = selectedLocation.city;
          if (selectedLocation.state) filters.state = selectedLocation.state;
        } else if (selectedLocation.zipCode) {
          filters.zipCode = selectedLocation.zipCode;
        }
      }
      
      const response = await eventService.getEvents(filters, 1, 10);
      const eventList = response?.events || response?.data?.events || [];
      setEvents(Array.isArray(eventList) ? eventList : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setEvents([]);
        setError('');
        return;
      }
      console.error('Error fetching events:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load events';
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!locationLoading) {
      fetchEvents();
    }
  }, [locationLoading, fetchEvents]);

  const locationLabel = selectedLocation?.label || 'you';

  if (locationLoading || loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const handleLocationClick = () => {
    onLocationEdit?.();
  };

  if (events.length === 0) {
    return (
      <section style={{ marginTop: spacing[16] }}>
        <div className="flex items-baseline" style={{ gap: spacing[2], marginBottom: spacing[6] }}>
          <span 
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
              fontWeight: typography.fontWeight.normal,
            }}
          >
            Events near
          </span>
          <button
            onClick={handleLocationClick}
            className="group flex items-center hover:opacity-80"
            style={{ gap: spacing[1] }}
          >
            <span 
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {locationLabel}
            </span>
            <svg 
              className="opacity-60 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{
                width: icons.size.sm,
                height: icons.size.sm,
                strokeWidth: icons.strokeWidth.normal,
                color: colors.primary[600],
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <EmptyState
          icon="🗓️"
          title="No upcoming events yet"
          message="Start one and bring people together around what you love."
          actionLabel="Create an event"
          actionHref="/events/create"
        />
      </section>
    );
  }

  return (
    <section style={{ marginTop: spacing[16] }}>
      <div className="flex items-baseline justify-between" style={{ marginBottom: spacing[6] }}>
        <div className="flex items-baseline" style={{ gap: spacing[2] }}>
          <span 
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
              fontWeight: typography.fontWeight.normal,
            }}
          >
            Events near
          </span>
          <button
            onClick={handleLocationClick}
            className="group flex items-center hover:opacity-80"
            style={{ gap: spacing[1] }}
          >
            <span 
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {locationLabel}
            </span>
            <svg 
              className="opacity-60 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{
                width: icons.size.sm,
                height: icons.size.sm,
                strokeWidth: icons.strokeWidth.normal,
                color: colors.primary[600],
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <Link 
          to="/events" 
          className="flex items-center group hover:opacity-80"
          style={{
            color: colors.primary[600],
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            gap: spacing[1],
          }}
        >
          See all events
          <svg 
            className="transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              width: icons.size.sm,
              height: icons.size.sm,
              strokeWidth: icons.strokeWidth.normal,
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: spacing[4] }}>
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default HomeEventsPreview;
