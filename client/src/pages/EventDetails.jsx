import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, isToday, isTomorrow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/event.service';
import { commentService } from '../services/comment.service';
import RSVPButton from '../components/events/RSVPButton';
import CommentSection from '../components/comments/CommentSection';
import MapComponent from '../components/maps/MapComponent';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

/**
 * Event Details Page - Modern design with hero image, RSVP section, and map
 */
const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvent();
    fetchSimilarEvents();
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

  const fetchSimilarEvents = async () => {
    try {
      if (event) {
        const response = await eventService.getEvents(
          { eventCategory: event.eventCategory, upcoming: true },
          1,
          4
        );
        setSimilarEvents(
          response.data.events?.filter((e) => e._id !== id).slice(0, 3) || []
        );
      }
    } catch (err) {
      console.error('Failed to load similar events:', err);
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
    return (
      <LayoutContainer>
        <div className="text-center py-12">
          <p className="text-gray-500">Event not found</p>
        </div>
      </LayoutContainer>
    );
  }

  const isOwner = isAuthenticated && user?._id === event.hostedBy?._id;
  const eventDate = new Date(event.dateAndTime);
  const isOnline = event.eventLocationType === 'online';
  const attendeeCount = event.attendees?.length || 0;

  const getDateLabel = () => {
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    return format(eventDate, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        {/* Hero Section with Image */}
        <div className="mb-8">
          {event.eventImage ? (
            <div className="w-full h-96 rounded-lg overflow-hidden mb-6">
              <img
                src={event.eventImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-8xl">{event.eventCategory?.[0] || '📅'}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <Card className="p-6 mb-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {event.eventCategory}
                      </span>
                      <span className="text-sm text-gray-600">
                        {isOnline ? 'Online' : 'In Person'}
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-lg text-gray-700">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{getDateLabel()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{format(eventDate, 'h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <Link to={`/events/${id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        isLoading={deleting}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">About this event</h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {event.description}
                  </p>
                </div>

                {/* Location */}
                {!isOnline && event.location && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Location</h2>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 text-lg">
                        {event.location.address && <>{event.location.address}<br /></>}
                        {event.location.city && <>{event.location.city}</>}
                        {event.location.state && <>, {event.location.state}</>}
                        {event.location.zipCode && <> {event.location.zipCode}</>}
                      </p>
                    </div>
                    {event.location.coordinates?.lat && event.location.coordinates?.lng && (
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <MapComponent
                          events={[event]}
                          center={{
                            lat: event.location.coordinates.lat,
                            lng: event.location.coordinates.lng,
                          }}
                          zoom={15}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Host */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Hosted by</h2>
                  <Link
                    to={`/profile/${event.hostedBy?.username || event.hostedBy?._id}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={event.hostedBy?.profile_pic || '/default-avatar.png'}
                      alt={event.hostedBy?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {event.hostedBy?.name || event.hostedBy?.username}
                      </p>
                      <p className="text-gray-600">Event host</p>
                    </div>
                  </Link>
                </div>

                {/* Attendees */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Attendees ({attendeeCount})
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {event.attendees.slice(0, 12).map((attendee) => {
                        const attendeeData = typeof attendee === 'object' ? attendee : null;
                        return (
                          <Link
                            key={attendeeData?._id || attendee}
                            to={`/profile/${attendeeData?.username || attendeeData?._id || attendee}`}
                            className="flex flex-col items-center gap-1"
                            title={attendeeData?.name || 'User'}
                          >
                            <img
                              src={attendeeData?.profile_pic || '/default-avatar.png'}
                              alt={attendeeData?.name || 'User'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:border-blue-500 transition-colors"
                            />
                          </Link>
                        );
                      })}
                      {attendeeCount > 12 && (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                          +{attendeeCount - 12}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Discussion</h2>
                  <CommentSection eventId={id} />
                </div>
              </Card>
            </div>

            {/* Sidebar - RSVP Section */}
            <div className="lg:w-80">
              <Card className="p-6 sticky top-4">
                <RSVPButton event={event} onRSVPChange={handleRSVPChange} />
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-semibold">{attendeeCount} {attendeeCount === 1 ? 'person' : 'people'} going</span>
                    </div>
                    {event.maxAttendees && (
                      <div className="text-sm text-gray-600">
                        {event.maxAttendees - attendeeCount} spots remaining
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Similar Events */}
              {similarEvents.length > 0 && (
                <Card className="p-6 mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Similar events</h3>
                  <div className="space-y-4">
                    {similarEvents.map((similarEvent) => (
                      <Link
                        key={similarEvent._id}
                        to={`/events/${similarEvent._id}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-semibold text-gray-900 line-clamp-2">
                          {similarEvent.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(similarEvent.dateAndTime), 'MMM d, h:mm a')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
};

export default EventDetails;
