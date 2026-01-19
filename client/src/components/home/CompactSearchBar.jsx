import { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { fetchNominatimSuggestions } from '../../utils/locationUtils';
import Button from '../ui/Button';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { icons } from '../../theme';
import { zIndex } from '../../theme';
import { transitions } from '../../theme';

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

  // Fetch suggestions as user types (debounced) - only when input is focused
  useEffect(() => {
    // Don't fetch or show dropdown if input is not focused
    if (!isFocused) {
      setShowDropdown(false);
      return;
    }

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
      // Double-check that input is still focused before showing results
      if (!isFocused) {
        return;
      }

      setLoading(true);
      setError('');
      try {
        const results = await fetchNominatimSuggestions(locationQuery, 6);
        setSuggestions(results);
        
        // Only show dropdown if input is still focused and we have results
        if (isFocused && results.length > 0) {
          setShowDropdown(true);
          setError('');
        } else if (isFocused && locationQuery.trim().length >= 3) {
          // Only show "No results found" if query is substantial (3+ chars)
          setError('No results found');
          setShowDropdown(true);
        } else {
          setShowDropdown(false);
          if (locationQuery.trim().length < 3) {
            setError('');
          }
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions. Please try again.');
        setSuggestions([]);
        // Only show dropdown if input is still focused
        if (isFocused) {
          setShowDropdown(true);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationQuery, isFocused]);

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
    // Close dropdown immediately on blur
    setShowDropdown(false);
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
      <div 
        className="flex flex-col sm:flex-row"
        style={{
          gap: spacing[2],
          backgroundColor: colors.surface.default,
          borderRadius: borderRadius.full,
          border: `2px solid ${colors.border.default}`,
          boxShadow: shadows.lg,
          padding: spacing[2],
          transition: transitions.preset.default,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadows.xl;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadows.lg;
        }}
      >
        <div 
          className="flex-1 flex items-center"
          style={{
            gap: spacing[3],
            padding: `${spacing[2.5]} ${spacing[4]}`,
            borderRight: `1px solid ${colors.border.light}`,
          }}
        >
          <svg 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              width: icons.size.md,
              height: icons.size.md,
              strokeWidth: icons.strokeWidth.normal,
              color: colors.text.tertiary,
              flexShrink: 0,
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events & groups"
            className="flex-1 outline-none"
            style={{
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
            }}
          />
        </div>
        <div 
          className="flex-1 flex items-center relative" 
          ref={locationRef}
          style={{
            gap: spacing[3],
            padding: `${spacing[2.5]} ${spacing[4]}`,
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
              flexShrink: 0,
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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
            className="flex-1 outline-none"
            style={{
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
              paddingRight: (locationQuery || hasSelectedLocation) ? spacing[8] : 0,
            }}
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
              className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-colors hover:opacity-80"
              style={{
                color: colors.text.tertiary,
                padding: spacing[1],
              }}
              aria-label="Clear city selection"
              tabIndex={0}
            >
              <svg 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
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
          
          {/* Error message */}
          {error && (
            <div 
              id="location-error" 
              className="absolute top-full left-0 right-0"
              style={{
                marginTop: spacing[1],
                fontSize: typography.fontSize.xs,
                color: colors.error[600],
                paddingLeft: spacing[4],
                paddingRight: spacing[4],
              }}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* Dropdown suggestions - only show when input is focused */}
          {isFocused && showDropdown && (suggestions.length > 0 || loading || (error && locationQuery.trim().length >= 2)) && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 overflow-y-auto"
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
                aria-label="City suggestions"
              >
                {loading ? (
                  <div 
                    style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      textAlign: 'center',
                    }}
                    role="status" 
                    aria-live="polite"
                  >
                    Searching...
                  </div>
                ) : error && suggestions.length === 0 ? (
                  <div 
                    style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                      textAlign: 'center',
                    }}
                    role="status"
                  >
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
                      className="w-full text-left focus:outline-none transition-colors hover:opacity-90"
                      style={{
                        padding: `${spacing[2.5]} ${spacing[4]}`,
                        borderBottom: idx < suggestions.length - 1 ? `1px solid ${colors.border.light}` : 'none',
                        backgroundColor: selectedIndex === idx ? colors.primary[50] : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedIndex !== idx) {
                          e.target.style.backgroundColor = colors.background.tertiary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedIndex !== idx) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
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
                      {suggestion.displayName && (
                        <div 
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                            marginTop: spacing[0.5],
                          }}
                          className="line-clamp-1"
                        >
                          {suggestion.displayName}
                        </div>
                      )}
                    </button>
                  ))
                ) : null}
            </div>
          )}
        </div>
        <Button
          type="submit"
          style={{
            paddingLeft: spacing[8],
            paddingRight: spacing[8],
            borderRadius: borderRadius.full,
            fontWeight: typography.fontWeight.semibold,
            boxShadow: shadows.md,
          }}
          className="hover:shadow-lg transition-all"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default CompactSearchBar;
