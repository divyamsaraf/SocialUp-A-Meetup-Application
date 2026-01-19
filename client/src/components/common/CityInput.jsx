import { forwardRef } from 'react';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { inputs } from '../../theme';
import { icons } from '../../theme';

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
        className="w-full focus:outline-none focus:ring-2"
        style={{
          ...inputs.base,
          ...inputs.size.md,
          ...inputs.state.default,
          borderRadius: borderRadius.lg,
          paddingRight: '5rem',
        }}
        onFocus={(e) => {
          e.target.style.border = `2px solid ${colors.border.focus}`;
          e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
        }}
        onBlur={(e) => {
          e.target.style.border = `1px solid ${colors.border.default}`;
          e.target.style.boxShadow = 'none';
        }}
        aria-label="City or ZIP code"
      />
      
      {/* Right-side buttons container */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 flex items-center"
        style={{
          right: spacing[2],
          gap: spacing[1],
        }}
      >
        {/* Use my location icon button - Compact inline CTA */}
        <button
          type="button"
          onClick={onLocationClick}
          disabled={locationLoading}
          className="relative disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-md hover:opacity-80 focus:outline-none focus:ring-2 group touch-manipulation"
          style={{
            padding: spacing[1.5],
            color: colors.text.tertiary,
            borderRadius: borderRadius.md,
          }}
          onMouseEnter={(e) => {
            if (!locationLoading) {
              e.target.style.color = colors.primary[600];
              e.target.style.backgroundColor = colors.primary[50];
            }
          }}
          onMouseLeave={(e) => {
            if (!locationLoading) {
              e.target.style.color = colors.text.tertiary;
              e.target.style.backgroundColor = 'transparent';
            }
          }}
          aria-label={locationLoading ? 'Detecting your location...' : 'Use my current location'}
          title={locationLoading ? 'Detecting location...' : locationError || 'Use my current location'}
        >
          {locationLoading ? (
            // Loading spinner state
            <svg 
              className="animate-spin" 
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            // Location pin icon - matches standard map/location platforms
            <svg 
              className="group-hover:scale-110 transition-transform" 
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
            className="transition-colors rounded-md hover:opacity-80 focus:outline-none focus:ring-2"
            style={{
              padding: spacing[1.5],
              color: colors.text.tertiary,
              borderRadius: borderRadius.md,
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.text.secondary;
              e.target.style.backgroundColor = colors.background.tertiary;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.text.tertiary;
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label="Clear location"
            title="Clear location"
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
      </div>
    </div>
  );
});

CityInput.displayName = 'CityInput';

export default CityInput;
