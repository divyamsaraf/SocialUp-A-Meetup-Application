/**
 * Typography System - SocialUp Design System
 * 
 * Defines all typography constants: font families, sizes, weights, line heights.
 * Ensures consistent text styling across all pages and components.
 * 
 * Usage:
 *   import { typography } from '../theme';
 *   className={`text-${typography.fontSize.lg} font-${typography.fontWeight.semibold}`}
 */

export const typography = {
  // Font families
  fontFamily: {
    // Primary sans-serif font stack (system fonts for performance)
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(', '),
    
    // Monospace font stack (for code)
    mono: [
      'source-code-pro',
      'Menlo',
      'Monaco',
      'Consolas',
      'Courier New',
      'monospace',
    ].join(', '),
  },
  
  // Font sizes (in rem units for accessibility)
  fontSize: {
    xs: '0.75rem',      // 12px - Captions, labels
    sm: '0.875rem',    // 14px - Small text, helper text
    base: '1rem',      // 16px - Body text (default)
    lg: '1.125rem',    // 18px - Large body text
    xl: '1.25rem',     // 20px - Small headings
    '2xl': '1.5rem',   // 24px - H4 headings
    '3xl': '1.875rem', // 30px - H3 headings
    '4xl': '2.25rem',  // 36px - H2 headings
    '5xl': '3rem',     // 48px - H1 headings (large)
    '6xl': '3.75rem',  // 60px - Hero headings
    '7xl': '4.5rem',   // 72px - Display headings
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,       // Regular text
    medium: 500,       // Medium emphasis
    semibold: 600,     // Headings, buttons
    bold: 700,         // Strong emphasis
    extrabold: 800,    // Hero headings
  },
  
  // Line heights (for readability and accessibility)
  lineHeight: {
    none: 1,
    tight: 1.25,       // Headings
    snug: 1.375,       // Compact text
    normal: 1.5,       // Body text (default)
    relaxed: 1.625,    // Comfortable reading
    loose: 2,          // Spacious text
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Predefined text styles for common use cases
  styles: {
    // Heading styles
    h1: {
      fontSize: '3rem',        // 48px
      fontWeight: 800,         // extrabold
      lineHeight: 1.25,       // tight
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',      // 36px
      fontWeight: 700,         // bold
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',    // 30px
      fontWeight: 600,         // semibold
      lineHeight: 1.375,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',      // 24px
      fontWeight: 600,
      lineHeight: 1.375,
    },
    h5: {
      fontSize: '1.25rem',     // 20px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',    // 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    
    // Body text styles
    body: {
      fontSize: '1rem',        // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontSize: '1.125rem',   // 18px
      fontWeight: 400,
      lineHeight: 1.625,
    },
    bodySmall: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    
    // Label styles
    label: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 500,        // medium
      lineHeight: 1.5,
      letterSpacing: '0.025em',
    },
    labelSmall: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    
    // Caption styles
    caption: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    
    // Button text styles
    button: {
      fontSize: '1rem',        // 16px
      fontWeight: 600,        // semibold
      lineHeight: 1.5,
      letterSpacing: '0.025em',
    },
    buttonSmall: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    buttonLarge: {
      fontSize: '1.125rem',   // 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
  },
};
