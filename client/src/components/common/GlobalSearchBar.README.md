# GlobalSearchBar Component

A fully reusable, accessible, and responsive search bar component for SocialUp that can be used across Events, Groups, and other pages.

## Features

✅ **Search Input** with dynamic suggestions and highlighted matches  
✅ **City Input** with auto-clear, location CTA (📍), and clear button  
✅ **Configurable Filters** (date, category, type, distance, sort, etc.)  
✅ **Responsive Design** (mobile/tablet/desktop)  
✅ **Full Accessibility** (ARIA labels, keyboard navigation, screen reader support)  
✅ **Dynamic Suggestions** from backend API  
✅ **Location Detection** via browser geolocation API  

## Installation

The component is already included in the project. Import it like this:

```jsx
import GlobalSearchBar from '../components/common/GlobalSearchBar';
```

## Basic Usage

```jsx
import GlobalSearchBar from '../components/common/GlobalSearchBar';

function MyPage() {
  const handleSearch = (data) => {
    console.log('Search data:', data);
    // data = { query, city, location, filters }
  };

  return (
    <GlobalSearchBar
      searchScope="events"
      onSearch={handleSearch}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchScope` | `"events" \| "groups" \| "both"` | `"both"` | Controls suggestion type |
| `filters` | `Array<Filter>` | `[]` | Array of filter objects |
| `defaultCity` | `string` | `null` | Optional prefilled city |
| `onSearch` | `Function` | **required** | Callback when search is submitted |
| `placeholder` | `string` | `"Search events, groups or enter a city"` | Search input placeholder |
| `onSuggestionsFetch` | `Function` | `null` | Custom suggestion fetcher function |

### Filter Object Structure

```jsx
{
  name: 'Date',                    // Filter name
  options: [                       // Array of options
    { value: 'all', label: 'All dates' },
    { value: 'today', label: 'Today' },
    // ...
  ],
  defaultValue: 'all'              // Optional default value
}
```

### onSearch Callback Data

```jsx
{
  query: 'search text',           // Search query string
  city: 'Seattle, WA',            // City input value
  location: {                      // Location object (if selected)
    city: 'Seattle',
    state: 'WA',
    lat: 47.6062,
    lng: -122.3321,
    label: 'Seattle, WA'
  },
  filters: {                       // Selected filters
    Date: 'today',
    Category: 'technology',
    // ...
  }
}
```

## Examples

### Events Page

```jsx
import GlobalSearchBar from '../components/common/GlobalSearchBar';
import { EVENT_LOCATION_TYPES } from '../utils/constants';

function EventsPage() {
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
  ];

  const handleSearch = (data) => {
    // Navigate to search results or filter events
    console.log('Search:', data);
  };

  return (
    <GlobalSearchBar
      searchScope="events"
      filters={filters}
      placeholder="Search events, groups or enter a city"
      onSearch={handleSearch}
    />
  );
}
```

### Groups Page

```jsx
function GroupsPage() {
  const filters = [
    {
      name: 'Category',
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'social', label: 'Social' },
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
  ];

  return (
    <GlobalSearchBar
      searchScope="groups"
      filters={filters}
      placeholder="Search groups..."
      onSearch={(data) => {
        // Handle groups search
        console.log('Groups search:', data);
      }}
    />
  );
}
```

### Custom Suggestions

```jsx
function CustomSearchPage() {
  const fetchSuggestions = async (query, scope) => {
    // Call your backend API
    const response = await fetch(`/api/search/suggestions?q=${query}&scope=${scope}`);
    const data = await response.json();
    return data.suggestions || [];
  };

  return (
    <GlobalSearchBar
      searchScope="both"
      onSuggestionsFetch={fetchSuggestions}
      onSearch={(data) => {
        console.log('Custom search:', data);
      }}
    />
  );
}
```

## Component Structure

```
GlobalSearchBar
├── Search Input
│   ├── Search icon (left)
│   ├── Clear button (right, when text exists)
│   └── SuggestionList (dropdown)
│       ├── Loading state
│       ├── Empty state
│       └── Suggestions with highlighted matches
├── City Input
│   ├── Location CTA (📍 icon)
│   ├── Clear button (X)
│   └── Location Dropdown
│       └── City/ZIP suggestions
├── Search Button
└── Filters Row (optional)
    └── FiltersDropdown components
```

## Layout Diagrams

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search events, groups...] [📍 City or ZIP] [Search Button] │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│ [Date ▼] [Category ▼] [Type ▼] [Distance ▼] [Sort ▼] [Clear] │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────────┐
│ [🔍 Search events...]       │
├─────────────────────────────┤
│ [📍 City or ZIP]            │
├─────────────────────────────┤
│ [Search Button]             │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [Date ▼]                   │
│ [Category ▼]                │
│ [Type ▼]                    │
│ [Clear]                     │
└─────────────────────────────┘
```

## Accessibility Features

- ✅ **ARIA Labels**: All inputs and buttons have proper labels
- ✅ **Keyboard Navigation**: Full keyboard support (Tab, Enter, Arrow keys)
- ✅ **Screen Reader Support**: Semantic HTML and ARIA attributes
- ✅ **Focus Management**: Proper focus states and focus rings
- ✅ **Error Announcements**: Location errors announced to screen readers

## Edge Cases Handled

- ✅ Empty input validation
- ✅ Invalid city handling
- ✅ Location permission denied
- ✅ Network errors
- ✅ No results found
- ✅ Loading states
- ✅ Debounced API calls

## Styling

The component uses Tailwind CSS and matches the SocialUp design system:
- Colors: Blue-600 primary, Gray-300 borders
- Typography: Base text size, medium font weights
- Spacing: Consistent padding and gaps
- Responsive: Mobile-first breakpoints

## Dependencies

- `react` - React hooks and components
- `../contexts/LocationContext` - Location state management
- `../utils/locationUtils` - Location API utilities
- `../ui/Button` - Button component
- `./CityInput` - City input sub-component
- `./FiltersDropdown` - Filter dropdown sub-component
- `./SuggestionList` - Suggestion list sub-component

## Notes

- The component integrates with `LocationContext` for location state
- Location suggestions use Nominatim API (OpenStreetMap)
- Custom suggestions can be provided via `onSuggestionsFetch` prop
- All filters are optional - pass empty array for no filters
- The component handles all internal state management
