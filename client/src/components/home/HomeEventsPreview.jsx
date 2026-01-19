import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import EventCard from '../events/EventCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

const HomeEventsPreview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents({}, 1, 3);
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  if (events.length === 0) {
    return (
      <EmptyState
        icon="🗓️"
        title="No upcoming events yet"
        message="Start one and bring people together around what you love."
        actionLabel="Create an event"
        actionHref="/events/create"
      />
    );
  }

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming events</h2>
          <p className="text-gray-600 text-sm">See what’s happening soon—online or in person.</p>
        </div>
        <Link to="/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all events
        </Link>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event._id} className="w-full">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeEventsPreview;
