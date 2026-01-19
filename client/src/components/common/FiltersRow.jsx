import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { transitions } from '../../theme';
import { icons } from '../../theme';
import FilterPillDropdown from './FilterPillDropdown';

/**
 * FiltersRow - Generic horizontal row of filters
 * 
 * A reusable filter component that can be configured for different pages (Events, Groups, etc.)
 * Consolidates filter UI and logic into a single component.
 * 
 * Features:
 * - Configurable filter dropdowns via filterConfig prop
 * - Reset button that clears all filters
 * - Theme-consistent styling
 * - Accessibility support (keyboard navigation, ARIA labels)
 * - Responsive design (wraps on mobile)
 * 
 * @param {Object} props
 * @param {Array} props.filterConfig - Array of filter configurations:
 *   - { key: string, icon: string, label: string, options: Array, defaultValue: any }
 * @param {Object} props.selectedFilters - Object with current filter values
 * @param {Function} props.onFilterChange - Callback when filter changes (filterName, value)
 * @param {Function} props.onReset - Callback when reset button is clicked
 * @param {Object} props.defaultFilters - Default filter values for reset functionality
 * @param {string} props.ariaLabel - ARIA label for the filter group (default: "Filters")
 */
const FiltersRow = ({
  filterConfig = [],
  selectedFilters = {},
  onFilterChange,
  onReset,
  defaultFilters = {},
  ariaLabel = "Filters",
}) => {
  // Check if any filters are active (deviate from defaults)
  const hasActiveFilters = filterConfig.some(config => {
    const currentValue = selectedFilters[config.key] ?? config.defaultValue ?? '';
    const defaultValue = defaultFilters[config.key] ?? config.defaultValue ?? '';
    return currentValue !== defaultValue && currentValue !== '' && currentValue !== null && currentValue !== undefined;
  });

  // Handle reset - clears all filters to default values
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div
      style={{
        marginBottom: spacing[4],
      }}
      role="group"
      aria-label={ariaLabel}
    >
      {/* Filters Container - Wrapping flex container */}
      <div
        className="flex flex-wrap items-center"
        style={{
          gap: spacing[3],
        }}
      >
        {/* Render each configured filter */}
        {filterConfig.map((config) => {
          // Skip if conditionally hidden
          if (config.condition === false) return null;

          const currentValue = selectedFilters[config.key] ?? config.defaultValue ?? '';
          
          return (
            <FilterPillDropdown
              key={config.key}
              icon={config.icon}
              label={config.label}
              options={config.options}
              value={currentValue}
              onChange={(value) => onFilterChange(config.key, value)}
            />
          );
        })}

        {/* Reset Button - Positioned at right end, clears all filters */}
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className="flex items-center whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            gap: spacing[1],
            padding: `${spacing[2]} ${spacing[3]}`,
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            backgroundColor: hasActiveFilters ? colors.surface.default : colors.surface.default,
            color: hasActiveFilters ? colors.text.secondary : colors.text.tertiary,
            border: `1px solid ${hasActiveFilters ? colors.border.dark : colors.border.light}`,
            transition: transitions.preset.default,
            outline: 'none',
            marginLeft: 'auto', // Push to the right on desktop, wraps naturally on mobile
            opacity: hasActiveFilters ? 1 : 0.6,
            cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (hasActiveFilters) {
              e.target.style.backgroundColor = colors.error[50];
              e.target.style.borderColor = colors.error[300];
              e.target.style.color = colors.error[600];
            }
          }}
          onMouseLeave={(e) => {
            if (hasActiveFilters) {
              e.target.style.backgroundColor = colors.surface.default;
              e.target.style.borderColor = colors.border.dark;
              e.target.style.color = colors.text.secondary;
            }
          }}
          onFocus={(e) => {
            if (hasActiveFilters) {
              e.target.style.backgroundColor = colors.error[50];
              e.target.style.borderColor = colors.error[300];
              e.target.style.outline = `2px solid ${colors.error[500]}`;
              e.target.style.outlineOffset = '2px';
            }
          }}
          onBlur={(e) => {
            if (hasActiveFilters) {
              e.target.style.backgroundColor = colors.surface.default;
              e.target.style.borderColor = colors.border.dark;
            }
            e.target.style.outline = 'none';
          }}
          aria-label="Reset all filters"
          aria-disabled={!hasActiveFilters}
          title={hasActiveFilters ? "Reset all filters" : "No filters to reset"}
        >
          <svg
            style={{
              width: icons.size.sm,
              height: icons.size.sm,
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={icons.strokeWidth.normal}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default FiltersRow;
