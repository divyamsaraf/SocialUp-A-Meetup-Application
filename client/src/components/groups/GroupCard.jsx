import { Link } from 'react-router-dom';
import Card from '../ui/Card';

/**
 * GroupCard Component - Modern card design matching EventCard
 * 
 * Features:
 * - Group image with fallback
 * - Category badge
 * - Privacy indicator
 * - Member count
 * - Organizer info
 * - Hover effects
 * - Accessibility features
 */
const GroupCard = ({ group }) => {
  if (!group || !group._id) {
    return null;
  }

  const memberCount = group.members?.length || 0;
  const organizerName = group.organizer?.name || group.organizer?.username || group.createdBy?.name || 'Organizer';
  const category = group.category || group.groupCategory || 'General';
  const privacy = group.privacy || 'public';
  const isPrivate = privacy === 'private';

  return (
    <Card hover clickable className="h-full">
      <Link 
        to={`/groups/${group._id}`} 
        className="block h-full"
        aria-label={`View ${group.name} group`}
      >
        {/* Group Image */}
        {group.groupImage ? (
          <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-t-lg overflow-hidden">
            <img
              src={group.groupImage}
              alt={group.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-lg flex items-center justify-center">
            <span className="text-4xl sm:text-5xl" aria-hidden="true">
              {category[0]?.toUpperCase() || '👥'}
            </span>
          </div>
        )}

        <div className="p-4 sm:p-5">
          {/* Category and Privacy Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {category}
            </span>
            {isPrivate && (
              <span className="text-xs text-gray-500 flex items-center gap-1" aria-label="Private group">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="sr-only">Private</span>
                <span aria-hidden="true">Private</span>
              </span>
            )}
            {!isPrivate && (
              <span className="text-xs text-gray-500 flex items-center gap-1" aria-label="Public group">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="sr-only">Public</span>
                <span aria-hidden="true">Public</span>
              </span>
            )}
          </div>

          {/* Group Name */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
            {group.name}
          </h3>

          {/* Description */}
          {group.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {group.description}
            </p>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
            </div>
            <div className="text-xs text-gray-500 truncate ml-2" title={organizerName}>
              by {organizerName}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default GroupCard;
