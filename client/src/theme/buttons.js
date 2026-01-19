/**
 * Button System - SocialUp Design System
 * 
 * Defines standardized button styles, sizes, and variants.
 * Ensures consistent button appearance across all pages.
 * 
 * Usage:
 *   import { buttons } from '../theme';
 *   className={`${buttons.base} ${buttons.variant.primary} ${buttons.size.md}`}
 */

import { borderRadius } from './borderRadius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';
import { colors } from './colors';

export const buttons = {
  // Base button styles
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.component.button,
    transition: 'all 200ms ease-in-out',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  // Button size variants
  size: {
    sm: {
      height: '2rem',           // 32px
      padding: spacing.component.buttonPadding.sm, // 8px 16px
      fontSize: typography.fontSize.sm,
      iconSize: '1rem',          // 16px
    },
    md: {
      height: '2.5rem',          // 40px
      padding: spacing.component.buttonPadding.md, // 10px 20px
      fontSize: typography.fontSize.base,
      iconSize: '1.25rem',       // 20px
    },
    lg: {
      height: '3rem',            // 48px
      padding: spacing.component.buttonPadding.lg, // 12px 24px
      fontSize: typography.fontSize.lg,
      iconSize: '1.5rem',        // 24px
    },
  },
  
  // Button variants
  variant: {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.text.inverse,
      boxShadow: shadows.component.button.default,
      hover: {
        backgroundColor: colors.primary[700],
        boxShadow: shadows.component.button.hover,
        transform: 'translateY(-2px)',
      },
      focus: {
        ringColor: colors.primary[500],
      },
    },
    secondary: {
      backgroundColor: colors.surface.default,
      color: colors.primary[700],
      border: `2px solid ${colors.primary[600]}`,
      boxShadow: shadows.component.button.default,
      hover: {
        backgroundColor: colors.primary[50],
        boxShadow: shadows.component.button.hover,
        transform: 'translateY(-2px)',
      },
      focus: {
        ringColor: colors.primary[500],
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      border: `2px solid ${colors.border.default}`,
      hover: {
        backgroundColor: colors.surface.hover,
        borderColor: colors.border.dark,
      },
      focus: {
        ringColor: colors.gray[500],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      border: 'none',
      hover: {
        backgroundColor: colors.surface.hover,
      },
      focus: {
        ringColor: colors.gray[500],
      },
    },
    danger: {
      backgroundColor: colors.error[600],
      color: colors.text.inverse,
      boxShadow: shadows.component.button.default,
      hover: {
        backgroundColor: colors.error[700],
        boxShadow: shadows.component.button.hover,
      },
      focus: {
        ringColor: colors.error[500],
      },
    },
  },
  
  // Loading state
  loading: {
    opacity: 0.7,
    cursor: 'wait',
  },
};
