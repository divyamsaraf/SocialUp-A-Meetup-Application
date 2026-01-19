import { useState, useRef, useEffect } from 'react';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { transitions } from '../../theme';
import { icons } from '../../theme';

/**
 * FilterPillDropdown - Pill-shaped dropdown filter that matches date preset buttons
 * 
 * A dropdown filter styled as a pill button with emoji icon, matching the
 * visual style of date preset buttons for consistency.
 * 
 * Features:
 * - Pill-shaped button appearance
 * - Emoji icon support
 * - Dropdown menu on click
 * - Selected state highlighting
 * - Theme-consistent styling
 * - Accessibility support
 * 
 * @param {Object} props
 * @param {string} props.icon - Emoji icon to display
 * @param {string} props.label - Label text (e.g., "Type", "Distance")
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Callback when value changes
 */
const FilterPillDropdown = ({
  icon = '',
  label = '',
  options = [],
  value = '',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Normalize options
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt, icon: '' } : { icon: '', ...opt }
  );

  // Get selected option (with icon support)
  const selectedOption = normalizedOptions.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : `All ${label.toLowerCase()}`;
  const displayIcon = selectedOption ? selectedOption.icon : icon; // Use option icon if available, fallback to prop icon
  const hasSelection = !!value;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation in dropdown menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const handleMenuKeyDown = (e) => {
      const menuItems = menuRef.current?.querySelectorAll('[role="option"]');
      if (!menuItems || menuItems.length === 0) return;

      const currentIndex = focusedIndex === -1 
        ? normalizedOptions.findIndex(opt => opt.value === value)
        : focusedIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          setFocusedIndex(nextIndex);
          menuItems[nextIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          setFocusedIndex(prevIndex);
          menuItems[prevIndex]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          menuItems[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          const lastIndex = menuItems.length - 1;
          setFocusedIndex(lastIndex);
          menuItems[lastIndex]?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (currentIndex >= 0 && currentIndex < menuItems.length) {
            const hasAllOption = !normalizedOptions.some(opt => opt.value === '');
            let optionValue;
            if (hasAllOption && currentIndex === 0) {
              // "All" option is at index 0
              optionValue = '';
            } else if (hasAllOption) {
              // Regular options start at index 1
              optionValue = normalizedOptions[currentIndex - 1]?.value;
            } else {
              // No "All" option, use currentIndex directly
              optionValue = normalizedOptions[currentIndex]?.value;
            }
            if (optionValue !== undefined) {
              handleSelect(optionValue);
            }
          }
          break;
      }
    };

    const menu = menuRef.current;
    menu.addEventListener('keydown', handleMenuKeyDown);
    return () => {
      menu.removeEventListener('keydown', handleMenuKeyDown);
    };
  }, [isOpen, focusedIndex, value, normalizedOptions]);

  // Handle option select
  const handleSelect = (optionValue) => {
    const selectedLabel = normalizedOptions.find(opt => opt.value === optionValue)?.label || `All ${label.toLowerCase()}`;
    
    // Announce filter change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = `Filter ${label.toLowerCase()} changed to ${selectedLabel}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  return (
    <div ref={dropdownRef} className="relative" style={{ position: 'relative' }}>
      {/* Dropdown Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setFocusedIndex(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            // Focus first menu item after a brief delay
            setTimeout(() => {
              const firstItem = menuRef.current?.querySelector('[role="option"]');
              if (firstItem) {
                firstItem.focus();
                setFocusedIndex(0);
              }
            }, 50);
          }
        }}
        className="flex items-center whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          gap: spacing[1],
          padding: `${spacing[2]} ${spacing[3]}`,
          borderRadius: borderRadius.full,
          fontSize: typography.fontSize.sm,
          fontWeight: hasSelection ? typography.fontWeight.semibold : typography.fontWeight.medium,
          backgroundColor: hasSelection ? colors.primary[600] : colors.surface.default,
          color: hasSelection ? colors.text.inverse : colors.text.secondary,
          border: hasSelection ? 'none' : `1px solid ${colors.border.dark}`,
          boxShadow: hasSelection ? shadows.md : 'none',
          transition: transitions.preset.default,
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          if (!hasSelection) {
            e.target.style.backgroundColor = colors.surface.hover;
          }
        }}
        onMouseLeave={(e) => {
          if (!hasSelection) {
            e.target.style.backgroundColor = colors.surface.default;
          }
        }}
        onFocus={(e) => {
          e.target.style.outline = `2px solid ${colors.primary[500]}`;
          e.target.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          // Don't blur if clicking on dropdown menu
          if (!isOpen) {
            e.target.style.outline = 'none';
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Filter by ${label.toLowerCase()}`}
      >
        {(displayIcon || icon) && (
          <span aria-hidden="true" style={{ fontSize: typography.fontSize.base }}>
            {displayIcon || icon}
          </span>
        )}
        <span>{displayLabel}</span>
        <svg
          style={{
            width: icons.size.xs,
            height: icons.size.xs,
            marginLeft: spacing[1],
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: transitions.preset.default,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={icons.strokeWidth.normal}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 mt-1"
          style={{
            top: '100%',
            left: 0,
            marginTop: spacing[1],
            minWidth: '200px',
            backgroundColor: colors.surface.default,
            border: `1px solid ${colors.border.default}`,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.lg,
            overflow: 'hidden',
          }}
          role="listbox"
          aria-label={`${label} filter options`}
        >
          {/* "All" option - only show if there's a default "all" option in the list */}
          {normalizedOptions.some(opt => opt.value === '') ? null : (
            <button
              type="button"
              onClick={() => handleSelect('')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect('');
                }
              }}
              className="w-full text-left transition-all focus:outline-none flex items-center"
              style={{
                gap: spacing[2],
                padding: `${spacing[2]} ${spacing[3]}`,
                fontSize: typography.fontSize.sm,
                fontWeight: !value ? typography.fontWeight.semibold : typography.fontWeight.normal,
                color: !value ? colors.primary[600] : colors.text.primary,
                backgroundColor: !value ? colors.primary[50] : 'transparent',
                border: 'none',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (value) {
                  e.target.style.backgroundColor = colors.surface.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (value) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.surface.hover;
                e.target.style.outline = `2px solid ${colors.primary[500]}`;
                e.target.style.outlineOffset = '-2px';
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none';
              }}
              role="option"
              aria-selected={!value}
            >
              {icon && (
                <span aria-hidden="true" style={{ fontSize: typography.fontSize.base }}>
                  {icon}
                </span>
              )}
              <span>All {label.toLowerCase()}</span>
            </button>
          )}

          {/* Option list */}
          {normalizedOptions.map((option, index) => {
            const isSelected = value === option.value;
            const adjustedIndex = normalizedOptions.some(opt => opt.value === '') ? index : index + 1;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
                className="w-full text-left transition-all focus:outline-none flex items-center"
                style={{
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[3]}`,
                  fontSize: typography.fontSize.sm,
                  fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.normal,
                  color: isSelected ? colors.primary[600] : colors.text.primary,
                  backgroundColor: isSelected ? colors.primary[50] : 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = colors.surface.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = colors.surface.hover;
                  e.target.style.outline = `2px solid ${colors.primary[500]}`;
                  e.target.style.outlineOffset = '-2px';
                }}
                onBlur={(e) => {
                  e.target.style.outline = 'none';
                }}
                role="option"
                aria-selected={isSelected}
              >
                {option.icon && (
                  <span aria-hidden="true" style={{ fontSize: typography.fontSize.base }}>
                    {option.icon}
                  </span>
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterPillDropdown;
