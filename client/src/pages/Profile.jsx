import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import { eventService } from '../services/event.service';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

/**
 * Profile Page - Modern design with edit functionality and comprehensive event lists
 * 
 * Features:
 * - Hero section with profile picture and edit button
 * - Tabs for Created Events, RSVPed Events, and Past Events
 * - Modern event cards matching Events page design
 * - Responsive layout
 */
const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('created'); // 'created', 'rsvped', 'past'
  const [createdEvents, setCreatedEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const userRes = isOwnProfile 
        ? await userService.getProfile() 
        : await userService.getUserById(id);
      
      // Handle different response structures
      const userData = userRes.data?.user || userRes.data?.data?.user || userRes.user;
      if (!userData) {
        throw new Error('User not found');
      }
      setUser(userData);
      
      // Fetch events after profile loads
      if (userData) {
        await fetchAllEvents();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all event types for the user
  const fetchAllEvents = useCallback(async () => {
    if (!id) return;
    
    try {
      setEventsLoading(true);
      
      // Fetch created events
      const createdRes = await userService.getUserEvents(id);
      // Handle different response structures
      const created = createdRes.data?.events || createdRes.data?.data?.events || createdRes.events || [];
      setCreatedEvents(Array.isArray(created) ? created : []);
      
      // Fetch RSVPed events (events where user is an attendee)
      // Only show RSVPed/Past tabs for own profile
      if (currentUser?._id === id) {
        try {
          // Fetch all upcoming events and filter client-side
          // Note: In production, consider adding backend endpoint /users/:id/rsvped-events
          const allUpcomingRes = await eventService.getEvents({ upcoming: true }, 1, 100);
          const allUpcoming = allUpcomingRes?.events || [];
          
          // Filter events where current user is an attendee
          const rsvped = allUpcoming.filter(event => 
            event.attendees?.some(attendee => {
              const attendeeId = typeof attendee === 'string' ? attendee : (attendee?._id || attendee);
              return attendeeId === currentUser._id;
            })
          );
          setRsvpedEvents(rsvped);
          
          // Fetch past events and filter
          const allPastRes = await eventService.getEvents({ past: true }, 1, 100);
          const allPast = allPastRes?.events || [];
          
          const past = allPast.filter(event => 
            event.attendees?.some(attendee => {
              const attendeeId = typeof attendee === 'string' ? attendee : (attendee?._id || attendee);
              return attendeeId === currentUser._id;
            })
          );
          setPastEvents(past);
        } catch (err) {
          console.error('Error fetching RSVPed events:', err);
          // Continue even if RSVPed events fail - user can still see created events
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setEventsLoading(false);
    }
  }, [id, currentUser]);

  // Get events for current tab
  const getCurrentEvents = () => {
    switch (activeTab) {
      case 'created':
        return createdEvents;
      case 'rsvped':
        return rsvpedEvents;
      case 'past':
        return pastEvents;
      default:
        return [];
    }
  };

  // Get tab label
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'created':
        return `Created (${createdEvents.length})`;
      case 'rsvped':
        return `RSVPed (${rsvpedEvents.length})`;
      case 'past':
        return `Past (${pastEvents.length})`;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <LayoutContainer>
          <Loading />
        </LayoutContainer>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <LayoutContainer>
          <ErrorMessage message={error} />
        </LayoutContainer>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <LayoutContainer>
          <EmptyState
            icon="👤"
            title="User not found"
            message="The user you're looking for doesn't exist."
            actionLabel="Go Home"
            actionHref="/"
          />
        </LayoutContainer>
      </div>
    );
  }

  const currentEvents = getCurrentEvents();
  const upcomingCreated = createdEvents.filter(e => !isPast(new Date(e.dateAndTime)));
  const pastCreated = createdEvents.filter(e => isPast(new Date(e.dateAndTime)));

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 sm:h-40"></div>
          <div className="px-6 pb-6 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={user.profile_pic || '/default-avatar.png'}
                  alt={user.name || user.username || 'User'}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {user.name || user.username || 'User'}
                </h1>
                {user.bio && (
                  <p className="text-gray-600 mb-3 text-sm sm:text-base">{user.bio}</p>
                )}
                
                {/* User Details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.email && isOwnProfile && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              {isOwnProfile && (
                <Link to={`/profile/${id}/edit`}>
                  <Button variant="secondary" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-4" aria-label="Event tabs">
              <button
                onClick={() => setActiveTab('created')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'created'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getTabLabel('created')}
              </button>
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => setActiveTab('rsvped')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'rsvped'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {getTabLabel('rsvped')}
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'past'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {getTabLabel('past')}
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Events List */}
          {eventsLoading ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : currentEvents.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title={
                activeTab === 'created'
                  ? 'No events created yet'
                  : activeTab === 'rsvped'
                  ? 'No upcoming events'
                  : 'No past events'
              }
              message={
                activeTab === 'created'
                  ? isOwnProfile
                    ? 'Start creating events to bring people together around what you love.'
                    : 'This user hasn\'t created any events yet.'
                  : activeTab === 'rsvped'
                  ? 'You haven\'t RSVPed to any upcoming events yet.'
                  : 'You don\'t have any past events.'
              }
              actionLabel={activeTab === 'created' && isOwnProfile ? 'Create Event' : undefined}
              actionHref={activeTab === 'created' && isOwnProfile ? '/events/create' : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentEvents.map((event) => (
                <ProfileEventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </LayoutContainer>
    </div>
  );
};

/**
 * Compact Event Card for Profile Page
 * Matches the modern design from Events page
 */
const ProfileEventCard = ({ event }) => {
  const isOnline = event.eventLocationType === 'online';
  const eventDate = new Date(event.dateAndTime);
  const city = event.location?.city;
  const state = event.location?.state;
  const attendeeCount = event.attendees?.length || 0;
  const isPastEvent = isPast(eventDate);

  const getDateLabel = () => {
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    return format(eventDate, 'EEE, MMM d');
  };

  const timeLabel = format(eventDate, 'h:mm a');

  return (
    <Card hover clickable className="h-full">
      <Link to={`/events/${event._id}`} className="block h-full">
        {/* Event Image */}
        {event.eventImage ? (
          <div className="w-full h-32 bg-gray-200 rounded-t-lg overflow-hidden">
            <img
              src={event.eventImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
            <span className="text-3xl">{event.eventCategory?.[0] || '📅'}</span>
          </div>
        )}

        <div className="p-4">
          {/* Date & Time */}
          <div className={`text-xs font-semibold mb-1 ${isPastEvent ? 'text-gray-500' : 'text-blue-600'}`}>
            {getDateLabel()} · {timeLabel}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
            {isOnline ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Online</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">
                  {city && state ? `${city}, ${state}` : city || state || 'Location TBD'}
                </span>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{attendeeCount}</span>
            </div>
            {isPastEvent && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Past
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default Profile;
