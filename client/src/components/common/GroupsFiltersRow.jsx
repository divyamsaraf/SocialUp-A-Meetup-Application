import FiltersRow from './FiltersRow';

/**
 * GroupsFiltersRow - Horizontal row of filters for Groups page
 * 
 * Consolidates all group filters into a single horizontal row using the generic FiltersRow component.
 * - Privacy dropdown (🔒 All privacy default)
 * - Sort dropdown (🔀 Sort by popularity default)
 * - Reset button (clears all filters, positioned at right end)
 * 
 * Note: Category filter is handled by the CategoryRow component below
 * 
 * This component uses the reusable FiltersRow component with Groups-specific configuration.
 * 
 * @param {Object} props
 * @param {Object} props.selectedFilters - Object with filter values:
 *   - privacy: 'public' | 'private' | 'invite-only' | '' (default: '')
 *   - sortBy: 'popularity' | 'newest' | 'members' | 'name' | 'relevance' (default: 'popularity')
 * @param {Function} props.onFilterChange - Callback when any filter changes (filterName, value)
 * @param {Function} props.onReset - Callback when Reset button is clicked (clears all filters)
 */
const GroupsFiltersRow = ({
  selectedFilters = {},
  onFilterChange,
  onReset,
}) => {
  // Default filter values for reset functionality
  const defaultFilters = {
    privacy: '',
    sortBy: 'popularity',
  };

  // Filter configuration for Groups page
  const filterConfig = [
    {
      key: 'privacy',
      icon: '🔒',
      label: 'Privacy',
      defaultValue: '',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
        { value: 'invite-only', label: 'Invite-only' },
      ],
    },
    {
      key: 'sortBy',
      icon: '🔀',
      label: 'Sort',
      defaultValue: 'popularity',
      options: [
        { value: 'popularity', label: 'Sort by popularity' },
        { value: 'newest', label: 'Sort by newest' },
        { value: 'members', label: 'Sort by members' },
        { value: 'name', label: 'Sort by name' },
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
      ariaLabel="Group filters"
    />
  );
};

export default GroupsFiltersRow;
