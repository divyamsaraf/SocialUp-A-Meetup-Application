/**
 * SocialUp Theme System - Centralized Design Tokens
 * 
 * This is the main entry point for the SocialUp design system.
 * Import from here: `import { colors, typography, spacing } from '../theme'`
 * 
 * The theme system ensures consistency across all pages and components.
 * All design decisions (colors, spacing, typography, etc.) are centralized here.
 */

export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { borderRadius } from './borderRadius';
export { shadows } from './shadows';
export { breakpoints } from './breakpoints';
export { icons } from './icons';
export { cards } from './cards';
export { buttons } from './buttons';
export { inputs } from './inputs';
export { transitions } from './transitions';
export { zIndex } from './zIndex';

// Import for internal use (components object and default export)
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';
import { breakpoints } from './breakpoints';
import { icons } from './icons';
import { cards } from './cards';
import { buttons } from './buttons';
import { inputs } from './inputs';
import { transitions } from './transitions';
import { zIndex } from './zIndex';

// Components object for component sizing consistency
export const components = {
  button: {
    height: {
      sm: buttons.size.sm.height,
      md: buttons.size.md.height,
      lg: buttons.size.lg.height,
    },
    padding: {
      sm: buttons.size.sm.padding,
      md: buttons.size.md.padding,
      lg: buttons.size.lg.padding,
    },
  },
  input: {
    height: {
      sm: inputs.size.sm.height,
      md: inputs.size.md.height,
      lg: inputs.size.lg.height,
    },
    padding: {
      sm: inputs.size.sm.padding,
      md: inputs.size.md.padding,
      lg: inputs.size.lg.padding,
    },
  },
  card: {
    padding: {
      sm: cards.size.compact.padding,
      md: cards.size.medium.padding,
      lg: cards.size.large.padding,
    },
    borderRadius: borderRadius.component.card,
    shadow: shadows.md,
    hoverShadow: shadows.lg,
  },
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  icons,
  cards,
  buttons,
  inputs,
  transitions,
  zIndex,
};

export default theme;
