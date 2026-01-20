import { colors } from '../../theme';
import ListingCard from '../common/ListingCard';

const GroupCard = ({ group }) => {
  if (!group || !group._id) {
    return null;
  }

  const memberCount = Array.isArray(group.members) ? group.members.length : 0;
  const organizer = group.organizer || group.createdBy || null;
  const organizerName = organizer?.name || organizer?.username || 'Organizer';
  const category = group.category || group.groupCategory || 'General';
  const privacy = group.privacy || 'public';
  const isPrivate = privacy === 'private';
  const groupName = group.name || 'Untitled Group';
  const description = group.description || '';
  const groupImage = group.groupImage || group.image || null;

  const metadata = `${category}${isPrivate ? ` · Private` : ''}`;
  const categoryEmoji = category?.[0] || '👥';

  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  return (
    <ListingCard
      to={`/groups/${group._id}`}
      title={groupName}
      metadata={metadata}
      metadataColor={colors.primary[600]}
      description={truncatedDescription}
      secondaryInfo={`by ${organizerName}`}
      count={memberCount}
      countLabel={memberCount === 1 ? 'member' : 'members'}
      image={groupImage}
      imagePlaceholder={categoryEmoji}
      ariaLabel={`View ${groupName} group`}
    />
  );
};

export default GroupCard;
