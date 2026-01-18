import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  return (
    <Link
      to={`/events/${event._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {event.eventImage && (
        <img
          src={event.eventImage}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {event.eventCategory}
          </span>
          <span className="text-sm text-gray-500">
            {event.eventLocationType === 'online' ? 'Online' : 'In Person'}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{format(new Date(event.dateAndTime), 'MMM d, yyyy h:mm a')}</span>
          <span>{event.attendees?.length || 0} attendees</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
