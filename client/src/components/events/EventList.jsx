import { useState, useEffect } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { eventService } from '../../services/event.service';
import EventCard from './EventCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

const EventList = ({ filters = {} }) => {
  const { selectedLocation } = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [page, filters, selectedLocation]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const locationFilters = {};
      if (selectedLocation) {
        if (selectedLocation.lat && selectedLocation.lng) {
          locationFilters.lat = selectedLocation.lat;
          locationFilters.lng = selectedLocation.lng;
          locationFilters.radiusMiles = 25;
        } else if (selectedLocation.city) {
          locationFilters.city = selectedLocation.city;
          if (selectedLocation.state) locationFilters.state = selectedLocation.state;
        } else if (selectedLocation.zipCode) {
          locationFilters.zipCode = selectedLocation.zipCode;
        }
      }
      
      const combinedFilters = { ...filters, ...locationFilters };
      const response = await eventService.getEvents(combinedFilters, page, 12);
      setEvents(response.data.events || []);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading && events.length === 0) {
    return <Loading />;
  }

  if (error && events.length === 0) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
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

      {events.length === 0 && !loading && (
        <EmptyState
          icon="🗓️"
          title="No events found"
          message="No events match your filters. Try expanding your search or create one."
          actionLabel="Create an event"
          actionHref="/events/create"
        />
      )}
    </div>
  );
};

export default EventList;
