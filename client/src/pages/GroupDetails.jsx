import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { groupService } from '../services/group.service';
import { eventService } from '../services/event.service';
import EventCard from '../components/events/EventCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PrivateRoute from '../components/common/PrivateRoute';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, [id]);

  useEffect(() => {
    if (group && user) {
      const userId = user._id;
      setIsMember(
        group.members?.some((member) => {
          const memberId = typeof member === 'object' ? member._id : member;
          return memberId === userId;
        })
      );
      setIsOrganizer(group.organizer?._id === userId);
      setIsModerator(
        group.moderators?.some((mod) => {
          const modId = typeof mod === 'object' ? mod._id : mod;
          return modId === userId;
        })
      );
    }
  }, [group, user]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      setError('');
      const [groupRes, eventsRes] = await Promise.all([
        groupService.getGroupById(id),
        groupService.getGroupEvents(id),
      ]);
      setGroup(groupRes.data.group);
      setEvents(eventsRes.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await groupService.joinGroup(id);
      fetchGroup();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      return;
    }
    setActionLoading(true);
    try {
      await groupService.leaveGroup(id);
      fetchGroup();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }
    setActionLoading(true);
    try {
      await groupService.deleteGroup(id);
      navigate('/groups');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete group');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !group) {
    return <ErrorMessage message={error} />;
  }

  if (!group) {
    return <div className="p-8">Group not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {group.groupImage && (
          <img
            src={group.groupImage}
            alt={group.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {group.category}
                </span>
                <span className="capitalize">{group.privacy} group</span>
                <span>{group.members?.length || 0} members</span>
              </div>
            </div>
            {(isOrganizer || isModerator) && (
              <div className="flex space-x-2">
                <Link
                  to={`/groups/${id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </Link>
                {isOrganizer && (
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{group.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Organized By</h2>
            <Link
              to={`/profile/${group.organizer?._id}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <img
                src={group.organizer?.profile_pic || '/default-avatar.png'}
                alt={group.organizer?.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{group.organizer?.name || group.organizer?.username}</span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="mb-6">
              {isMember ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading || isOrganizer}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Leaving...' : 'Leave Group'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading || group.privacy === 'private'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Joining...' : group.privacy === 'private' ? 'Private Group' : 'Join Group'}
                </button>
              )}
            </div>
          )}

          {group.moderators && group.moderators.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Moderators</h2>
              <div className="flex flex-wrap gap-2">
                {group.moderators.map((moderator) => {
                  const modData = typeof moderator === 'object' ? moderator : null;
                  return (
                    <Link
                      key={modData?._id || moderator}
                      to={`/profile/${modData?._id || moderator}`}
                      className="flex items-center space-x-2"
                    >
                      <img
                        src={modData?.profile_pic || '/default-avatar.png'}
                        alt={modData?.name || 'Moderator'}
                        className="w-8 h-8 rounded-full"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Group Events ({events.length})
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events in this group yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
