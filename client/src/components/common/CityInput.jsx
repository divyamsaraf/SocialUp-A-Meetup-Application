import { forwardRef } from 'react';

/**
 * CityInput - Reusable city input with location CTA and clear button
 * 
 * Features:
 * - Auto-clear on focus if prefilled
 * - Location emoji CTA (📍) with geolocation
 * - Clear "X" button
 * - Loading state for location detection
 * - Error handling
 * 
 * @param {Object} props
 * @param {string} props.value - Current city value
 * @param {Function} props.onChange - Callback when value changes
 * @param {Function} props.onFocus - Callback when input is focused
 * @param {Function} props.onLocationClick - Callback when location CTA is clicked
 * @param {Function} props.onClear - Callback when clear button is clicked
 * @param {boolean} props.locationLoading - Loading state for location detection
 * @param {string} props.locationError - Error message for location
 * @param {string} props.placeholder - Input placeholder
 */
const CityInput = forwardRef(({
  value,
  onChange,
  onFocus,
  onLocationClick,
  onClear,
  locationLoading = false,
  locationError = '',
  placeholder = 'City or ZIP',
}, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-20 sm:pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        aria-label="City or ZIP code"
      />
      
      {/* Right-side buttons container */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Use my location icon button - Compact inline CTA */}
        <button
          type="button"
          onClick={onLocationClick}
          disabled={locationLoading}
          className="relative p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group touch-manipulation"
          aria-label={locationLoading ? 'Detecting your location...' : 'Use my current location'}
          title={locationLoading ? 'Detecting location...' : locationError || 'Use my current location'}
        >
          {locationLoading ? (
            // Loading spinner state
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            // Location pin icon - matches standard map/location platforms
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          {/* Tooltip on hover - shown via title attribute and CSS */}
          <span className="sr-only">Use my current location</span>
        </button>
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            aria-label="Clear location"
            title="Clear location"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

CityInput.displayName = 'CityInput';

export default CityInput;
