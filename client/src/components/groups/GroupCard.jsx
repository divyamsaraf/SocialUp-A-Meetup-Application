import { colors } from '../../theme';
import { spacing } from '../../theme';
import ListingCard from '../common/ListingCard';

/**
 * GroupCard Component - Uses reusable ListingCard for consistency
 * 
 * Wrapper component that formats group data for the reusable ListingCard component.
 * Ensures Groups page cards match Events page cards exactly.
 * 
 * Features:
 * - Uses ListingCard component for consistent design
 * - Formats group-specific data (category, privacy, members, organizer)
 * - Matches CompactEventCard styling exactly
 * - Full accessibility support
 */
const GroupCard = ({ group }) => {
  // Safety check
  if (!group || !group._id) {
    return null;
  }

  const memberCount = group.members?.length || 0;
  const organizerName = group.organizer?.name || group.organizer?.username || group.createdBy?.name || 'Organizer';
  const category = group.category || group.groupCategory || 'General';
  const privacy = group.privacy || 'public';
  const isPrivate = privacy === 'private';

  // Format metadata: Category + Privacy indicator
  const metadata = `${category}${isPrivate ? ` · Private` : ''}`;

  // Get category emoji for image placeholder
  const categoryEmoji = category?.[0] || '👥';

  return (
    <ListingCard
      to={`/groups/${group._id}`}
      title={group.name}
      metadata={metadata}
      metadataColor={colors.primary[600]}
      description={group.description}
      secondaryInfo={`by ${organizerName}`}
      count={memberCount}
      countLabel={memberCount === 1 ? 'member' : 'members'}
      image={group.groupImage || group.image}
      imagePlaceholder={categoryEmoji}
      ariaLabel={`View ${group.name} group`}
    />
  );
};

export default GroupCard;
