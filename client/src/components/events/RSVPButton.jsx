import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/event.service';

const RSVPButton = ({ event, onRSVPChange }) => {
  const { isAuthenticated } = useAuth();
  const [isRSVPd, setIsRSVPd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event && event.attendees) {
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      setIsRSVPd(event.attendees.some((attendee) => {
        const attendeeId = typeof attendee === 'object' ? attendee._id : attendee;
        return attendeeId === userId;
      }));
    }
  }, [event]);

  const handleRSVP = async () => {
    if (!isAuthenticated) {
      setError('Please login to RSVP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isRSVPd) {
        await eventService.cancelRSVP(event._id);
        setIsRSVPd(false);
      } else {
        await eventService.rsvpEvent(event._id);
        setIsRSVPd(true);
      }
      if (onRSVPChange) {
        onRSVPChange();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update RSVP');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
      >
        Login to RSVP
      </button>
    );
  }

  const isFull = event.maxAttendees && event.attendees?.length >= event.maxAttendees;
  const attendeeCount = event.attendees?.length || 0;

  return (
    <div>
      <button
        onClick={handleRSVP}
        disabled={loading || isFull}
        className={`w-full px-4 py-2 rounded-md font-medium ${
          isRSVPd
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : isFull
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-50`}
      >
        {loading
          ? 'Loading...'
          : isRSVPd
          ? 'Cancel RSVP'
          : isFull
          ? 'Event Full'
          : 'RSVP'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-sm text-gray-600">
        {attendeeCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attendees
      </p>
    </div>
  );
};

export default RSVPButton;
