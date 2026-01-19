/**
 * Z-Index System - SocialUp Design System
 * 
 * Defines z-index layers to prevent stacking context issues.
 * Higher values = elements appear on top.
 * 
 * Usage:
 *   import { zIndex } from '../theme';
 *   style={{ zIndex: zIndex.modal }}
 */

export const zIndex = {
  // Base layers
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  
  // Overlay layers
  overlay: 1040,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  
  // Component-specific z-index
  component: {
    navbar: 1030,
    dropdown: 1000,
    tooltip: 1070,
    modal: 1050,
    toast: 1080,
  },
};
