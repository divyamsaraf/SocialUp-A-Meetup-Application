import { Link } from 'react-router-dom';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { icons } from '../../theme';
import { cards } from '../../theme';
import { transitions } from '../../theme';

/**
 * EventCard - Unified reusable event card component
 * 
 * Consolidates all event card implementations into a single component.
 * Supports multiple layouts: compact (with image), detailed (without image), profile view.
 * 
 * Features:
 * - Optional event image with gradient placeholder
 * - Flexible date formatting (Today, Tomorrow, formatted date)
 * - Online/in-person location display
 * - Attendee count
 * - Past event indicator
 * - Host/group information
 * - Consistent hover effects
 * - Full accessibility support
 * 
 * @param {Object} props
 * @param {Object} props.event - Event object with all event data
 * @param {string} props.variant - Card variant: 'compact' (with image) | 'detailed' (no image) | 'profile' (default: 'compact')
 * @param {boolean} props.showImage - Whether to show event image (default: true for compact variant)
 * @param {Function} props.onClick - Optional click handler
 */
const EventCard = ({ 
  event, 
  variant = 'compact',
  showImage = variant === 'compact',
  onClick 
}) => {
  if (!event || !event._id) {
    return null;
  }

  const isOnline = event.eventLocationType === 'online';
  const eventDate = event.dateAndTime ? new Date(event.dateAndTime) : new Date();
  const city = event.location?.city;
  const state = event.location?.state;
  const distanceMiles = event.distanceMiles;
  const attendeeCount = event.attendees?.length || 0;
  const hostName = event.hostedBy?.name || event.host?.name || event.createdBy?.name || 'Host';
  const groupName = event.groupDetail?.groupName;
  const isPastEvent = isPast(eventDate);

  // Format date label based on variant
  const getDateLabel = () => {
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    return format(eventDate, 'EEE, MMM d');
  };

  const timeLabel = format(eventDate, 'h:mm a');
  
  // For detailed variant, use longer date format
  const dateDisplay = variant === 'detailed' 
    ? `${format(eventDate, 'EEE, MMM d')} · ${timeLabel} ${eventDate.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop() || ''}`
    : `${getDateLabel()} · ${timeLabel}`;

  // Format location description
  let locationDescription = '';
  if (isOnline) {
    locationDescription = 'Online';
  } else {
    const locationParts = [];
    if (city && state) {
      locationParts.push(`${city}, ${state}`);
    } else if (city) {
      locationParts.push(city);
    } else if (state) {
      locationParts.push(state);
    } else {
      locationParts.push('Location TBD');
    }
    if (distanceMiles != null) {
      locationParts.push(`${distanceMiles} mi`);
    }
    locationDescription = locationParts.join(' · ');
  }

  // Get category emoji for image placeholder
  const categoryEmoji = event.eventCategory?.[0] || '📅';

  // Determine metadata color (past events are muted)
  const metadataColor = isPastEvent ? colors.text.tertiary : colors.primary[600];

  return (
    <Link
      to={`/events/${event._id}`}
      onClick={onClick}
      className="group block overflow-hidden transition-all h-full"
      style={{
        backgroundColor: colors.surface.default,
        borderRadius: cards.base.borderRadius,
        boxShadow: shadows.sm,
        border: `1px solid ${colors.border.default}`,
        transition: transitions.preset.card,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.borderColor = colors.border.dark;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.sm;
        e.currentTarget.style.borderColor = colors.border.default;
      }}
      aria-label={`View event: ${event.title}`}
    >
      {/* Event Image - Only for compact/profile variants */}
      {showImage && (event.eventImage || variant === 'compact' || variant === 'profile') && (
        event.eventImage ? (
          <div 
            className="w-full overflow-hidden"
            style={{
              height: '8rem',
              backgroundColor: colors.gray[200],
              borderTopLeftRadius: borderRadius.lg,
              borderTopRightRadius: borderRadius.lg,
            }}
          >
            <img
              src={event.eventImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div 
            className="w-full flex items-center justify-center"
            style={{
              height: '8rem',
              background: `linear-gradient(to bottom right, ${colors.primary[100]}, ${colors.secondary[100]})`,
              borderTopLeftRadius: borderRadius.lg,
              borderTopRightRadius: borderRadius.lg,
            }}
          >
            <span style={{ fontSize: typography.fontSize['3xl'] }}>
              {categoryEmoji}
            </span>
          </div>
        )
      )}

      {/* Card Content */}
      <div 
        className="h-full flex flex-col"
        style={{ padding: cards.event.padding }}
      >
        {/* Free badge and Online indicator - Only for detailed variant */}
        {variant === 'detailed' && (
          <div 
            className="flex items-start justify-between"
            style={{ marginBottom: spacing[2] }}
          >
            <span 
              className="inline-block font-medium rounded"
              style={{
                backgroundColor: colors.gray[100],
                color: colors.gray[600],
                fontSize: typography.fontSize.xs,
                padding: `${spacing[1]} ${spacing[2]}`,
              }}
            >
              Free
            </span>
            {isOnline && (
              <span 
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.tertiary,
                }}
              >
                Online
              </span>
            )}
          </div>
        )}

        {/* Date & Time - Metadata line */}
        <div 
          className="mb-1"
          style={{
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            color: metadataColor,
          }}
        >
          {dateDisplay}
        </div>

        {/* Event title */}
        <h3 
          className={`mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors`}
          style={{
            fontSize: variant === 'detailed' ? typography.fontSize.lg : typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            lineHeight: typography.lineHeight.snug,
          }}
          onMouseEnter={(e) => e.target.style.color = colors.primary[600]}
          onMouseLeave={(e) => e.target.style.color = colors.text.primary}
        >
          {event.title}
        </h3>

        {/* Location - With icon for compact/profile variants */}
        {(variant === 'compact' || variant === 'profile') ? (
          <div 
            className="flex items-center mb-2"
            style={{
              gap: spacing[1],
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
            }}
          >
            {isOnline ? (
              <>
                <svg 
                  className="flex-shrink-0"
                  style={{
                    width: icons.size.xs,
                    height: icons.size.xs,
                  }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Online</span>
              </>
            ) : (
              <>
                <svg 
                  className="flex-shrink-0"
                  style={{
                    width: icons.size.xs,
                    height: icons.size.xs,
                  }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">
                  {city && state ? `${city}, ${state}` : city || state || 'Location TBD'}
                </span>
              </>
            )}
          </div>
        ) : (
          // Detailed variant - text only
          <div 
            className="mb-3"
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            {isOnline ? 'Online event' : locationDescription}
          </div>
        )}

        {/* Host/Group - Only for detailed variant */}
        {variant === 'detailed' && (
          <div 
            className="mb-3"
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.tertiary,
            }}
          >
            {groupName ? groupName : `by ${hostName}`}
          </div>
        )}

        {/* Footer - Attendee count and Past badge */}
        <div 
          className={`mt-auto ${variant === 'profile' ? 'flex items-center justify-between' : ''}`}
          style={{
            paddingTop: spacing[2],
            borderTop: `1px solid ${colors.border.light}`,
          }}
        >
          <div 
            className="flex items-center"
            style={{
              gap: spacing[1],
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
            }}
          >
            <svg 
              className="flex-shrink-0"
              style={{
                width: variant === 'detailed' ? icons.component.card.default : icons.size.xs,
                height: variant === 'detailed' ? icons.component.card.default : icons.size.xs,
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{attendeeCount} {variant === 'detailed' ? 'going' : ''}</span>
          </div>
          {isPastEvent && variant === 'profile' && (
            <span 
              className="font-medium rounded"
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.tertiary,
                backgroundColor: colors.gray[100],
                padding: `${spacing[1]} ${spacing[2]}`,
              }}
            >
              Past
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
