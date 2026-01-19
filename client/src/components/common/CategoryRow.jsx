import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { transitions } from '../../theme';
import { icons } from '../../theme';

/**
 * CategoryRow - Horizontal scrollable categories row with arrow buttons
 * 
 * A reusable component for displaying dynamic, scrollable category filters
 * with smooth scrolling and arrow navigation. Used on Events and Groups pages.
 * 
 * Features:
 * - Horizontal scrollable categories with smooth scrolling
 * - Left/right arrow buttons that appear when content overflows
 * - Arrow buttons disabled at scroll boundaries
 * - Responsive design (arrows visible on desktop, optional on mobile)
 * - Keyboard navigation support (arrow keys)
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Theme-consistent styling
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects with {id, label, icon, name}
 * @param {string|number} props.selectedCategoryId - Currently selected category ID or name
 * @param {Function} props.onCategorySelect - Callback when category is clicked (receives category object)
 * @param {number} props.scrollAmount - Pixels to scroll per arrow click (defaults to container width / 2)
 * @param {string} props.ariaLabel - ARIA label for the category row (default: "Category filters")
 * @param {boolean} props.showArrowsOnMobile - Whether to show arrows on mobile (default: false)
 */
const CategoryRow = ({
  categories = [],
  selectedCategoryId = '',
  onCategorySelect,
  scrollAmount = null,
  ariaLabel = 'Category filters',
  showArrowsOnMobile = false,
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  // Check scroll position and update arrow states
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const canScroll = scrollWidth > clientWidth;
    
    setShowArrows(canScroll);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding
  }, []);

  // Scroll handler
  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollBy = scrollAmount || containerWidth / 2;
    const currentScroll = container.scrollLeft;
    const newScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollBy)
      : Math.min(container.scrollWidth - containerWidth, currentScroll + scrollBy);

    container.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
  }, [scrollAmount]);

  // Scroll left handler
  const handleScrollLeft = () => scroll('left');

  // Scroll right handler
  const handleScrollRight = () => scroll('right');

  // Handle category click
  const handleCategoryClick = (category) => {
    const categoryLabel = category.label || category.name;
    
    // Announce filter change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = `Category filter changed to ${categoryLabel}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
    
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    
    // Scroll selected category into view
    const container = scrollContainerRef.current;
    if (container) {
      const categoryElement = container.querySelector(`[data-category-id="${category.id || category.name}"]`);
      if (categoryElement) {
        const containerRect = container.getBoundingClientRect();
        const categoryRect = categoryElement.getBoundingClientRect();
        const scrollLeft = container.scrollLeft;
        const categoryLeft = categoryRect.left - containerRect.left + scrollLeft;
        const categoryWidth = categoryRect.width;
        const containerWidth = container.clientWidth;
        
        // Center the category if possible, otherwise align to visible area
        const targetScroll = Math.max(
          0,
          Math.min(
            categoryLeft - (containerWidth / 2) + (categoryWidth / 2),
            container.scrollWidth - containerWidth
          )
        );
        
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, category, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevCategory = categories[index - 1];
      if (prevCategory) {
        const prevButton = scrollContainerRef.current?.querySelector(
          `[data-category-id="${prevCategory.id || prevCategory.name}"]`
        );
        prevButton?.focus();
      }
    } else if (e.key === 'ArrowRight' && index < categories.length - 1) {
      e.preventDefault();
      const nextCategory = categories[index + 1];
      if (nextCategory) {
        const nextButton = scrollContainerRef.current?.querySelector(
          `[data-category-id="${nextCategory.id || nextCategory.name}"]`
        );
        nextButton?.focus();
      }
    }
  };

  // Check scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition();
    
    const container = scrollContainerRef.current;
    if (!container) return;

    // Listen to scroll events
    const handleScroll = () => {
      checkScrollPosition();
    };

    container.addEventListener('scroll', handleScroll);
    
    // Listen to resize events
    const resizeObserver = new ResizeObserver(() => {
      checkScrollPosition();
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [checkScrollPosition, categories]);

  // Scroll selected category into view on mount if needed
  useEffect(() => {
    if (selectedCategoryId && scrollContainerRef.current) {
      const categoryElement = scrollContainerRef.current.querySelector(
        `[data-category-id="${selectedCategoryId}"]`
      );
      if (categoryElement) {
        // Small delay to ensure layout is complete
        setTimeout(() => {
          categoryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }, 100);
      }
    }
  }, [selectedCategoryId]);

  // Don't render if no categories
  if (!categories || categories.length === 0) {
    return null;
  }

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.default,
    border: `1px solid ${colors.border.default}`,
    boxShadow: shadows.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.preset.default,
    color: colors.text.secondary,
  };

  const disabledArrowStyle = {
    ...arrowButtonStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
    backgroundColor: colors.surface.disabled,
  };

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: spacing[4],
        paddingTop: spacing[2], // Add padding-top to prevent clipping
        overflow: 'visible', // Ensure nothing is cut off
      }}
      role="group"
      aria-label={ariaLabel}
    >
      {/* Left Arrow Button */}
      {showArrows && (
        <button
          type="button"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          className={showArrowsOnMobile ? '' : 'hidden md:flex'}
          style={canScrollLeft ? arrowButtonStyle : disabledArrowStyle}
          onMouseEnter={(e) => {
            if (canScrollLeft) {
              e.target.style.backgroundColor = colors.surface.hover;
              e.target.style.boxShadow = shadows.lg;
            }
          }}
          onMouseLeave={(e) => {
            if (canScrollLeft) {
              e.target.style.backgroundColor = colors.surface.default;
              e.target.style.boxShadow = shadows.md;
            }
          }}
          aria-label="Scroll categories left"
          aria-disabled={!canScrollLeft}
        >
          <svg
            style={{
              width: icons.size.md,
              height: icons.size.md,
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollBehavior: 'smooth',
          paddingLeft: showArrows ? spacing[12] : 0,
          paddingRight: showArrows ? spacing[12] : 0,
          paddingTop: spacing[2], // Add padding-top to prevent clipping
          paddingBottom: spacing[2], // Add padding-bottom for consistency
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          overflowY: 'visible', // Prevent vertical clipping
        }}
        role="list"
      >
        <div
          className="flex min-w-max items-center"
          style={{
            gap: spacing[2], // Consistent horizontal spacing between buttons
          }}
        >
          {categories.map((category, index) => {
            const categoryId = category.id || category.name || category._id || index;
            const categoryLabel = category.label || category.name;
            const categoryIcon = category.icon || '';
            const isSelected = selectedCategoryId === categoryId || 
                              selectedCategoryId === category.name ||
                              selectedCategoryId === category._id;

            return (
              <button
                key={categoryId}
                data-category-id={categoryId}
                type="button"
                onClick={() => handleCategoryClick(category)}
                onKeyDown={(e) => handleKeyDown(e, category, index)}
                className="inline-flex items-center whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  display: 'inline-flex', // Ensure inline-flex for proper alignment
                  alignItems: 'center', // Vertically center emoji and text
                  gap: spacing[1], // Small gap between emoji and label
                  paddingTop: spacing[2], // Uniform vertical padding
                  paddingBottom: spacing[2], // Uniform vertical padding
                  paddingLeft: spacing[4], // Horizontal padding
                  paddingRight: spacing[4], // Horizontal padding
                  height: 'auto', // Auto height to accommodate content
                  minHeight: '2.5rem', // Minimum height for consistency
                  lineHeight: typography.lineHeight.normal, // Match line-height to button height
                  borderRadius: borderRadius.full,
                  fontSize: typography.fontSize.sm,
                  fontWeight: isSelected ? typography.fontWeight.semibold : typography.fontWeight.medium,
                  backgroundColor: isSelected ? colors.primary[600] : colors.surface.default,
                  color: isSelected ? colors.text.inverse : colors.text.secondary,
                  border: isSelected ? 'none' : `1px solid ${colors.border.dark}`,
                  boxShadow: isSelected ? shadows.md : 'none',
                  transition: transitions.preset.default,
                  outline: 'none',
                  flexShrink: 0, // Prevent buttons from shrinking
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = colors.surface.hover;
                    e.target.style.borderColor = colors.border.dark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = colors.surface.default;
                    e.target.style.borderColor = colors.border.dark;
                  }
                }}
                onFocus={(e) => {
                  e.target.style.outline = `2px solid ${colors.primary[500]}`;
                  e.target.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.target.style.outline = 'none';
                }}
                aria-pressed={isSelected}
                aria-label={`Filter by ${categoryLabel}${isSelected ? ' (selected)' : ''}`}
                role="listitem"
                tabIndex={0}
              >
                {categoryIcon && (
                  <span 
                    aria-hidden="true" 
                    style={{ 
                      fontSize: typography.fontSize.base,
                      lineHeight: 1, // Prevent emoji from affecting line height
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {categoryIcon}
                  </span>
                )}
                <span style={{ lineHeight: typography.lineHeight.normal }}>
                  {categoryLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Arrow Button */}
      {showArrows && (
        <button
          type="button"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          className={showArrowsOnMobile ? '' : 'hidden md:flex'}
          style={{
            ...(canScrollRight ? arrowButtonStyle : disabledArrowStyle),
            right: 0,
            left: 'auto',
          }}
          onMouseEnter={(e) => {
            if (canScrollRight) {
              e.target.style.backgroundColor = colors.surface.hover;
              e.target.style.boxShadow = shadows.lg;
            }
          }}
          onMouseLeave={(e) => {
            if (canScrollRight) {
              e.target.style.backgroundColor = colors.surface.default;
              e.target.style.boxShadow = shadows.md;
            }
          }}
          aria-label="Scroll categories right"
          aria-disabled={!canScrollRight}
        >
          <svg
            style={{
              width: icons.size.md,
              height: icons.size.md,
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CategoryRow;
