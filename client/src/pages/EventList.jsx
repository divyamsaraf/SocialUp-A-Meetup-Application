import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import EventListComponent from '../components/events/EventList';
import EventCard from '../components/events/EventCard';
import FilterBar from '../components/events/FilterBar';
import MapComponent from '../components/maps/MapComponent';
import { eventService } from '../services/event.service';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EventsIntroBanner from '../components/events/EventsIntroBanner';
import { MESSAGING } from '../utils/constants';
import LocationSearch from '../components/location/LocationSearch';

const EventListPage = () => {
  const { selectedLocation } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    eventCategory: searchParams.get('category') || '',
    eventLocationType: searchParams.get('locationType') || '',
    upcoming: searchParams.get('upcoming') === 'true',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const getLocationParams = () => {
    const params = {};
    if (selectedLocation) {
      if (selectedLocation.lat && selectedLocation.lng) {
        params.lat = selectedLocation.lat;
        params.lng = selectedLocation.lng;
        params.radiusMiles = '25';
      } else if (selectedLocation.city) {
        params.city = selectedLocation.city;
        if (selectedLocation.state) params.state = selectedLocation.state;
      } else if (selectedLocation.zipCode) {
        params.zipCode = selectedLocation.zipCode;
      }
    }
    return params;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...filters,
        ...getLocationParams(),
      });
      setSearchParams(params);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams({
      ...(searchQuery && { q: searchQuery }),
      ...(newFilters.eventCategory && { category: newFilters.eventCategory }),
      ...(newFilters.eventLocationType && { locationType: newFilters.eventLocationType }),
      ...(newFilters.upcoming && { upcoming: 'true' }),
      ...getLocationParams(),
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Events near {selectedLocation?.label || 'you'}
        </h1>
        <p className="text-gray-600">Discover what’s happening around you or online.</p>
      </div>

      <EventsIntroBanner
        show={
          !searchQuery &&
          !filters.eventCategory &&
          !filters.eventLocationType &&
          !filters.upcoming
        }
        text={MESSAGING.eventsIntro}
      />

      <div className="mb-6">
        <div className="mb-4">
          <LocationSearch placeholder={selectedLocation?.label || 'Enter city or ZIP code'} />
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name, topic, or location"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Search
          </button>
        </form>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="mb-4 flex justify-between items-center">
        <div className="flex-1">
          <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <EventMapView filters={filters} searchQuery={searchQuery} />
      ) : searchQuery ? (
        <SearchResults query={searchQuery} filters={filters} />
      ) : (
        <EventListComponent filters={filters} />
      )}
    </div>
  );
};

const EventMapView = ({ filters, searchQuery }) => {
  const { selectedLocation } = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filters, searchQuery, selectedLocation]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const locationFilters = {};
      if (selectedLocation) {
        if (selectedLocation.lat && selectedLocation.lng) {
          locationFilters.lat = selectedLocation.lat;
          locationFilters.lng = selectedLocation.lng;
          locationFilters.radiusMiles = 25;
        } else if (selectedLocation.city) {
          locationFilters.city = selectedLocation.city;
          if (selectedLocation.state) locationFilters.state = selectedLocation.state;
        } else if (selectedLocation.zipCode) {
          locationFilters.zipCode = selectedLocation.zipCode;
        }
      }
      
      const combinedFilters = { ...filters, ...locationFilters };
      
      let response;
      if (searchQuery) {
        response = await eventService.searchEvents(searchQuery, combinedFilters, 1, 100);
      } else {
        response = await eventService.getEvents(combinedFilters, 1, 100);
      }
      const eventList = response.data.events || [];
      const inPersonEvents = eventList.filter(
        (e) => e.eventLocationType === 'in-person' && e.location?.coordinates
      );
      setEvents(inPersonEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events with location data found</p>
      </div>
    );
  }

  const mapCenter = selectedLocation?.lat && selectedLocation?.lng
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : null;

  return <MapComponent events={events} center={mapCenter} zoom={12} />;
};

const SearchResults = ({ query, filters }) => {
  const { selectedLocation } = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSearchResults();
  }, [query, filters, page, selectedLocation]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError('');
      
      const locationFilters = {};
      if (selectedLocation) {
        if (selectedLocation.lat && selectedLocation.lng) {
          locationFilters.lat = selectedLocation.lat;
          locationFilters.lng = selectedLocation.lng;
          locationFilters.radiusMiles = 25;
        } else if (selectedLocation.city) {
          locationFilters.city = selectedLocation.city;
          if (selectedLocation.state) locationFilters.state = selectedLocation.state;
        } else if (selectedLocation.zipCode) {
          locationFilters.zipCode = selectedLocation.zipCode;
        }
      }
      
      const combinedFilters = { ...filters, ...locationFilters };
      const response = await eventService.searchEvents(query, combinedFilters, page, 12);
      setEvents(response.data.events || []);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <p className="mb-4 text-gray-600">
        Found {pagination?.total || 0} results for "{query}"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {pagination.pages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.pages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EventListPage;
