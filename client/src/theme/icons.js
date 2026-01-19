/**
 * Icon System - SocialUp Design System
 * 
 * Defines standard icon sizes and spacing for consistent iconography.
 * 
 * Usage:
 *   import { icons } from '../theme';
 *   <svg className={`w-${icons.size.md} h-${icons.size.md}`} ... />
 */

export const icons = {
  // Standard icon sizes
  size: {
    xs: '0.75rem',   // 12px - Extra small icons
    sm: '1rem',      // 16px - Small icons
    md: '1.25rem',   // 20px - Medium icons (default)
    lg: '1.5rem',    // 24px - Large icons
    xl: '2rem',      // 32px - Extra large icons
    '2xl': '2.5rem', // 40px - 2x large icons
  },
  
  // Icon spacing (margin/padding around icons)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
  },
  
  // Stroke width for SVG icons
  strokeWidth: {
    thin: 1.5,
    normal: 2,
    bold: 2.5,
  },
  
  // Component-specific icon sizes
  component: {
    button: {
      sm: '1rem',    // 16px - Small button icons
      md: '1.25rem', // 20px - Medium button icons
      lg: '1.5rem',  // 24px - Large button icons
    },
    card: {
      default: '1rem',   // 16px - Default card icons
      large: '1.5rem',   // 24px - Large card icons
    },
    input: {
      default: '1.25rem', // 20px - Input field icons
      small: '1rem',     // 16px - Small input icons
    },
    navigation: {
      default: '1.5rem', // 24px - Nav icons
      compact: '1.25rem', // 20px - Compact nav icons
    },
  },
};
