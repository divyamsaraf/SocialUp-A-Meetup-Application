import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventListComponent from '../components/events/EventList';
import EventCard from '../components/events/EventCard';
import FilterBar from '../components/events/FilterBar';
import MapComponent from '../components/maps/MapComponent';
import { eventService } from '../services/event.service';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const EventListPage = () => {
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...filters,
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
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Events</h1>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filters, searchQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      if (searchQuery) {
        response = await eventService.searchEvents(searchQuery, filters, 1, 100);
      } else {
        response = await eventService.getEvents(filters, 1, 100);
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

  return <MapComponent events={events} />;
};

const SearchResults = ({ query, filters }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSearchResults();
  }, [query, filters, page]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventService.searchEvents(query, filters, page, 12);
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
