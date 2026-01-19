import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { icons } from '../../theme';

/**
 * FiltersDropdown - Modern filter dropdown with label
 * 
 * Features:
 * - Label above select
 * - Compact, modern design
 * - Accessible select dropdown
 * - Consistent styling
 * 
 * @param {Object} props
 * @param {string} props.name - Filter name (e.g., "Date", "Category")
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Callback when value changes
 */
const FiltersDropdown = ({
  name,
  options = [],
  value = '',
  onChange,
}) => {
  // Convert options to array format if needed
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const displayValue = value 
    ? normalizedOptions.find(opt => opt.value === value)?.label || ''
    : `All ${name.toLowerCase()}`;

  return (
    <div className="flex flex-col" style={{ minWidth: '140px', flex: '0 1 auto' }}>
      <label 
        className="block mb-1"
        style={{
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {name}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="focus:outline-none focus:ring-2 bg-white appearance-none cursor-pointer"
          style={{
            width: '100%',
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            lineHeight: typography.lineHeight.normal,
            height: '2.5rem',
            paddingLeft: spacing[3],
            paddingRight: spacing[10],
            borderRadius: borderRadius.md,
            backgroundColor: colors.surface.default,
            border: `1px solid ${colors.border.default}`,
            color: colors.text.primary,
            transition: 'all 200ms ease-in-out',
            outline: 'none',
            cursor: 'pointer',
          }}
          onFocus={(e) => {
            e.target.style.border = `2px solid ${colors.primary[600]}`;
            e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
            e.target.style.backgroundColor = colors.surface.default;
          }}
          onBlur={(e) => {
            e.target.style.border = `1px solid ${colors.border.default}`;
            e.target.style.boxShadow = 'none';
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.target) {
              e.target.style.borderColor = colors.border.dark;
              e.target.style.backgroundColor = colors.background.tertiary;
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.target) {
              e.target.style.borderColor = colors.border.default;
              e.target.style.backgroundColor = colors.surface.default;
            }
          }}
          aria-label={`Filter by ${name.toLowerCase()}`}
        >
          <option value="">All {name.toLowerCase()}</option>
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div 
          className="absolute pointer-events-none"
          style={{
            right: spacing[3],
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.text.tertiary,
          }}
        >
          <svg 
            style={{
              width: icons.size.sm,
              height: icons.size.sm,
              strokeWidth: icons.strokeWidth.normal,
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FiltersDropdown;
