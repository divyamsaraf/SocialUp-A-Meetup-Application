/**
 * Input System - SocialUp Design System
 * 
 * Defines standardized input field styles, sizes, and states.
 * Ensures consistent form inputs across all pages.
 * 
 * Usage:
 *   import { inputs } from '../theme';
 *   className={`${inputs.base} ${inputs.size.md} ${inputs.state.default}`}
 */

import { borderRadius } from './borderRadius';
import { spacing } from './spacing';
import { typography } from './typography';
import { colors } from './colors';

export const inputs = {
  // Base input styles
  base: {
    width: '100%',
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    borderRadius: borderRadius.component.input,
    transition: 'all 200ms ease-in-out',
    outline: 'none',
  },
  
  // Input size variants
  size: {
    sm: {
      height: '2rem',           // 32px
      padding: spacing.component.inputPadding.sm, // 8px 12px
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: '2.5rem',         // 40px
      padding: spacing.component.inputPadding.md, // 10px 16px
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: '3rem',          // 48px
      padding: spacing.component.inputPadding.lg, // 12px 20px
      fontSize: typography.fontSize.lg,
    },
  },
  
  // Input states
  state: {
    default: {
      backgroundColor: colors.surface.default,
      border: `1px solid ${colors.border.default}`,
      color: colors.text.primary,
      placeholder: colors.text.tertiary,
    },
    focus: {
      border: `2px solid ${colors.border.focus}`,
      boxShadow: `0 0 0 3px ${colors.primary[100]}`,
    },
    error: {
      border: `2px solid ${colors.border.error}`,
      boxShadow: `0 0 0 3px ${colors.error[50]}`,
    },
    disabled: {
      backgroundColor: colors.surface.active,
      border: `1px solid ${colors.border.light}`,
      color: colors.text.disabled,
      cursor: 'not-allowed',
    },
  },
  
  // Input variants
  variant: {
    default: {
      backgroundColor: colors.surface.default,
      border: `1px solid ${colors.border.default}`,
    },
    filled: {
      backgroundColor: colors.background.tertiary,
      border: 'none',
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `2px solid ${colors.border.default}`,
    },
  },
};
