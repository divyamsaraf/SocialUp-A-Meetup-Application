import FiltersRow from './FiltersRow';

/**
 * EventFiltersRow - Horizontal row of filters for Events page
 * 
 * Consolidates all event filters into a single horizontal row using the generic FiltersRow component.
 * - Date dropdown (📅 All dates default, with emoji presets)
 * - Type dropdown (All type default)
 * - Distance dropdown (Within 25 miles default, conditional)
 * - Sort dropdown (Sort by date default)
 * - Reset button (clears all filters, positioned at right end)
 * 
 * Note: Category filter is handled by the CategoryRow component below
 * 
 * This component uses the reusable FiltersRow component with Events-specific configuration.
 * 
 * @param {Object} props
 * @param {Object} props.selectedFilters - Object with filter values:
 *   - dateRange: 'all' | 'today' | 'tomorrow' | 'week' | 'month' (default: 'all')
 *   - eventLocationType: 'online' | 'in-person' | '' (default: '')
 *   - distance: string (miles, default: '25')
 *   - sortBy: 'date' | 'popularity' | 'relevance' (default: 'date')
 * @param {Function} props.onFilterChange - Callback when any filter changes (filterName, value)
 * @param {Function} props.onReset - Callback when Reset button is clicked (clears all filters)
 * @param {boolean} props.showDistance - Whether to show distance filter (default: true)
 */
const EventFiltersRow = ({
  selectedFilters = {},
  onFilterChange,
  onReset,
  showDistance = true,
}) => {
  // Default filter values for reset functionality
  const defaultFilters = {
    dateRange: 'all',
    eventLocationType: '',
    distance: '25',
    sortBy: 'date',
  };

  // Filter configuration for Events page
  const filterConfig = [
    {
      key: 'dateRange',
      icon: '📅',
      label: 'Date',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All dates', icon: '📅' },
        { value: 'today', label: 'Today', icon: '📆' },
        { value: 'tomorrow', label: 'Tomorrow', icon: '📅' },
        { value: 'week', label: 'This week', icon: '📆' },
        { value: 'month', label: 'This month', icon: '📅' },
      ],
    },
    {
      key: 'eventLocationType',
      icon: '📍',
      label: 'Type',
      defaultValue: '',
      options: [
        { value: 'online', label: 'Online' },
        { value: 'in-person', label: 'In-Person' },
      ],
    },
    {
      key: 'distance',
      icon: '📏',
      label: 'Distance',
      defaultValue: '25',
      options: [
        { value: '5', label: 'Within 5 miles' },
        { value: '10', label: 'Within 10 miles' },
        { value: '25', label: 'Within 25 miles' },
        { value: '50', label: 'Within 50 miles' },
        { value: '100', label: 'Within 100 miles' },
      ],
      condition: showDistance, // Conditionally show distance filter
    },
    {
      key: 'sortBy',
      icon: '🔀',
      label: 'Sort',
      defaultValue: 'date',
      options: [
        { value: 'date', label: 'Sort by date' },
        { value: 'popularity', label: 'Sort by popularity' },
        { value: 'relevance', label: 'Sort by relevance' },
      ],
    },
  ];

  return (
    <FiltersRow
      filterConfig={filterConfig}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      onReset={onReset}
      defaultFilters={defaultFilters}
      ariaLabel="Event filters"
    />
  );
};

export default EventFiltersRow;
