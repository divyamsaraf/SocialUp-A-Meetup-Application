import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const memberCount = group.members?.length || 0;

  return (
    <Link
      to={`/groups/${group._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {group.groupImage && (
        <img
          src={group.groupImage}
          alt={group.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {group.category}
          </span>
          <span className="text-sm text-gray-500 capitalize">{group.privacy}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{memberCount} members</span>
          <span>Organized by {group.organizer?.name || group.organizer?.username}</span>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
