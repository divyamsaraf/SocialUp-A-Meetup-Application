/**
 * Card System - SocialUp Design System
 * 
 * Defines standardized card styles, sizes, and variants.
 * Ensures consistent card appearance across Events, Groups, Profile, etc.
 * 
 * Usage:
 *   import { cards } from '../theme';
 *   className={`${cards.base} ${cards.size.medium}`}
 */

import { borderRadius } from './borderRadius';
import { shadows } from './shadows';
import { spacing } from './spacing';

export const cards = {
  // Base card styles
  base: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.component.card,
    border: '1px solid #e5e7eb',
    boxShadow: shadows.component.card.default,
  },
  
  // Card size variants
  size: {
    compact: {
      padding: spacing.component.cardPadding.compact, // 16px
      minHeight: 'auto',
    },
    medium: {
      padding: spacing.component.cardPadding.default,  // 24px
      minHeight: '200px',
    },
    large: {
      padding: spacing.component.cardPadding.spacious, // 32px
      minHeight: '300px',
    },
  },
  
  // Card variants
  variant: {
    default: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: shadows.component.card.default,
    },
    elevated: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: shadows.component.card.elevated,
    },
    outlined: {
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      boxShadow: 'none',
    },
    flat: {
      backgroundColor: '#f9fafb',
      border: 'none',
      boxShadow: 'none',
    },
  },
  
  // Hover states
  hover: {
    default: {
      boxShadow: shadows.component.card.hover,
      transform: 'translateY(-2px)',
      transition: 'all 200ms ease-in-out',
    },
    subtle: {
      boxShadow: shadows.md,
      transition: 'box-shadow 200ms ease-in-out',
    },
  },
  
  // Card content spacing
  content: {
    header: {
      paddingBottom: spacing.md,
      marginBottom: spacing.md,
      borderBottom: '1px solid #e5e7eb',
    },
    body: {
      padding: spacing.md,
    },
    footer: {
      paddingTop: spacing.md,
      marginTop: spacing.md,
      borderTop: '1px solid #e5e7eb',
    },
  },
  
  // Event card specific
  event: {
    imageHeight: {
      compact: '120px',
      default: '160px',
      large: '200px',
    },
    padding: spacing.component.cardPadding.compact,
  },
  
  // Group card specific
  group: {
    imageHeight: {
      compact: '120px',
      default: '192px', // h-48
      large: '240px',
    },
    padding: spacing.component.cardPadding.default,
  },
};
