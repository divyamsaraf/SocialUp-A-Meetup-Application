/**
 * Spacing System - SocialUp Design System
 * 
 * Defines consistent spacing scale for padding, margins, and gaps.
 * Uses a 4px base unit for consistency with Tailwind CSS.
 * 
 * Usage:
 *   import { spacing } from '../theme';
 *   className={`p-${spacing.md}`} // Use Tailwind classes
 *   style={{ padding: spacing.md }} // Or inline styles
 */

export const spacing = {
  // Base spacing scale (4px increments)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  
  // Semantic spacing names
  xs: '0.5rem',   // 8px - Extra small spacing
  sm: '0.75rem',  // 12px - Small spacing
  md: '1rem',     // 16px - Medium spacing (default)
  lg: '1.5rem',   // 24px - Large spacing
  xl: '2rem',     // 32px - Extra large spacing
  '2xl': '3rem',  // 48px - 2x large spacing
  '3xl': '4rem',  // 64px - 3x large spacing
  '4xl': '6rem',  // 96px - 4x large spacing
  
  // Component-specific spacing
  component: {
    // Card padding
    cardPadding: {
      compact: '1rem',    // 16px - Compact cards
      default: '1.5rem',  // 24px - Default cards
      spacious: '2rem',   // 32px - Spacious cards
    },
    
    // Button padding
    buttonPadding: {
      sm: '0.5rem 1rem',      // 8px vertical, 16px horizontal
      md: '0.625rem 1.25rem', // 10px vertical, 20px horizontal
      lg: '0.75rem 1.5rem',   // 12px vertical, 24px horizontal
    },
    
    // Input padding
    inputPadding: {
      sm: '0.5rem 0.75rem',   // 8px vertical, 12px horizontal
      md: '0.625rem 1rem',    // 10px vertical, 16px horizontal
      lg: '0.75rem 1.25rem',  // 12px vertical, 20px horizontal
    },
    
    // Section spacing
    section: {
      xs: '2rem',   // 32px - Small sections
      md: '4rem',   // 64px - Medium sections
      lg: '6rem',   // 96px - Large sections
      xl: '8rem',   // 128px - Extra large sections
    },
    
    // Grid gaps
    gridGap: {
      xs: '0.5rem',  // 8px - Tight grid
      sm: '0.75rem', // 12px - Small grid
      md: '1rem',    // 16px - Default grid
      lg: '1.5rem',  // 24px - Large grid
      xl: '2rem',    // 32px - Extra large grid
    },
  },
};
