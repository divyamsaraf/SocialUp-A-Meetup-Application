/**
 * GlobalSearchBar Usage Examples
 * 
 * This file demonstrates how to use the GlobalSearchBar component
 * in different scenarios (Events, Groups, etc.)
 */

import GlobalSearchBar from './GlobalSearchBar';
import { EVENT_LOCATION_TYPES } from '../../utils/constants';

/**
 * Example 1: Events Page Search Bar
 */
export const EventsSearchBarExample = ({ onSearch }) => {
  const filters = [
    {
      name: 'Date',
      options: [
        { value: 'all', label: 'All dates' },
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'Category',
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'social', label: 'Social' },
        { value: 'sports', label: 'Sports' },
      ],
      defaultValue: '',
    },
    {
      name: 'Type',
      options: [
        { value: EVENT_LOCATION_TYPES.ONLINE, label: 'Online' },
        { value: EVENT_LOCATION_TYPES.IN_PERSON, label: 'In Person' },
      ],
      defaultValue: '',
    },
    {
      name: 'Distance',
      options: [
        { value: '5', label: 'Within 5 miles' },
        { value: '10', label: 'Within 10 miles' },
        { value: '25', label: 'Within 25 miles' },
        { value: '50', label: 'Within 50 miles' },
      ],
      defaultValue: '25',
    },
    {
      name: 'Sort',
      options: [
        { value: 'date', label: 'Sort by date' },
        { value: 'popularity', label: 'Sort by popularity' },
        { value: 'relevance', label: 'Sort by relevance' },
      ],
      defaultValue: 'date',
    },
  ];

  return (
    <GlobalSearchBar
      searchScope="events"
      filters={filters}
      placeholder="Search events, groups or enter a city"
      onSearch={(data) => {
        console.log('Search submitted:', data);
        // data = { query, city, location, filters }
        onSearch(data);
      }}
    />
  );
};

/**
 * Example 2: Groups Page Search Bar
 */
export const GroupsSearchBarExample = ({ onSearch }) => {
  const filters = [
    {
      name: 'Category',
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'social', label: 'Social' },
        { value: 'sports', label: 'Sports' },
      ],
      defaultValue: '',
    },
    {
      name: 'Privacy',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
      ],
      defaultValue: '',
    },
    {
      name: 'Sort',
      options: [
        { value: 'popularity', label: 'Sort by popularity' },
        { value: 'members', label: 'Sort by members' },
        { value: 'newest', label: 'Sort by newest' },
      ],
      defaultValue: 'popularity',
    },
  ];

  return (
    <GlobalSearchBar
      searchScope="groups"
      filters={filters}
      placeholder="Search groups..."
      onSearch={(data) => {
        console.log('Groups search:', data);
        onSearch(data);
      }}
    />
  );
};

/**
 * Example 3: Combined Search (Events + Groups)
 */
export const CombinedSearchBarExample = ({ onSearch }) => {
  const filters = [
    {
      name: 'Category',
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'social', label: 'Social' },
      ],
      defaultValue: '',
    },
  ];

  // Custom suggestion fetcher
  const fetchSuggestions = async (query, scope) => {
    // Call your backend API
    // const response = await api.get(`/search/suggestions?q=${query}&scope=${scope}`);
    // return response.data.suggestions;
    return [];
  };

  return (
    <GlobalSearchBar
      searchScope="both"
      filters={filters}
      defaultCity="Seattle, WA"
      onSuggestionsFetch={fetchSuggestions}
      onSearch={(data) => {
        console.log('Combined search:', data);
        onSearch(data);
      }}
    />
  );
};

/**
 * Example 4: Minimal Search (No Filters)
 */
export const MinimalSearchBarExample = ({ onSearch }) => {
  return (
    <GlobalSearchBar
      searchScope="events"
      filters={[]}
      placeholder="Search events..."
      onSearch={(data) => {
        console.log('Minimal search:', data);
        onSearch(data);
      }}
    />
  );
};
