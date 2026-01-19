/**
 * Transition System - SocialUp Design System
 * 
 * Defines consistent animation durations and easing functions.
 * Ensures smooth, consistent animations across all components.
 * 
 * Usage:
 *   import { transitions } from '../theme';
 *   transition: `all ${transitions.duration.base} ${transitions.easing.easeInOut}`
 */

export const transitions = {
  // Duration constants
  duration: {
    fast: '150ms',      // Quick interactions (hover, focus)
    base: '200ms',     // Standard transitions (default)
    slow: '300ms',     // Slower transitions (modals, dropdowns)
    slower: '500ms',   // Very slow transitions (page transitions)
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Default easing
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Predefined transition strings
  preset: {
    // Standard transitions
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Fast transitions
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Slow transitions
    slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Component-specific
    button: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    card: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    modal: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
