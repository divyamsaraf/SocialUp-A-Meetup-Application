import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { useLocation } from '../contexts/LocationContext';
import { eventService } from '../services/event.service';
import { categoryService } from '../services/category.service';
import { EVENT_LOCATION_TYPES } from '../utils/constants';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import GlobalSearchBar from '../components/common/GlobalSearchBar';

/**
 * Events Page - Meetup-inspired design with dynamic categories and compact event cards
 * 
 * Features:
 * - Search bar with city autocomplete (auto-clear on focus)
 * - Horizontal filter bar (Date, Category, Type, Distance, Sort)
 * - Dynamic categories row (admin-editable, scrollable on mobile)
 * - Compact event cards with hover effects
 * - Responsive grid layout
 */
const EventListPage = () => {
  const { selectedLocation, updateLocation, requestGeolocation, loading: locationContextLoading } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search state - use safe defaults
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  
  // Filter state
  const [filters, setFilters] = useState({
    eventCategory: searchParams.get('category') || '',
    eventLocationType: searchParams.get('locationType') || '',
    dateRange: searchParams.get('dateRange') || 'all',
    distance: searchParams.get('distance') || '25',
    sortBy: searchParams.get('sortBy') || 'date',
  });
  
  // Categories and events
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Default categories fallback function (defined before use)
  const getDefaultCategories = () => [
    { name: "Events near Seattle, WA", icon: "✨", isSpecial: true, specialType: "events_near" },
    { name: "All events", icon: "👥", isSpecial: true, specialType: "all_events" },
    { name: "New Groups", icon: "🍕", isSpecial: true, specialType: "new_groups" },
    { name: "Social Activities", icon: "🧸" },
    { name: "Hobbies & Passions", icon: "⚽" },
    { name: "Sports & Fitness", icon: "🌳" },
    { name: "Travel & Outdoor", icon: "🧳" },
    { name: "Career & Business", icon: "💻" },
    { name: "Technology", icon: "🏢" },
    { name: "Community & Environment", icon: "🌍" },
    { name: "Health & Wellbeing", icon: "🧠" },
    { name: "Art & Culture", icon: "🎨" },
  ];

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const categoriesData = response.data?.categories || response.categories || [];
      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        // If API returns empty array, use fallback
        setCategories(getDefaultCategories());
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Fallback to default categories if API fails
      setCategories(getDefaultCategories());
    }
  };

  // Define fetchEvents BEFORE useEffect that uses it
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build location filters inline to avoid dependency issues
      const locationFilters = {};
      if (selectedLocation) {
        if (selectedLocation.lat && selectedLocation.lng) {
          locationFilters.lat = selectedLocation.lat;
          locationFilters.lng = selectedLocation.lng;
          locationFilters.radiusMiles = parseInt(filters.distance) || 25;
        } else if (selectedLocation.city) {
          locationFilters.city = selectedLocation.city;
          if (selectedLocation.state) locationFilters.state = selectedLocation.state;
        } else if (selectedLocation.zipCode) {
          locationFilters.zipCode = selectedLocation.zipCode;
        }
      }
      
      // Build date filter inline
      const now = new Date();
      let dateFilter = null;
      switch (filters.dateRange) {
        case 'today':
          dateFilter = { start: now, end: addDays(now, 1) };
          break;
        case 'tomorrow':
          dateFilter = { start: addDays(now, 1), end: addDays(now, 2) };
          break;
        case 'week':
          dateFilter = { start: now, end: addDays(now, 7) };
          break;
        case 'month':
          dateFilter = { start: now, end: addDays(now, 30) };
          break;
      }
      
      // Build filters object, removing empty values
      const combinedFilters = {
        ...(filters.eventCategory && { eventCategory: filters.eventCategory }),
        ...(filters.eventLocationType && { eventLocationType: filters.eventLocationType }),
        ...locationFilters,
        ...(filters.dateRange !== 'all' && { upcoming: true }),
      };
      
      let response;
      if (searchQuery.trim()) {
        response = await eventService.searchEvents(searchQuery, combinedFilters, page, 20);
      } else {
        response = await eventService.getEvents(combinedFilters, page, 20);
      }
      
      // Response is already processed by eventService to extract data
      // Should be { events: [], pagination: {} }
      let eventList = response?.events || response?.data?.events || [];
      
      if (!Array.isArray(eventList)) {
        console.error('Invalid response format:', response);
        eventList = [];
      }
      
      // Apply date filter client-side if needed
      if (dateFilter) {
        eventList = eventList.filter(event => {
          const eventDate = new Date(event.dateAndTime);
          return eventDate >= dateFilter.start && eventDate < dateFilter.end;
        });
      }
      
      // Apply sorting inline
      const sorted = [...eventList];
      switch (filters.sortBy) {
        case 'popularity':
          sorted.sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0));
          break;
        case 'relevance':
          sorted.sort((a, b) => {
            const dateA = new Date(a.dateAndTime);
            const dateB = new Date(b.dateAndTime);
            if (dateA.getTime() === dateB.getTime()) {
              return (b.attendees?.length || 0) - (a.attendees?.length || 0);
            }
            return dateA - dateB;
          });
          break;
        case 'date':
        default:
          sorted.sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime));
      }
      eventList = sorted;
      
      setEvents(eventList);
      setPagination(response?.pagination || response?.data?.pagination || { page, limit: 20, total: eventList.length, pages: 1 });
    } catch (err) {
      console.error('Error fetching events:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      // More specific error messages
      let errorMessage = 'Failed to load events';
      if (err.response?.status === 404) {
        errorMessage = 'Events endpoint not found. Please check your API configuration.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setEvents([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [
    filters.eventCategory,
    filters.eventLocationType,
    filters.dateRange,
    filters.distance,
    filters.sortBy,
    searchQuery,
    selectedLocation,
    page
  ]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch events when filters/search change (wait for location to load)
  useEffect(() => {
    // Wait for location context to finish loading before fetching events
    if (!locationContextLoading && selectedLocation !== null) {
      fetchEvents();
    }
  }, [fetchEvents, locationContextLoading, selectedLocation]);

  // Handle search from GlobalSearchBar
  const handleGlobalSearch = (data) => {
    // Update search query and filters from GlobalSearchBar
    setSearchQuery(data.query || '');
    
    // Update filters from GlobalSearchBar filters
    if (data.filters) {
      setFilters(prev => ({
        ...prev,
        eventCategory: data.filters.Category || prev.eventCategory,
        eventLocationType: data.filters.Type || prev.eventLocationType,
        dateRange: data.filters.Date || prev.dateRange,
        distance: data.filters.Distance || prev.distance,
        sortBy: data.filters.Sort || prev.sortBy,
      }));
    }
    
    // Update URL params
    setPage(1);
    const params = new URLSearchParams();
    if (data.query) params.set('q', data.query);
    if (data.filters?.Category) params.set('category', data.filters.Category);
    if (data.filters?.Type) params.set('locationType', data.filters.Type);
    if (data.filters?.Date && data.filters.Date !== 'all') params.set('dateRange', data.filters.Date);
    if (data.filters?.Distance && data.filters.Distance !== '25') params.set('distance', data.filters.Distance);
    if (data.filters?.Sort && data.filters.Sort !== 'date') params.set('sortBy', data.filters.Sort);
    setSearchParams(params);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    if (category.isSpecial) {
      // Handle special categories
      if (category.specialType === 'all_events') {
        handleFilterChange('eventCategory', '');
      } else if (category.specialType === 'events_near') {
        // Already showing events near location
        handleFilterChange('eventCategory', '');
      } else if (category.specialType === 'new_groups') {
        // Could navigate to groups page or filter by new groups
        handleFilterChange('eventCategory', '');
      }
    } else {
      handleFilterChange('eventCategory', category.name);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      eventCategory: '',
      eventLocationType: '',
      dateRange: 'all',
      distance: '25',
      sortBy: 'date',
    });
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = filters.eventCategory || filters.eventLocationType || 
    filters.dateRange !== 'all' || searchQuery.trim() || filters.distance !== '25' || filters.sortBy !== 'date';

  // Show loading state while location context is initializing
  if (locationContextLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Ensure we have a valid selectedLocation before rendering
  const safeLocation = selectedLocation || {
    city: 'Seattle',
    state: 'WA',
    zipCode: null,
    lat: 47.6062,
    lng: -122.3321,
    label: 'Seattle, WA',
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        {/* Header */}
        <div className="pt-6 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Events near {safeLocation?.label || 'you'}
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="mb-4">
          <GlobalSearchBar
            searchScope="events"
            filters={[
              {
                name: 'Date',
                options: [
                  { value: 'all', label: 'All dates' },
                  { value: 'today', label: 'Today' },
                  { value: 'tomorrow', label: 'Tomorrow' },
                  { value: 'week', label: 'This week' },
                  { value: 'month', label: 'This month' },
                ],
                defaultValue: filters.dateRange,
              },
              {
                name: 'Category',
                options: categories
                  .filter(cat => !cat.isSpecial)
                  .map(cat => ({ value: cat.name, label: cat.name })),
                defaultValue: filters.eventCategory,
              },
              {
                name: 'Type',
                options: [
                  { value: EVENT_LOCATION_TYPES.ONLINE, label: 'Online' },
                  { value: EVENT_LOCATION_TYPES.IN_PERSON, label: 'In Person' },
                ],
                defaultValue: filters.eventLocationType,
              },
              ...(selectedLocation?.lat && selectedLocation?.lng ? [{
                name: 'Distance',
                options: [
                  { value: '5', label: 'Within 5 miles' },
                  { value: '10', label: 'Within 10 miles' },
                  { value: '25', label: 'Within 25 miles' },
                  { value: '50', label: 'Within 50 miles' },
                  { value: '100', label: 'Within 100 miles' },
                ],
                defaultValue: filters.distance,
              }] : []),
              {
                name: 'Sort',
                options: [
                  { value: 'date', label: 'Sort by date' },
                  { value: 'popularity', label: 'Sort by popularity' },
                  { value: 'relevance', label: 'Sort by relevance' },
                ],
                defaultValue: filters.sortBy,
              },
            ]}
            defaultCity={selectedLocation?.label}
            placeholder="Search events, groups or enter a city"
            onSearch={handleGlobalSearch}
          />
        </div>

        {/* Dynamic Categories Row - Scrollable on Mobile */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((category) => {
                const isActive = category.isSpecial
                  ? category.specialType === 'all_events' && !filters.eventCategory
                  : filters.eventCategory === category.name;
                
                return (
                  <button
                    key={category._id || category.name}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery ? `Search results` : 'Events'}
            </h2>
            {pagination && (
              <p className="text-sm text-gray-600">
                {pagination.total} {pagination.total === 1 ? 'event' : 'events'}
              </p>
            )}
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : events.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title="No events found"
              message="Try adjusting your filters or search to find more events."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {events.filter(event => event && event._id).map((event) => (
                  <CompactEventCard key={event._id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </LayoutContainer>
    </div>
  );
};

/**
 * Compact Event Card - Meetup-style design
 * Reduced padding/margins while maintaining readability
 */
const CompactEventCard = ({ event }) => {
  // Safety check
  if (!event) {
    return null;
  }

  const isOnline = event.eventLocationType === 'online';
  const eventDate = event.dateAndTime ? new Date(event.dateAndTime) : new Date();
  const city = event.location?.city;
  const state = event.location?.state;
  const distanceMiles = event.distanceMiles;
  const attendeeCount = event.attendees?.length || 0;
  const hostName = event.hostedBy?.name || 'Host';
  const groupName = event.groupDetail?.groupName;

  const getDateLabel = () => {
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    return format(eventDate, 'EEE, MMM d');
  };

  const timeLabel = format(eventDate, 'h:mm a');

  if (!event._id) {
    console.warn('Event missing _id:', event);
    return null;
  }

  return (
    <Card hover clickable className="h-full">
      <Link to={`/events/${event._id}`} className="block h-full">
        {/* Event Image - Compact */}
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

        <div className="p-3">
          {/* Date & Time - Compact */}
          <div className="text-xs font-semibold text-blue-600 mb-1">
            {getDateLabel()} · {timeLabel}
          </div>

          {/* Title - Compact */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Location - Compact */}
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
                  {distanceMiles != null && ` · ${distanceMiles} mi`}
                </span>
              </>
            )}
          </div>

          {/* Group Name - Compact */}
          {groupName && (
            <div className="text-xs text-blue-600 mb-2 truncate">
              {groupName}
            </div>
          )}

          {/* Footer - Compact */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{attendeeCount}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Free
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default EventListPage;
