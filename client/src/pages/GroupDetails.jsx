import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { groupService } from '../services/group.service';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EventCard from '../components/events/EventCard';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';

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
    if (id) {
      fetchGroup();
    } else {
      setError('Invalid group ID');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (group && user && user._id) {
      const userId = user._id;
      const members = Array.isArray(group.members) ? group.members : [];
      setIsMember(
        members.some((member) => {
          const memberId = typeof member === 'object' && member ? member._id : member;
          return memberId && memberId.toString() === userId.toString();
        })
      );
      const organizerId = group.organizer?._id || group.organizer;
      setIsOrganizer(organizerId && organizerId.toString() === userId.toString());
      const moderators = Array.isArray(group.moderators) ? group.moderators : [];
      setIsModerator(
        moderators.some((mod) => {
          const modId = typeof mod === 'object' && mod ? mod._id : mod;
          return modId && modId.toString() === userId.toString();
        })
      );
    } else {
      setIsMember(false);
      setIsOrganizer(false);
      setIsModerator(false);
    }
  }, [group, user]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!id) {
        throw new Error('Group ID is required');
      }

      const [groupRes, eventsRes] = await Promise.all([
        groupService.getGroupById(id).catch(err => {
          console.error('Error fetching group:', err);
          throw new Error(err.response?.data?.message || 'Unable to load group. Please try again later.');
        }),
        groupService.getGroupEvents(id).catch(err => {
          console.error('Error fetching events:', err);
          return { data: { events: [], pagination: null } };
        }),
      ]);

      const groupData = groupRes?.data?.group || groupRes?.group || null;
      if (!groupData) {
        throw new Error('Group not found');
      }

      setGroup(groupData);
      
      const eventsData = eventsRes?.data?.events || eventsRes?.events || [];
      const safeEvents = Array.isArray(eventsData) ? eventsData : [];
      setEvents(safeEvents);
      
      const now = new Date();
      const upcoming = safeEvents
        .filter((e) => {
          if (!e || !e.dateAndTime) return false;
          try {
            const eventDate = new Date(e.dateAndTime);
            return !isNaN(eventDate.getTime()) && eventDate >= now;
          } catch {
            return false;
          }
        })
        .slice(0, 6);
      setUpcomingEvents(upcoming);
    } catch (err) {
      console.error('Error in fetchGroup:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unable to load group. Please try again later.';
      setError(errorMessage);
      setGroup(null);
      setEvents([]);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/groups/${id}` } });
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await groupService.joinGroup(id);
      await fetchGroup();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to join group. Please try again later.';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/groups/${id}` } });
      return;
    }

    if (!window.confirm('Are you sure you want to leave this group?')) {
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await groupService.leaveGroup(id);
      await fetchGroup();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to leave group. Please try again later.';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await groupService.deleteGroup(id);
      navigate('/groups');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete group. Please try again later.';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background.secondary }}>
        <LayoutContainer>
          <Loading />
        </LayoutContainer>
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background.secondary }}>
        <LayoutContainer>
          <ErrorMessage message={error} />
          <div className="mt-4">
            <Button onClick={() => navigate('/groups')}>Back to Groups</Button>
          </div>
        </LayoutContainer>
      </div>
    );
  }

  if (!group || !group._id) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background.secondary }}>
        <LayoutContainer>
          <EmptyState
            icon="👥"
            title="Group not found"
            message="The group you're looking for doesn't exist or has been removed."
            actionLabel="Back to Groups"
            onAction={() => navigate('/groups')}
          />
        </LayoutContainer>
      </div>
    );
  }

  const memberCount = Array.isArray(group.members) ? group.members.length : 0;
  const groupName = group.name || 'Untitled Group';
  const groupDescription = group.description || 'No description available.';
  const groupCategory = group.category || 'General';
  const groupPrivacy = group.privacy || 'public';
  const groupImage = group.groupImage || null;
  const organizer = group.organizer || null;
  const moderators = Array.isArray(group.moderators) ? group.moderators : [];
  const members = Array.isArray(group.members) ? group.members : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background.secondary }}>
      <LayoutContainer>
        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="mb-8">
          {groupImage ? (
            <div className="w-full h-96 rounded-lg overflow-hidden mb-6">
              <img
                src={groupImage}
                alt={groupName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                <span className="text-8xl">👥</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-8xl">👥</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Card className="p-6 mb-6">
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {groupCategory}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {groupPrivacy} group
                      </span>
                      <span className="text-sm text-gray-600">
                        {memberCount} {memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words">
                      {groupName}
                    </h1>
                  </div>
                  {(isOrganizer || isModerator) && (
                    <div className="flex gap-2 flex-shrink-0">
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

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">About this group</h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {groupDescription}
                  </p>
                </div>

                {organizer && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Organized by</h2>
                    <Link
                      to={`/profile/${organizer.username || organizer._id || ''}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={organizer.profile_pic || '/default-avatar.png'}
                        alt={organizer.name || organizer.username || 'Organizer'}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {organizer.name || organizer.username || 'Organizer'}
                        </p>
                        <p className="text-gray-600">Group organizer</p>
                      </div>
                    </Link>
                  </div>
                )}

                {moderators.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Moderators ({moderators.length})
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {moderators.map((moderator, index) => {
                        const modData = typeof moderator === 'object' && moderator ? moderator : null;
                        const modId = modData?._id || moderator || `mod-${index}`;
                        const modName = modData?.name || modData?.username || 'Moderator';
                        const modPic = modData?.profile_pic || '/default-avatar.png';
                        return (
                          <Link
                            key={modId}
                            to={`/profile/${modData?.username || modId}`}
                            className="flex flex-col items-center gap-1"
                            title={modName}
                          >
                            <img
                              src={modPic}
                              alt={modName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:border-purple-500 transition-colors"
                              onError={(e) => {
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                            <span className="text-xs text-gray-600 text-center max-w-[60px] truncate">
                              {modName}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {members.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Members ({memberCount})
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {members.slice(0, 24).map((member, index) => {
                        const memberData = typeof member === 'object' && member ? member : null;
                        const memberId = memberData?._id || member || `member-${index}`;
                        const memberName = memberData?.name || memberData?.username || 'Member';
                        const memberPic = memberData?.profile_pic || '/default-avatar.png';
                        return (
                          <Link
                            key={memberId}
                            to={`/profile/${memberData?.username || memberId}`}
                            className="flex flex-col items-center gap-1"
                            title={memberName}
                          >
                            <img
                              src={memberPic}
                              alt={memberName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm hover:border-purple-500 transition-colors"
                              onError={(e) => {
                                e.target.src = '/default-avatar.png';
                              }}
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
                ) : (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Members</h2>
                    <Card className="p-6 text-center">
                      <p className="text-gray-500 text-lg">No members yet</p>
                      <p className="text-gray-400 text-sm mt-2">Be the first to join this group!</p>
                    </Card>
                  </div>
                )}
              </Card>

              {upcomingEvents.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Upcoming events ({upcomingEvents.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => {
                      if (!event || !event._id) return null;
                      return <EventCard key={event._id} event={event} />;
                    })}
                  </div>
                </div>
              )}

              {events.length > upcomingEvents.length && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    All events ({events.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                      if (!event || !event._id) return null;
                      return <EventCard key={event._id} event={event} />;
                    })}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-gray-500 text-lg mb-2">No events in this group yet</p>
                  <p className="text-gray-400 text-sm mb-4">Check back later or create an event to get started!</p>
                  {isMember && (
                    <Link to="/events/create">
                      <Button>Create an event</Button>
                    </Link>
                  )}
                </Card>
              )}
            </div>

            <div className="lg:w-80">
              <Card className="p-6 sticky top-4">
                {isAuthenticated ? (
                  <div className="mb-6">
                    {isMember ? (
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={handleLeave}
                        disabled={actionLoading || isOrganizer}
                        isLoading={actionLoading}
                      >
                        {isOrganizer ? 'Cannot Leave (Organizer)' : 'Leave Group'}
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        onClick={handleJoin}
                        disabled={actionLoading || groupPrivacy === 'private'}
                        isLoading={actionLoading}
                      >
                        {groupPrivacy === 'private' ? 'Private Group' : 'Join Group'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3 text-center">
                      Sign in to join this group
                    </p>
                    <Button
                      fullWidth
                      onClick={() => navigate('/login', { state: { from: `/groups/${id}` } })}
                    >
                      Sign In
                    </Button>
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
                    <p className="text-lg text-gray-900">{groupCategory}</p>
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
