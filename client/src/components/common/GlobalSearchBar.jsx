import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { fetchNominatimSuggestions } from '../../utils/locationUtils';
import CityInput from './CityInput';
import FiltersDropdown from './FiltersDropdown';
import SuggestionList from './SuggestionList';
import Button from '../ui/Button';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { inputs } from '../../theme';
import { icons } from '../../theme';
import { zIndex } from '../../theme';

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
  const [userRequestedSuggestions, setUserRequestedSuggestions] = useState(false);
  
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
  // Don't show suggestions on initial load if city is already selected
  useEffect(() => {
    if (selectedLocation?.label && !defaultCity) {
      setCityQuery(selectedLocation.label);
      setUserRequestedSuggestions(false); // Don't auto-show suggestions if city is already set
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
  // Only show suggestions if user has no city selected OR user explicitly requested suggestions
  useEffect(() => {
    if (!cityQuery.trim() || cityQuery === selectedLocation?.label) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (cityQuery.trim().length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    // Only show dropdown if:
    // 1. User has no city selected (no selectedLocation or default location), OR
    // 2. User is actively typing/searching (userRequestedSuggestions is true)
    const shouldShowDropdown = !selectedLocation || 
                               selectedLocation.label === 'Seattle, WA' || // Default location
                               userRequestedSuggestions;

    if (!shouldShowDropdown) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
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
  }, [cityQuery, selectedLocation, userRequestedSuggestions]);

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
      // TODO: Implement backend API integration for suggestions
      // const api = require('../../services/api').default;
      // const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}&scope=${scope}`);
      // return response.data?.suggestions || [];
      return [];
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      return [];
    }
  };

  // Handle city input focus - auto-clear if prefilled and mark that user is requesting suggestions
  const handleCityFocus = () => {
    if (selectedLocation && cityQuery === selectedLocation.label) {
      setCityQuery('');
      setUserRequestedSuggestions(true); // User is actively searching
      setTimeout(() => {
        cityInputRef.current?.setSelectionRange(0, 0);
      }, 0);
    } else {
      // User clicked on input, they want to see suggestions
      setUserRequestedSuggestions(true);
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
    setUserRequestedSuggestions(false); // Reset flag after selection
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
    <div ref={containerRef} style={{ gap: spacing[3] }} className="space-y-3">
      <form onSubmit={handleSubmit} style={{ gap: spacing[3] }} className="space-y-3">
        <div className="flex flex-col sm:flex-row" style={{ gap: spacing[2] }}>
          {/* Search Input */}
          <div className="flex-1 relative">
            <div 
              className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
              style={{
                paddingLeft: spacing[4],
              }}
            >
              <svg 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
                style={{
                  width: icons.size.md,
                  height: icons.size.md,
                  strokeWidth: icons.strokeWidth.normal,
                  color: colors.text.tertiary,
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full focus:outline-none focus:ring-2"
              style={{
                ...inputs.base,
                ...inputs.size.md,
                ...inputs.state.default,
                borderRadius: borderRadius.lg,
                paddingLeft: '3rem',
                paddingRight: searchQuery ? '2.5rem' : spacing[4],
              }}
              onFocus={(e) => {
                e.target.style.border = `2px solid ${colors.border.focus}`;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                setShowSuggestions(true);
              }}
              onBlur={(e) => {
                e.target.style.border = `1px solid ${colors.border.default}`;
                e.target.style.boxShadow = 'none';
              }}
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
                className="absolute inset-y-0 right-0 flex items-center transition-colors hover:opacity-80"
                style={{
                  paddingRight: spacing[3],
                  color: colors.text.tertiary,
                }}
                aria-label="Clear search"
                title="Clear search"
              >
                <svg 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{
                    width: icons.size.sm,
                    height: icons.size.sm,
                    strokeWidth: icons.strokeWidth.normal,
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                className="absolute w-full overflow-y-auto"
                style={{
                  marginTop: spacing[1],
                  backgroundColor: colors.surface.default,
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: borderRadius.lg,
                  boxShadow: shadows.xl,
                  zIndex: zIndex.modal,
                  maxHeight: '16rem',
                }}
                role="listbox"
                aria-label="Location suggestions"
              >
                {locationLoading ? (
                  <div 
                    style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      textAlign: 'center',
                    }}
                  >
                    Searching...
                  </div>
                ) : locationSuggestions.length === 0 ? (
                  <div 
                    style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      textAlign: 'center',
                    }}
                  >
                    {locationError || 'No results found'}
                  </div>
                ) : (
                  locationSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full text-left transition-colors hover:opacity-90"
                      style={{
                        padding: `${spacing[2.5]} ${spacing[4]}`,
                        borderBottom: idx < locationSuggestions.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.background.tertiary;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      role="option"
                    >
                      <div 
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.primary,
                          fontWeight: typography.fontWeight.medium,
                        }}
                      >
                        {suggestion.label}
                      </div>
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
        <div 
          style={{
            backgroundColor: colors.surface.default,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.sm,
            border: `1px solid ${colors.border.default}`,
            padding: spacing[3],
          }}
        >
          <div className="flex flex-wrap items-center" style={{ gap: spacing[3] }}>
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
