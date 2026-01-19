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
import GlobalSearchBar from '../components/common/GlobalSearchBar';
import CategoryRow from '../components/common/CategoryRow';
import EventFiltersRow from '../components/common/EventFiltersRow';
import EventCard from '../components/events/EventCard';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { borderRadius } from '../theme';
import { shadows } from '../theme';
import { icons } from '../theme';
import { cards } from '../theme';
import { transitions } from '../theme';

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
    // Update search query from GlobalSearchBar
    setSearchQuery(data.query || '');
    
    // Update URL params
    setPage(1);
    const params = new URLSearchParams();
    if (data.query) params.set('q', data.query);
    // Keep existing filter params
    if (filters.eventCategory) params.set('category', filters.eventCategory);
    if (filters.eventLocationType) params.set('locationType', filters.eventLocationType);
    if (filters.dateRange && filters.dateRange !== 'all') params.set('dateRange', filters.dateRange);
    if (filters.distance && filters.distance !== '25') params.set('distance', filters.distance);
    if (filters.sortBy && filters.sortBy !== 'date') params.set('sortBy', filters.sortBy);
    setSearchParams(params);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.eventCategory) params.set('category', newFilters.eventCategory);
    if (newFilters.eventLocationType) params.set('locationType', newFilters.eventLocationType);
    if (newFilters.dateRange && newFilters.dateRange !== 'all') params.set('dateRange', newFilters.dateRange);
    if (newFilters.distance && newFilters.distance !== '25') params.set('distance', newFilters.distance);
    if (newFilters.sortBy && newFilters.sortBy !== 'date') params.set('sortBy', newFilters.sortBy);
    setSearchParams(params);
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
    // Announce reset to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = 'All filters have been reset';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    const defaultFilters = {
      eventCategory: '',
      eventLocationType: '',
      dateRange: 'all',
      distance: '25',
      sortBy: 'date',
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = filters.eventCategory || filters.eventLocationType || 
    filters.dateRange !== 'all' || searchQuery.trim() || filters.distance !== '25' || filters.sortBy !== 'date';

  // Show loading state while location context is initializing
  if (locationContextLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background.secondary }}
      >
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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <LayoutContainer>
        {/* Header */}
        <div 
          style={{
            paddingTop: spacing[6],
            paddingBottom: spacing[4],
          }}
        >
          <h1 
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              marginBottom: spacing[2],
            }}
          >
            Events near {safeLocation?.label || 'you'}
          </h1>
        </div>

        {/* Global Search Bar */}
        <div style={{ marginBottom: spacing[4] }}>
          <GlobalSearchBar
            searchScope="events"
            defaultCity={selectedLocation?.label}
            placeholder="Search events, groups or enter a city"
            onSearch={handleGlobalSearch}
          />
        </div>

        {/* Event Filters Row - All filters in a single horizontal row */}
        {/* Note: Category filter removed - categories handled by CategoryRow below */}
        <EventFiltersRow
          selectedFilters={{
            dateRange: filters.dateRange || 'all',
            eventLocationType: filters.eventLocationType || '',
            distance: filters.distance || '25',
            sortBy: filters.sortBy || 'date',
          }}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
          showDistance={!!(selectedLocation?.lat && selectedLocation?.lng)}
        />

        {/* Category Row - Dynamic, scrollable categories with arrows */}
        <CategoryRow
          categories={categories.map(cat => ({
            id: cat.isSpecial && cat.specialType === 'all_events' ? 'all_events' : cat.name,
            name: cat.name,
            label: cat.name,
            icon: cat.icon,
            isSpecial: cat.isSpecial,
            specialType: cat.specialType,
          }))}
          selectedCategoryId={
            filters.eventCategory 
              ? filters.eventCategory 
              : (categories.find(cat => cat.isSpecial && cat.specialType === 'all_events') ? 'all_events' : '')
          }
          onCategorySelect={handleCategoryClick}
          ariaLabel="Event category filters"
          showArrowsOnMobile={false}
        />

        {/* Events Grid */}
        <div>
          <div 
            className="flex items-center justify-between"
            style={{ marginBottom: spacing[4] }}
          >
            <h2 
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {searchQuery ? `Search results` : 'Events'}
            </h2>
            {pagination && (
              <p 
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
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
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{
                  gap: spacing[4],
                  marginBottom: spacing[6],
                }}
              >
                {events.filter(event => event && event._id).map((event) => (
                  <EventCard key={event._id} event={event} variant="compact" />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div 
                  className="flex justify-center items-center"
                  style={{ gap: spacing[2] }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span 
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      paddingLeft: spacing[4],
                      paddingRight: spacing[4],
                    }}
                  >
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


export default EventListPage;
