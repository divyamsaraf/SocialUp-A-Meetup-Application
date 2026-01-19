import { Link } from 'react-router-dom';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { icons } from '../../theme';
import { cards } from '../../theme';
import { transitions } from '../../theme';

/**
 * ListingCard - Reusable card component for Events and Groups
 * 
 * A unified card component that ensures consistent design across Events and Groups pages.
 * Matches CompactEventCard design exactly for visual consistency.
 * 
 * Features:
 * - Optional image or gradient placeholder
 * - Flexible metadata section (date/time, category, etc.)
 * - Title with hover effect
 * - Optional description/location
 * - Optional secondary info (host, organizer, etc.)
 * - Footer with icon and count (attendees, members, etc.)
 * - Consistent hover effects
 * - Full accessibility support
 * 
 * @param {Object} props
 * @param {string} props.to - Link destination (e.g., '/events/123' or '/groups/456')
 * @param {string} props.title - Card title (required)
 * @param {string} props.metadata - Top metadata line (e.g., "Today · 9:00 AM" or "Technology")
 * @param {string} props.metadataColor - Color for metadata (default: primary[600])
 * @param {string} props.description - Optional description or location text
 * @param {string} props.secondaryInfo - Optional secondary info (e.g., "by Host Name")
 * @param {string} props.secondaryInfoHighlight - Optional highlighted part of secondary info
 * @param {number} props.count - Count for footer (e.g., attendee count, member count)
 * @param {string} props.countLabel - Label for count (e.g., "going", "members")
 * @param {string} props.image - Optional image URL
 * @param {string} props.imagePlaceholder - Emoji or text for image placeholder
 * @param {string} props.ariaLabel - Accessibility label for the card link
 * @param {Function} props.onClick - Optional click handler
 */
const ListingCard = ({
  to,
  title,
  metadata,
  metadataColor = colors.primary[600],
  description,
  secondaryInfo,
  secondaryInfoHighlight,
  count = 0,
  countLabel = '',
  image,
  imagePlaceholder = '📅',
  ariaLabel,
  onClick,
}) => {
  if (!to || !title) {
    return null;
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className="group block overflow-hidden transition-all"
      style={{
        backgroundColor: colors.surface.default,
        borderRadius: cards.base.borderRadius,
        boxShadow: shadows.sm,
        border: `1px solid ${colors.border.default}`,
        transition: transitions.preset.card,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.borderColor = colors.border.dark;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.sm;
        e.currentTarget.style.borderColor = colors.border.default;
      }}
      aria-label={ariaLabel || `View ${title}`}
    >
      {/* Image Section - Compact (matching event card image section) */}
      {image ? (
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
            src={image}
            alt={title}
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
            {imagePlaceholder}
          </span>
        </div>
      )}

      {/* Card Content */}
      <div 
        className="h-full flex flex-col"
        style={{ padding: cards.event.padding }}
      >
        {/* Metadata - Match EventCard date/time position and style */}
        {metadata && (
          <div 
            className="mb-1"
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              color: metadataColor,
            }}
          >
            {metadata}
          </div>
        )}

        {/* Title - Match EventCard title style exactly */}
        <h3 
          className="mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            lineHeight: typography.lineHeight.snug,
          }}
          onMouseEnter={(e) => e.target.style.color = colors.primary[600]}
          onMouseLeave={(e) => e.target.style.color = colors.text.primary}
        >
          {title}
        </h3>

        {/* Description/Location - Match EventCard location style */}
        {description && (
          <div 
            className="flex items-center mb-2"
            style={{
              gap: spacing[1],
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
            }}
          >
            <span className="line-clamp-2">{description}</span>
          </div>
        )}

        {/* Secondary Info - Match EventCard host/group style */}
        {secondaryInfo && (
          <div 
            className="mb-2"
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.tertiary,
            }}
          >
            {secondaryInfoHighlight ? (
              <>
                <span style={{ color: colors.primary[600] }}>{secondaryInfoHighlight}</span>
                {secondaryInfo.replace(secondaryInfoHighlight, '')}
              </>
            ) : (
              secondaryInfo
            )}
          </div>
        )}

        {/* Footer Count - Match EventCard attendee count footer exactly */}
        {(count > 0 || countLabel) && (
          <div 
            className="mt-auto pt-2 border-t"
            style={{
              paddingTop: spacing[2],
              borderTopColor: colors.border.light,
            }}
          >
            <div 
              className="flex items-center gap-1"
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.secondary,
              }}
            >
              <svg 
                className="flex-shrink-0"
                style={{
                  width: icons.component.card.default,
                  height: icons.component.card.default,
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count} {countLabel}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
