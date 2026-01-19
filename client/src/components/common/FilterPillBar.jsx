import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';

/**
 * FilterPillBar - Reusable horizontal scrollable filter pill bar
 * 
 * Used for date filters, category filters, etc.
 * Consistent styling across Events and Groups pages.
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of {value, label, icon} objects
 * @param {string} props.selectedValue - Currently selected value
 * @param {Function} props.onChange - Callback when filter changes (receives value)
 * @param {string} props.ariaLabel - ARIA label for accessibility
 */
const FilterPillBar = ({ options = [], selectedValue = '', onChange, ariaLabel = 'Filter options' }) => {
  return (
    <div style={{ marginBottom: spacing[4] }}>
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div 
          className="flex min-w-max"
          style={{
            gap: spacing[2],
            paddingBottom: spacing[2],
          }}
          role="group"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const isActive = selectedValue === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className="flex items-center whitespace-nowrap transition-all"
                style={{
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[4]}`,
                  borderRadius: borderRadius.full,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  backgroundColor: isActive ? colors.primary[600] : colors.surface.default,
                  color: isActive ? colors.text.inverse : colors.text.secondary,
                  border: isActive ? 'none' : `1px solid ${colors.border.dark}`,
                  boxShadow: isActive ? shadows.md : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = colors.surface.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = colors.surface.default;
                  }
                }}
                aria-pressed={isActive}
                aria-label={`Filter by ${option.label}`}
              >
                {option.icon && <span aria-hidden="true">{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPillBar;
