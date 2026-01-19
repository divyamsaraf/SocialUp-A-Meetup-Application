import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const isOnline = event.eventLocationType === 'online';
  const city = event.location?.city;
  const state = event.location?.state;
  const distanceMiles = event.distanceMiles;
  const hostName = event.host?.name || event.createdBy?.name || 'Host';

  // Format date like "Sat, Feb 7 · 9:00 AM PST"
  const formattedDate = format(new Date(event.dateAndTime), 'EEE, MMM d');
  const formattedTime = format(new Date(event.dateAndTime), 'h:mm a');
  // Get timezone abbreviation (e.g., PST, EST)
  const dateObj = new Date(event.dateAndTime);
  const timeZoneStr = dateObj.toLocaleTimeString('en-us', { timeZoneName: 'short' });
  const timeZone = timeZoneStr.split(' ').pop() || '';

  return (
    <Link
      to={`/events/${event._id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 hover:border-gray-300"
    >
      <div className="p-4 h-full flex flex-col">
        {/* Free badge - top left */}
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
            Free
          </span>
          {isOnline && (
            <span className="text-xs text-gray-500">Online</span>
          )}
        </div>

        {/* Event title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {event.title}
        </h3>

        {/* Date & time */}
        <div className="text-sm text-gray-600 mb-2">
          {formattedDate} · {formattedTime} {timeZone}
        </div>

        {/* Location or Online */}
        {isOnline ? (
          <div className="text-sm text-gray-600 mb-3">Online event</div>
        ) : (
          <div className="text-sm text-gray-600 mb-3">
            {city && state ? `${city}, ${state}` : city || state || 'Location TBD'}
            {distanceMiles != null && (
              <span className="text-gray-500"> · {distanceMiles} mi</span>
            )}
          </div>
        )}

        {/* Host/Group */}
        <div className="text-sm text-gray-500 mb-3">
          by {hostName}
        </div>

        {/* Attendee count */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {event.attendees?.length || 0} going
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
