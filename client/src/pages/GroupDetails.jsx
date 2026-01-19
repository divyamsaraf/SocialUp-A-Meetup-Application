import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { groupService } from '../services/group.service';
import { eventService } from '../services/event.service';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EventCard from '../components/events/EventCard';

/**
 * Group Details Page - Modern design with hero banner, member list, and upcoming events
 */
const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
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
      const allEvents = eventsRes.data.events || [];
      setEvents(allEvents);
      // Filter upcoming events
      const now = new Date();
      setUpcomingEvents(
        allEvents.filter((e) => new Date(e.dateAndTime) >= now).slice(0, 6)
      );
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
    return (
      <LayoutContainer>
        <div className="text-center py-12">
          <p className="text-gray-500">Group not found</p>
        </div>
      </LayoutContainer>
    );
  }

  const memberCount = group.members?.length || 0;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        {/* Hero Banner */}
        <div className="mb-8">
          {group.groupImage ? (
            <div className="w-full h-96 rounded-lg overflow-hidden mb-6">
              <img
                src={group.groupImage}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-8xl">👥</span>
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
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {group.category}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {group.privacy} group
                      </span>
                      <span className="text-sm text-gray-600">
                        {memberCount} {memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                      {group.name}
                    </h1>
                  </div>
                  {(isOrganizer || isModerator) && (
                    <div className="flex gap-2">
                      <Link to={`/groups/${id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      {isOrganizer && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleDelete}
                          disabled={actionLoading}
                          isLoading={actionLoading}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">About this group</h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {group.description}
                  </p>
                </div>

                {/* Organizer */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Organized by</h2>
                  <Link
                    to={`/profile/${group.organizer?.username || group.organizer?._id}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={group.organizer?.profile_pic || '/default-avatar.png'}
                      alt={group.organizer?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {group.organizer?.name || group.organizer?.username}
                      </p>
                      <p className="text-gray-600">Group organizer</p>
                    </div>
                  </Link>
                </div>

                {/* Moderators */}
                {group.moderators && group.moderators.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Moderators ({group.moderators.length})
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {group.moderators.map((moderator) => {
                        const modData = typeof moderator === 'object' ? moderator : null;
                        return (
                          <Link
                            key={modData?._id || moderator}
                            to={`/profile/${modData?._id || moderator}`}
                            className="flex flex-col items-center gap-1"
                            title={modData?.name || 'Moderator'}
                          >
                            <img
                              src={modData?.profile_pic || '/default-avatar.png'}
                              alt={modData?.name || 'Moderator'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:border-purple-500 transition-colors"
                            />
                            <span className="text-xs text-gray-600 text-center max-w-[60px] truncate">
                              {modData?.name || 'Moderator'}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Members Preview */}
                {group.members && group.members.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Members ({memberCount})
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {group.members.slice(0, 24).map((member) => {
                        const memberData = typeof member === 'object' ? member : null;
                        return (
                          <Link
                            key={memberData?._id || member}
                            to={`/profile/${memberData?.username || memberData?._id || member}`}
                            className="flex flex-col items-center gap-1"
                            title={memberData?.name || 'Member'}
                          >
                            <img
                              src={memberData?.profile_pic || '/default-avatar.png'}
                              alt={memberData?.name || 'Member'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:border-purple-500 transition-colors"
                            />
                          </Link>
                        );
                      })}
                      {memberCount > 24 && (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                          +{memberCount - 24}
                        </div>
                      )}
                    </div>
                    {memberCount > 24 && (
                      <Link
                        to={`/groups/${id}/members`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View all members →
                      </Link>
                    )}
                  </div>
                )}
              </Card>

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Upcoming events ({upcomingEvents.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Events */}
              {events.length > upcomingEvents.length && (
                <div className="mt-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    All events ({events.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-gray-500 text-lg">No events in this group yet</p>
                  {isMember && (
                    <Link to="/events/create" className="mt-4 inline-block">
                      <Button>Create an event</Button>
                    </Link>
                  )}
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80">
              <Card className="p-6 sticky top-4">
                {isAuthenticated && (
                  <div className="mb-6">
                    {isMember ? (
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={handleLeave}
                        disabled={actionLoading || isOrganizer}
                        isLoading={actionLoading}
                      >
                        Leave Group
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        onClick={handleJoin}
                        disabled={actionLoading || group.privacy === 'private'}
                        isLoading={actionLoading}
                      >
                        {group.privacy === 'private' ? 'Private Group' : 'Join Group'}
                      </Button>
                    )}
                  </div>
                )}

                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Members</p>
                    <p className="text-2xl font-bold text-gray-900">{memberCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Events</p>
                    <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Category</p>
                    <p className="text-lg text-gray-900">{group.category}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
};

export default GroupDetails;
