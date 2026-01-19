/**
 * FiltersDropdown - Reusable filter dropdown component
 * 
 * Features:
 * - Accessible select dropdown
 * - Consistent styling
 * - Proper ARIA labels
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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      aria-label={`Filter by ${name.toLowerCase()}`}
    >
      <option value="">All {name.toLowerCase()}</option>
      {normalizedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FiltersDropdown;
