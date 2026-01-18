import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/event.service';
import { commentService } from '../services/comment.service';
import RSVPButton from '../components/events/RSVPButton';
import CommentSection from '../components/comments/CommentSection';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventService.getEventById(id);
      setEvent(response.data.event);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setDeleting(true);
    try {
      await eventService.deleteEvent(id);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const handleRSVPChange = () => {
    fetchEvent();
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !event) {
    return <ErrorMessage message={error} />;
  }

  if (!event) {
    return <div className="p-8">Event not found</div>;
  }

  const isOwner = isAuthenticated && user?._id === event.hostedBy?._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && <ErrorMessage message={error} />}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {event.eventImage && (
          <img
            src={event.eventImage}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {event.eventCategory}
                </span>
                <span>{event.eventLocationType === 'online' ? 'Online' : 'In Person'}</span>
                <span>{format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <Link
                  to={`/events/${id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>

          {event.location && event.eventLocationType === 'in-person' && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-700">
                {event.location.address && <>{event.location.address}<br /></>}
                {event.location.city && <>{event.location.city}</>}
                {event.location.state && <>, {event.location.state}</>}
                {event.location.zipCode && <> {event.location.zipCode}</>}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Hosted By</h2>
            <Link
              to={`/profile/${event.hostedBy?._id}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <img
                src={event.hostedBy?.profile_pic || '/default-avatar.png'}
                alt={event.hostedBy?.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{event.hostedBy?.name || event.hostedBy?.username}</span>
            </Link>
          </div>

          <div className="mb-6">
            <RSVPButton event={event} onRSVPChange={handleRSVPChange} />
          </div>

          {event.attendees && event.attendees.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Attendees ({event.attendees.length})</h2>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((attendee) => {
                  const attendeeData = typeof attendee === 'object' ? attendee : null;
                  return (
                    <Link
                      key={attendeeData?._id || attendee}
                      to={`/profile/${attendeeData?._id || attendee}`}
                      className="flex items-center space-x-2"
                    >
                      <img
                        src={attendeeData?.profile_pic || '/default-avatar.png'}
                        alt={attendeeData?.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <CommentSection eventId={id} />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
