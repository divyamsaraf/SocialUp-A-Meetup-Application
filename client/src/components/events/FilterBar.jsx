import { useState } from 'react';
import { EVENT_CATEGORIES, EVENT_LOCATION_TYPES } from '../../utils/constants';

const FilterBar = ({ onFilterChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    eventCategory: currentFilters.eventCategory || '',
    eventLocationType: currentFilters.eventLocationType || '',
    upcoming: currentFilters.upcoming || false,
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      eventCategory: '',
      eventLocationType: '',
      upcoming: false,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.eventCategory}
            onChange={(e) => handleChange('eventCategory', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Type
          </label>
          <select
            value={filters.eventLocationType}
            onChange={(e) => handleChange('eventLocationType', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value={EVENT_LOCATION_TYPES.ONLINE}>Online</option>
            <option value={EVENT_LOCATION_TYPES.IN_PERSON}>In Person</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.upcoming}
              onChange={(e) => handleChange('upcoming', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Upcoming Only</span>
          </label>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
