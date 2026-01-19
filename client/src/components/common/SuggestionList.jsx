import { forwardRef } from 'react';

/**
 * SuggestionList - Displays search suggestions with highlighted matches
 * 
 * Features:
 * - Highlights matched text in suggestions
 * - Loading state
 * - Empty state
 * - Keyboard navigation support
 * - Accessibility features
 * 
 * @param {Object} props
 * @param {Array} props.suggestions - Array of suggestion objects {title, type, id, ...}
 * @param {boolean} props.loading - Loading state
 * @param {string} props.query - Current search query for highlighting
 * @param {Function} props.onSelect - Callback when suggestion is selected
 * @param {string} props.id - ID for accessibility
 */
const SuggestionList = forwardRef(({
  suggestions = [],
  loading = false,
  query = '',
  onSelect,
  id = 'suggestions',
}, ref) => {
  // Highlight matched text in suggestion
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div
        ref={ref}
        id={id}
        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        role="listbox"
        aria-label="Search suggestions"
      >
        <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div
        ref={ref}
        id={id}
        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        role="listbox"
        aria-label="Search suggestions"
      >
        <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={id}
      className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
      role="listbox"
      aria-label="Search suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.id || suggestion._id || index}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
          role="option"
          aria-selected="false"
        >
          <div className="text-sm text-gray-900 font-medium">
            {highlightMatch(suggestion.title || suggestion.name || '', query)}
          </div>
          {suggestion.subtitle && (
            <div className="text-xs text-gray-500 mt-0.5">{suggestion.subtitle}</div>
          )}
        </button>
      ))}
    </div>
  );
});

SuggestionList.displayName = 'SuggestionList';

export default SuggestionList;
