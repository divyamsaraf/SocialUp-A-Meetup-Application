/**
 * Border Radius System - SocialUp Design System
 * 
 * Defines consistent border radius values for cards, buttons, inputs, and other components.
 * 
 * Usage:
 *   import { borderRadius } from '../theme';
 *   className={`rounded-${borderRadius.lg}`}
 */

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px - Small radius
  base: '0.25rem',  // 4px - Base radius
  md: '0.375rem',   // 6px - Medium radius
  lg: '0.5rem',     // 8px - Large radius (default for cards)
  xl: '0.75rem',    // 12px - Extra large radius
  '2xl': '1rem',    // 16px - 2x large radius
  '3xl': '1.5rem',  // 24px - 3x large radius
  full: '9999px',   // Fully rounded (pills, circles)
  
  // Component-specific radius
  component: {
    button: '9999px',      // Full radius for buttons (pill shape)
    card: '0.5rem',        // 8px - Default card radius
    input: '0.5rem',       // 8px - Input field radius
    badge: '9999px',       // Full radius for badges
    modal: '0.75rem',      // 12px - Modal radius
    dropdown: '0.5rem',    // 8px - Dropdown radius
    avatar: '9999px',     // Full radius for avatars (circular)
  },
};
