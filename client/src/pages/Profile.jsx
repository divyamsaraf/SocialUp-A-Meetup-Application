import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import { eventService } from '../services/event.service';
import { isPast } from 'date-fns';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import EventCard from '../components/events/EventCard';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { borderRadius } from '../theme';
import { shadows } from '../theme';
import { icons } from '../theme';

/**
 * Profile Page - Modern design with edit functionality and comprehensive event lists
 * 
 * Routing:
 * - Route: /profile/:username
 * - Uses useParams() to extract username from route
 * - Fetches user data dynamically based on username route param
 * - Works on both SPA navigation and page refresh
 * 
 * Data Fetching:
 * - API: GET /api/users/username/:username
 * - Fetches user profile data when username changes
 * - Handles own profile (uses getProfile) vs other profiles (uses getUserByUsername)
 * - Fetches user events after profile loads
 * 
 * State Management:
 * - user: user data object
 * - loading: boolean for initial load
 * - eventsLoading: boolean for events fetch
 * - error: string for error messages
 * 
 * Error Handling:
 * - 404 → shows "User not found" with link to homepage
 * - Network error → shows retry option
 * - Invalid username → friendly 404 message
 * 
 * Features:
 * - Hero section with profile picture and edit button
 * - Tabs for Created Events, RSVPed Events, and Past Events
 * - Modern event cards matching Events page design
 * - Responsive layout
 * - Accessibility: ARIA labels, keyboard navigation, screen reader announcements
 * - Loading states with skeletons/spinners
 * - Empty states with friendly messages
 */
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('created'); // 'created', 'rsvped', 'past'
  const [createdEvents, setCreatedEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile data - triggered when username changes
  // Wait for AuthContext to finish loading before fetching profile
  useEffect(() => {
    // Don't fetch if username is not available yet
    if (!username) return;
    
    // Wait for AuthContext to finish loading before fetching profile
    // This prevents "Resource not found" errors when navigating via SPA
    if (authLoading) {
      setLoading(true);
      return;
    }
    
    // Fetch profile once auth context is ready
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, currentUser?._id, currentUser?.username, authLoading]);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Announce loading to screen readers
      const loadingAnnouncement = document.createElement('div');
      loadingAnnouncement.setAttribute('role', 'status');
      loadingAnnouncement.setAttribute('aria-live', 'polite');
      loadingAnnouncement.className = 'sr-only';
      loadingAnnouncement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      loadingAnnouncement.textContent = 'Loading profile';
      document.body.appendChild(loadingAnnouncement);
      
      // Check if param is a MongoDB ObjectId (24 hex characters) - indicates old ID URL
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(username);
      
      // If it's an ObjectId, redirect to username-based URL (backward compatibility)
      // This handles old /profile/:id URLs and redirects them to /profile/:username
      if (isObjectId) {
        try {
          // Try to fetch user by ID to get username for redirect
          const userById = await userService.getUserById(username);
          const userData = userById?.data?.user || userById?.user || userById?.data || userById;
          
          if (userData?.username) {
            // Redirect to username-based URL (client-side redirect, no page reload)
            // Using replace: true to replace history entry (no back button issues)
            navigate(`/profile/${userData.username}`, { replace: true });
            // The navigate will update the URL param, causing useEffect to re-run
            // with the new username, which will then fetch by username
            if (document.body.contains(loadingAnnouncement)) {
              document.body.removeChild(loadingAnnouncement);
            }
            setLoading(false); // Clear loading state
            return; // Exit early - useEffect will re-run with new username
          }
        } catch (redirectError) {
          // If user not found by ID, fall through to show 404
          console.error('User not found by ID (old URL):', redirectError);
        }
      }
      
      // Determine if this is the current user's profile
      const isOwnProfileCheck = currentUser && currentUser.username && currentUser.username === username;
      
      let userRes;
      if (isOwnProfileCheck && currentUser) {
        // Use getProfile for own profile
        try {
          userRes = await userService.getProfile();
        } catch (profileError) {
          // If getProfile fails, try by username
          userRes = await userService.getUserByUsername(username);
        }
      } else {
        // Not own profile - always use username lookup
        userRes = await userService.getUserByUsername(username);
      }
      
      // Handle different response structures - try multiple possible formats
      let userData = null;
      if (userRes) {
        userData = userRes.data?.user || userRes.data?.data?.user || userRes.user || userRes.data || userRes;
      }
      
      if (!userData || (!userData._id && !userData.username && !userData.email)) {
        console.error('Invalid user data received:', userRes);
        throw new Error('User not found');
      }
      
      setUser(userData);
      
      // Remove loading announcement
      if (document.body.contains(loadingAnnouncement)) {
        document.body.removeChild(loadingAnnouncement);
      }
      
      // Fetch events after profile loads
      if (userData && userData.username) {
        // Always use username for fetching events (username is required)
        await fetchAllEvents(userData.username);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        username: username,
        currentUser: currentUser,
      });
      
      // Remove loading announcement if still present
      const existingAnnouncement = document.querySelector('.sr-only[role="status"]');
      if (existingAnnouncement && existingAnnouncement.textContent === 'Loading profile') {
        document.body.removeChild(existingAnnouncement);
      }
      
      // Announce error to screen readers
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('role', 'alert');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      
      if (err.response?.status === 404 || err.message === 'User not found') {
        errorAnnouncement.textContent = 'User not found';
        setError('User not found');
      } else if (err.response?.status >= 500) {
        errorAnnouncement.textContent = 'Server error. Please try again later.';
        setError('Unable to load profile. Try again later.');
      } else {
        errorAnnouncement.textContent = err.response?.data?.message || err.message || 'Failed to load profile';
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
      }
      
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => {
        if (document.body.contains(errorAnnouncement)) {
          document.body.removeChild(errorAnnouncement);
        }
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all event types for the user
  const fetchAllEvents = useCallback(async (userIdentifier) => {
    if (!userIdentifier) return;
    
    try {
      setEventsLoading(true);
      
      // Fetch created events (username is required, identifier should be username)
      const createdRes = await userService.getUserEvents(userIdentifier);
      // Handle different response structures
      const created = createdRes.data?.events || createdRes.data?.data?.events || createdRes.events || [];
      setCreatedEvents(Array.isArray(created) ? created : []);
      
      // Fetch RSVPed events (events where user is an attendee)
      // Only show RSVPed/Past tabs for own profile
      // Check if viewing own profile
      // Use _id for identity comparison (more reliable than username)
      // Username can change, _id is permanent
      const isOwnProfile = currentUser && currentUser._id && userIdentifier && 
        String(currentUser._id) === String(userIdentifier);
      
      if (isOwnProfile && currentUser?._id) {
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
  }, [currentUser]);

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

  // Loading state with skeleton/spinner
  // Show loading if auth is still loading OR profile is loading
  if (authLoading || loading) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.background.secondary }}
        role="status"
        aria-live="polite"
        aria-label="Loading profile"
      >
        <LayoutContainer>
          <Loading />
        </LayoutContainer>
      </div>
    );
  }

  // Handle error state (network error with retry option)
  if (error && !user && error !== 'User not found') {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <LayoutContainer>
          <EmptyState
            icon="⚠️"
            title="Unable to load profile"
            message={error || "Unable to load profile. Please try again later."}
            actionLabel="Retry"
            onAction={() => {
              setError('');
              fetchProfile();
            }}
          />
        </LayoutContainer>
      </div>
    );
  }

  // Handle 404 - User not found
  if ((error === 'User not found' || (!user && !loading)) && username) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <LayoutContainer>
          <EmptyState
            icon="👤"
            title="User not found"
            message="The user you're looking for doesn't exist or may have been deleted."
            actionLabel="Go Home"
            actionHref="/"
            aria-label="User not found"
          />
        </LayoutContainer>
      </div>
    );
  }

  const currentEvents = getCurrentEvents();
  const upcomingCreated = createdEvents.filter(e => !isPast(new Date(e.dateAndTime)));
  const pastCreated = createdEvents.filter(e => isPast(new Date(e.dateAndTime)));
  
  // Check if viewing own profile for edit button display
  // Use _id for identity comparison (more reliable than username)
  // Username is for routing, _id is for identity
  const isOwnProfile = currentUser && user && 
    currentUser._id && 
    user._id && 
    String(currentUser._id) === String(user._id);

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <LayoutContainer>
        {/* Hero Section */}
        <div 
          className="overflow-hidden"
          style={{
            backgroundColor: colors.surface.default,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
            marginBottom: spacing[6],
          }}
        >
          <div 
            className="bg-gradient-to-r"
            style={{
              background: `linear-gradient(to right, ${colors.primary[500]}, ${colors.primary[600]})`,
              height: '8rem',
            }}
          />
          <div 
            style={{
              paddingLeft: spacing[6],
              paddingRight: spacing[6],
              paddingBottom: spacing[6],
              marginTop: '-4rem',
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={user.profile_pic || '/default-avatar.png'}
                  alt={user.name || user.username || 'User'}
                  className="rounded-full object-cover"
                  style={{
                    width: '6rem',
                    height: '6rem',
                    border: `4px solid ${colors.surface.default}`,
                    boxShadow: shadows.lg,
                  }}
                />
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 
                  style={{
                    fontSize: typography.fontSize['3xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing[1],
                  }}
                >
                  {user.name || user.username || 'User'}
                </h1>
                {user.bio && (
                  <p 
                    style={{
                      color: colors.text.secondary,
                      marginBottom: spacing[3],
                      fontSize: typography.fontSize.base,
                    }}
                  >
                    {user.bio}
                  </p>
                )}
                
                {/* User Details */}
                <div 
                  className="flex flex-wrap mb-4"
                  style={{
                    gap: spacing[4],
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {user.location && (
                    <div className="flex items-center" style={{ gap: spacing[1] }}>
                      <svg 
                        style={{
                          width: icons.size.sm,
                          height: icons.size.sm,
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.email && isOwnProfile && (
                    <div className="flex items-center" style={{ gap: spacing[1] }}>
                      <svg 
                        style={{
                          width: icons.size.sm,
                          height: icons.size.sm,
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap" style={{ gap: spacing[2] }}>
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="rounded-full font-medium"
                        style={{
                          backgroundColor: colors.primary[100],
                          color: colors.primary[800],
                          padding: `${spacing[1]} ${spacing[3]}`,
                          fontSize: typography.fontSize.sm,
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              {isOwnProfile && (
                <Link to={`/profile/${username}/edit`}>
                  <Button variant="secondary" size="sm">
                    <svg 
                      className="mr-2"
                      style={{
                        width: icons.size.sm,
                        height: icons.size.sm,
                      }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div 
          style={{
            backgroundColor: colors.surface.default,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
            padding: spacing[6],
          }}
        >
          {/* Tabs */}
          <div 
            style={{
              borderBottom: `1px solid ${colors.border.default}`,
              marginBottom: spacing[6],
            }}
          >
            <nav 
              className="flex"
              style={{ gap: spacing[4] }}
              aria-label="Event tabs"
            >
              <button
                onClick={() => setActiveTab('created')}
                className="border-b-2 font-medium transition-colors"
                style={{
                  paddingTop: spacing[3],
                  paddingBottom: spacing[3],
                  paddingLeft: spacing[1],
                  fontSize: typography.fontSize.sm,
                  borderBottomColor: activeTab === 'created' ? colors.primary[600] : 'transparent',
                  color: activeTab === 'created' ? colors.primary[600] : colors.text.tertiary,
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'created') {
                    e.target.style.color = colors.text.secondary;
                    e.target.style.borderBottomColor = colors.border.dark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'created') {
                    e.target.style.color = colors.text.tertiary;
                    e.target.style.borderBottomColor = 'transparent';
                  }
                }}
              >
                {getTabLabel('created')}
              </button>
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => setActiveTab('rsvped')}
                    className="border-b-2 font-medium transition-colors"
                    style={{
                      paddingTop: spacing[3],
                      paddingBottom: spacing[3],
                      paddingLeft: spacing[1],
                      fontSize: typography.fontSize.sm,
                      borderBottomColor: activeTab === 'rsvped' ? colors.primary[600] : 'transparent',
                      color: activeTab === 'rsvped' ? colors.primary[600] : colors.text.tertiary,
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'rsvped') {
                        e.target.style.color = colors.text.secondary;
                        e.target.style.borderBottomColor = colors.border.dark;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'rsvped') {
                        e.target.style.color = colors.text.tertiary;
                        e.target.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    {getTabLabel('rsvped')}
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className="border-b-2 font-medium transition-colors"
                    style={{
                      paddingTop: spacing[3],
                      paddingBottom: spacing[3],
                      paddingLeft: spacing[1],
                      fontSize: typography.fontSize.sm,
                      borderBottomColor: activeTab === 'past' ? colors.primary[600] : 'transparent',
                      color: activeTab === 'past' ? colors.primary[600] : colors.text.tertiary,
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'past') {
                        e.target.style.color = colors.text.secondary;
                        e.target.style.borderBottomColor = colors.border.dark;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'past') {
                        e.target.style.color = colors.text.tertiary;
                        e.target.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    {getTabLabel('past')}
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Events List */}
          {eventsLoading ? (
            <div style={{ paddingTop: spacing[12], paddingBottom: spacing[12] }}>
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
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gap: spacing[4] }}
            >
              {currentEvents.map((event) => (
                <EventCard key={event._id} event={event} variant="profile" />
              ))}
            </div>
          )}
        </div>
      </LayoutContainer>
    </div>
  );
};


export default Profile;
