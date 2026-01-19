/**
 * Color Palette - SocialUp Design System
 * 
 * All colors used across the application should come from this palette.
 * This ensures consistency and makes it easy to update the brand colors globally.
 * 
 * Usage:
 *   import { colors } from '../theme';
 *   className={`bg-${colors.primary[600]}`} // Use Tailwind classes
 *   style={{ backgroundColor: colors.primary[600] }} // Or inline styles
 */

export const colors = {
  // Primary brand colors (Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // Main primary color - buttons, links, accents
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary colors (Purple)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea', // Main secondary color
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Accent colors (Teal/Cyan)
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  // Neutral grays
  gray: {
    50: '#f9fafb',   // Lightest background
    100: '#f3f4f6',  // Light background
    200: '#e5e7eb',  // Borders, dividers
    300: '#d1d5db',  // Disabled states
    400: '#9ca3af',  // Placeholder text
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Body text
    700: '#374151',  // Headings
    800: '#1f2937',  // Dark text
    900: '#111827',  // Darkest text
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a', // Main success color
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626', // Main error color
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706', // Main warning color
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // Main info color
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Background colors
  background: {
    default: '#ffffff',      // White background
    secondary: '#f7f7f7',   // Light gray background (main page bg)
    tertiary: '#f9fafb',    // Very light gray
    dark: '#111827',        // Dark mode background
  },
  
  // Surface colors (for cards, modals, etc.)
  surface: {
    default: '#ffffff',     // White surface
    elevated: '#ffffff',    // Elevated surface (with shadow)
    hover: '#f9fafb',      // Hover state
    active: '#f3f4f6',     // Active/pressed state
  },
  
  // Text colors
  text: {
    primary: '#111827',     // Main text color
    secondary: '#6b7280',   // Secondary text
    tertiary: '#9ca3af',    // Tertiary text
    disabled: '#d1d5db',    // Disabled text
    inverse: '#ffffff',     // Text on dark backgrounds
    link: '#2563eb',        // Link color
    linkHover: '#1d4ed8',   // Link hover color
  },
  
  // Border colors
  border: {
    default: '#e5e7eb',     // Default border
    light: '#f3f4f6',       // Light border
    dark: '#d1d5db',        // Dark border
    focus: '#2563eb',       // Focus border (blue)
    error: '#dc2626',       // Error border (red)
  },
  
  // Overlay colors (for modals, dropdowns, etc.)
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.5)',      // Modal backdrop
    light: 'rgba(255, 255, 255, 0.9)',   // Light overlay
    dark: 'rgba(0, 0, 0, 0.8)',          // Dark overlay
  },
};
