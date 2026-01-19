import { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { fetchNominatimSuggestions } from '../../utils/locationUtils';

const CompactSearchBar = ({ onSearch }) => {
  const { selectedLocation, updateLocation } = useLocation();
  const [query, setQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const locationInputRef = useRef(null);
  const locationRef = useRef(null);
  const dropdownRef = useRef(null);
  const hasSelectedLocation = selectedLocation && selectedLocation.label;

  // Update display value when location is selected (but not when user is typing)
  useEffect(() => {
    if (!isFocused && hasSelectedLocation) {
      setLocationQuery(selectedLocation.label);
    }
  }, [selectedLocation, isFocused, hasSelectedLocation]);

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    if (!locationQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      setError('');
      return;
    }

    // Only search if query is at least 2 characters to avoid too many API calls
    if (locationQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setError('');
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const results = await fetchNominatimSuggestions(locationQuery, 6);
        setSuggestions(results);
        
        // Only show dropdown if we have results or are still loading
        if (results.length > 0) {
          setShowDropdown(true);
          setError('');
        } else {
          // Only show "No results found" if query is substantial (3+ chars)
          // This prevents showing error for very short queries
          if (locationQuery.trim().length >= 3) {
            setError('No results found');
            setShowDropdown(true);
          } else {
            setShowDropdown(false);
            setError('');
          }
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions. Please try again.');
        setSuggestions([]);
        setShowDropdown(true); // Show dropdown with error message
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle focus: auto-clear if city is already selected
  const handleLocationFocus = () => {
    setIsFocused(true);
    setError('');
    
    // Auto-clear if a location is already selected
    if (hasSelectedLocation && locationQuery === selectedLocation.label) {
      setLocationQuery('');
      // Small delay to ensure input is cleared before focusing cursor
      setTimeout(() => {
        locationInputRef.current?.setSelectionRange(0, 0);
      }, 0);
    }
    
    // Show dropdown if there are suggestions
    if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle blur: restore selected location if input is empty
  const handleLocationBlur = () => {
    setIsFocused(false);
    // Small delay to allow click events on dropdown items to fire
    setTimeout(() => {
      if (!locationQuery.trim() && hasSelectedLocation) {
        setLocationQuery(selectedLocation.label);
      }
    }, 200);
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
    setLocationQuery(suggestion.label);
    setShowDropdown(false);
    setIsFocused(false);
    setError('');
    setSelectedIndex(-1);
  };

  // Handle clear button click
  const handleClearLocation = (e) => {
    e.stopPropagation();
    setLocationQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setError('');
    setSelectedIndex(-1);
    
    // Reset to default location
    const defaultLoc = {
      city: 'Seattle',
      state: 'WA',
      zipCode: null,
      lat: 47.6062,
      lng: -122.3321,
      label: 'Seattle, WA',
    };
    updateLocation(defaultLoc);
    
    // Focus input after clearing
    setTimeout(() => {
      locationInputRef.current?.focus();
    }, 0);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }

    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!locationQuery.trim()) {
          setError('Please enter a city.');
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleLocationSelect(suggestions[selectedIndex]);
        } else if (!locationQuery.trim()) {
          setError('Please enter a city.');
        }
        break;
      default:
        break;
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validate location if required
    if (!locationQuery.trim() && !hasSelectedLocation) {
      setError('Please enter a city.');
      locationInputRef.current?.focus();
      return;
    }

    setError('');
    onSearch?.(query, selectedLocation);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-full border-2 border-gray-200 shadow-lg hover:shadow-xl p-2 transition-shadow">
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 sm:border-r sm:border-gray-200">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events & groups"
            className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-base"
          />
        </div>
        <div className="flex-1 relative" ref={locationRef}>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <svg 
              className="w-5 h-5 text-gray-400 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 relative">
              <input
                ref={locationInputRef}
                type="text"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setError('');
                }}
                onFocus={handleLocationFocus}
                onBlur={handleLocationBlur}
                onKeyDown={handleKeyDown}
                placeholder="Search events, groups or enter a new city"
                className="w-full outline-none text-gray-900 placeholder-gray-500 text-base"
                aria-label="City or ZIP code"
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'location-error' : undefined}
              />
              {/* Clear button - always visible when there's text or selected location */}
              {(locationQuery || hasSelectedLocation) && (
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-700 transition-colors p-1"
                  aria-label="Clear city selection"
                  tabIndex={0}
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div 
                id="location-error" 
                className="absolute top-full left-0 right-0 mt-1 text-xs text-red-600 px-4"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Dropdown suggestions */}
            {showDropdown && (suggestions.length > 0 || loading || (error && locationQuery.trim().length >= 2)) && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                role="listbox"
                aria-label="City suggestions"
              >
                {loading ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center" role="status" aria-live="polite">
                    Searching...
                  </div>
                ) : error && suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center" role="status">
                    {error}
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, idx) => (
                    <button
                      key={`${suggestion.lat}-${suggestion.lng}-${idx}`}
                      type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      role="option"
                      aria-selected={selectedIndex === idx}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-0 transition-colors ${
                        selectedIndex === idx ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="text-sm text-gray-900 font-medium">{suggestion.label}</div>
                      {suggestion.displayName && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {suggestion.displayName}
                        </div>
                      )}
                    </button>
                  ))
                ) : null}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default CompactSearchBar;
