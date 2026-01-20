import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/event.service';
import Button from '../ui/Button';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';

const RSVPButton = ({ event, onRSVPChange }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      navigate('/login', { state: { from: location.pathname } });
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
      <Button
        onClick={() => navigate('/login', { state: { from: location.pathname } })}
        fullWidth
        variant="secondary"
      >
        Login to RSVP
      </Button>
    );
  }

  const isFull = event.maxAttendees && event.attendees?.length >= event.maxAttendees;
  const attendeeCount = event.attendees?.length || 0;

  return (
    <div>
      <Button
        onClick={handleRSVP}
        disabled={loading || isFull}
        isLoading={loading}
        fullWidth
        variant={isRSVPd ? 'danger' : isFull ? 'secondary' : 'primary'}
      >
        {isRSVPd ? 'Cancel RSVP' : isFull ? 'Event Full' : 'RSVP'}
      </Button>
      {error && (
        <p 
          className="mt-2"
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.error[600],
            marginTop: spacing[2],
          }}
        >
          {error}
        </p>
      )}
      <p 
        className="mt-2"
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
          marginTop: spacing[2],
        }}
      >
        {attendeeCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attendees
      </p>
    </div>
  );
};

export default RSVPButton;
