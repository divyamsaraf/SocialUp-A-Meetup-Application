import { forwardRef } from 'react';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { zIndex } from '../../theme';

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
        <mark 
          key={index} 
          style={{
            backgroundColor: colors.warning[200],
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const dropdownStyle = {
    position: 'absolute',
    zIndex: zIndex.modal,
    width: '100%',
    marginTop: spacing[1],
    backgroundColor: colors.surface.default,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xl,
  };

  if (loading) {
    return (
      <div
        ref={ref}
        id={id}
        style={dropdownStyle}
        role="listbox"
        aria-label="Search suggestions"
      >
        <div 
          style={{
            padding: `${spacing[3]} ${spacing[4]}`,
            fontSize: typography.fontSize.sm,
            color: colors.text.tertiary,
            textAlign: 'center',
          }}
        >
          Searching...
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div
        ref={ref}
        id={id}
        style={dropdownStyle}
        role="listbox"
        aria-label="Search suggestions"
      >
        <div 
          style={{
            padding: `${spacing[3]} ${spacing[4]}`,
            fontSize: typography.fontSize.sm,
            color: colors.text.tertiary,
            textAlign: 'center',
          }}
        >
          No results found
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={id}
      style={{
        ...dropdownStyle,
        maxHeight: '16rem',
        overflowY: 'auto',
      }}
      role="listbox"
      aria-label="Search suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.id || suggestion._id || index}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="w-full text-left transition-colors hover:opacity-90"
          style={{
            padding: `${spacing[2.5]} ${spacing[4]}`,
            borderBottom: index < suggestions.length - 1 ? `1px solid ${colors.border.light}` : 'none',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.background.tertiary;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
          role="option"
          aria-selected="false"
        >
          <div 
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.primary,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {highlightMatch(suggestion.title || suggestion.name || '', query)}
          </div>
          {suggestion.subtitle && (
            <div 
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.tertiary,
                marginTop: spacing[0.5],
              }}
            >
              {suggestion.subtitle}
            </div>
          )}
        </button>
      ))}
    </div>
  );
});

SuggestionList.displayName = 'SuggestionList';

export default SuggestionList;
