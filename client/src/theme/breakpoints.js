/**
 * Breakpoint System - SocialUp Design System
 * 
 * Defines responsive breakpoints for mobile-first design.
 * These match Tailwind CSS breakpoints for consistency.
 * 
 * Usage:
 *   import { breakpoints } from '../theme';
 *   @media (min-width: ${breakpoints.md}) { ... }
 */

export const breakpoints = {
  // Standard breakpoints (mobile-first)
  sm: '640px',   // Small devices (tablets)
  md: '768px',   // Medium devices (tablets, small laptops)
  lg: '1024px',  // Large devices (laptops, desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px', // 2x extra large devices (ultra-wide screens)
  
  // Semantic breakpoint names
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  
  // Grid column counts per breakpoint
  gridColumns: {
    mobile: 1,      // 1 column on mobile
    tablet: 2,      // 2 columns on tablet
    desktop: 3,     // 3 columns on desktop
    wide: 4,        // 4 columns on wide screens
  },
  
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1320px', // Main container width (matches LayoutContainer)
    full: '100%',
  },
};
