import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { fetchNominatimSuggestions } from '../../utils/locationUtils';
import CityInput from './CityInput';
import FiltersDropdown from './FiltersDropdown';
import SuggestionList from './SuggestionList';
import Button from '../ui/Button';

/**
 * GlobalSearchBar - Reusable search component for Events, Groups, and other pages
 * 
 * Features:
 * - Search input with dynamic suggestions
 * - City input with auto-clear, location CTA, and clear button
 * - Configurable filters (date, category, type, distance, sort)
 * - Responsive design (mobile/tablet/desktop)
 * - Full accessibility support
 * - Dynamic suggestions from backend
 * 
 * @param {Object} props
 * @param {string} props.searchScope - "events" | "groups" | "both"
 * @param {Array} props.filters - Array of filter objects {name, options, defaultValue}
 * @param {string} props.defaultCity - Optional prefilled city
 * @param {Function} props.onSearch - Callback when search is submitted (receives {query, city, filters})
 * @param {string} props.placeholder - Optional placeholder override
 * @param {Function} props.onSuggestionsFetch - Optional callback to fetch custom suggestions
 */
const GlobalSearchBar = ({
  searchScope = 'both',
  filters = [],
  defaultCity = null,
  onSearch,
  placeholder = 'Search events, groups or enter a city',
  onSuggestionsFetch = null,
}) => {
  const { selectedLocation, updateLocation, requestGeolocation } = useLocation();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState(() => defaultCity || selectedLocation?.label || '');
  
  // Initialize filters from props
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const initial = {};
    filters.forEach(filter => {
      initial[filter.name] = filter.defaultValue || '';
    });
    return initial;
  });
  
  // Sync filters when defaultValue props change (for controlled behavior)
  useEffect(() => {
    const updated = {};
    filters.forEach(filter => {
      // Only update if defaultValue is explicitly provided
      if (filter.defaultValue !== undefined) {
        updated[filter.name] = filter.defaultValue;
      } else {
        updated[filter.name] = selectedFilters[filter.name] || '';
      }
    });
    setSelectedFilters(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.map(f => `${f.name}:${f.defaultValue || ''}`).join(',')]);
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  // Loading states
  const [locationLoading, setLocationLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Refs
  const searchInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Initialize city query from selectedLocation
  useEffect(() => {
    if (selectedLocation?.label && !defaultCity) {
      setCityQuery(selectedLocation.label);
    }
  }, [selectedLocation, defaultCity]);

  // Fetch dynamic suggestions when search query changes
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSuggestionsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        let fetchedSuggestions = [];
        
        if (onSuggestionsFetch) {
          // Use custom suggestion fetcher
          fetchedSuggestions = await onSuggestionsFetch(searchQuery, searchScope);
        } else {
          // Default: fetch from backend based on scope
          fetchedSuggestions = await fetchDefaultSuggestions(searchQuery, searchScope);
        }
        
        setSuggestions(fetchedSuggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, searchScope, onSuggestionsFetch]);

  // Fetch location suggestions when city query changes
  useEffect(() => {
    if (!cityQuery.trim() || cityQuery === selectedLocation?.label) {
      setLocationSuggestions([]);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (cityQuery.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setLocationLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await fetchNominatimSuggestions(cityQuery, 6);
        setLocationSuggestions(results);
        setShowLocationDropdown(true);
        setLocationError('');
      } catch (err) {
        setLocationError('Failed to load suggestions');
        setLocationSuggestions([]);
      } finally {
        setLocationLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cityQuery, selectedLocation]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch default suggestions (can be overridden)
  const fetchDefaultSuggestions = async (query, scope) => {
    // This would typically call your backend API
    // For now, return empty array - implement based on your API
    try {
      // Example implementation:
      // const api = require('../../services/api').default;
      // const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}&scope=${scope}`);
      // return response.data?.suggestions || [];
      return [];
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      return [];
    }
  };

  // Handle city input focus - auto-clear if prefilled
  const handleCityFocus = () => {
    if (selectedLocation && cityQuery === selectedLocation.label) {
      setCityQuery('');
      setTimeout(() => {
        cityInputRef.current?.setSelectionRange(0, 0);
      }, 0);
    }
  };

  // Handle location selection from dropdown
  const handleLocationSelect = (suggestion) => {
    const location = {
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
      lat: suggestion.lat,
      lng: suggestion.lng,
      label: suggestion.label,
    };
    updateLocation(location);
    setCityQuery(suggestion.label);
    setShowLocationDropdown(false);
    setLocationError('');
  };

  // Handle "Use my location" CTA
  const handleUseMyLocation = async () => {
    setLocationLoading(true);
    setLocationError('');
    setShowLocationDropdown(false);
    
    try {
      const location = await requestGeolocation();
      setCityQuery(location.label);
    } catch (err) {
      console.error('Geolocation error:', err);
      
      if (err.message?.includes('denied') || err.message?.includes('permission')) {
        setLocationError('Location access denied');
      } else if (err.message?.includes('unavailable') || err.message?.includes('timeout')) {
        setLocationError('Location unavailable');
      } else {
        setLocationError('Unable to get your location');
      }
      
      // Fallback to default
      const defaultLoc = {
        city: 'Seattle',
        state: 'WA',
        zipCode: null,
        lat: 47.6062,
        lng: -122.3321,
        label: 'Seattle, WA',
      };
      updateLocation(defaultLoc);
      setCityQuery(defaultLoc.label);
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle clear city
  const handleClearCity = () => {
    setCityQuery('');
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    const defaultLoc = {
      city: 'Seattle',
      state: 'WA',
      zipCode: null,
      lat: 47.6062,
      lng: -122.3321,
      label: 'Seattle, WA',
    };
    updateLocation(defaultLoc);
  };

  // Handle filter change
  const handleFilterChange = useCallback((filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation: require at least search query or city or filters
    if (!searchQuery.trim() && !cityQuery.trim() && 
        Object.values(selectedFilters).every(v => !v)) {
      // Show warning or allow empty search based on requirements
      return;
    }

    // Close dropdowns
    setShowSuggestions(false);
    setShowLocationDropdown(false);

    // Call onSearch callback
    if (onSearch) {
      onSearch({
        query: searchQuery.trim(),
        city: cityQuery.trim(),
        location: selectedLocation,
        filters: selectedFilters,
      });
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.type === 'location') {
      handleLocationSelect(suggestion);
    } else {
      // Handle event/group suggestion
      setSearchQuery(suggestion.title || suggestion.name || '');
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              aria-label="Search input"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="search-suggestions"
            />
            {/* Clear button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
              <SuggestionList
                ref={suggestionsRef}
                suggestions={suggestions}
                loading={suggestionsLoading}
                query={searchQuery}
                onSelect={handleSuggestionSelect}
                id="search-suggestions"
              />
            )}
          </div>

          {/* City Input */}
          <div className="flex-1 relative">
            <CityInput
              ref={cityInputRef}
              value={cityQuery}
              onChange={setCityQuery}
              onFocus={handleCityFocus}
              onLocationClick={handleUseMyLocation}
              onClear={handleClearCity}
              locationLoading={locationLoading}
              locationError={locationError}
              placeholder="City or ZIP"
            />
            
            {/* Location Dropdown */}
            {showLocationDropdown && (locationSuggestions.length > 0 || locationLoading) && (
              <div
                ref={locationDropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                role="listbox"
                aria-label="Location suggestions"
              >
                {locationLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
                ) : locationSuggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    {locationError || 'No results found'}
                  </div>
                ) : (
                  locationSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                      role="option"
                    >
                      <div className="text-sm text-gray-900 font-medium">{suggestion.label}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <Button type="submit" className="whitespace-nowrap">
            Search
          </Button>
        </div>
      </form>

      {/* Filters Row */}
      {filters.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <FiltersDropdown
                key={filter.name}
                name={filter.name}
                options={filter.options}
                value={selectedFilters[filter.name] || ''}
                onChange={(value) => handleFilterChange(filter.name, value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;
