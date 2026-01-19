/**
 * Theme Utilities - Helper functions for applying theme values
 * 
 * Provides utility functions to convert theme objects to Tailwind classes
 * or inline styles for easier component usage.
 * 
 * Usage:
 *   import { getButtonClasses, getCardClasses } from '../theme/utils';
 */

import { buttons } from './buttons';
import { cards } from './cards';
import { inputs } from './inputs';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

/**
 * Get Tailwind classes for a button variant and size
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @returns {string} Tailwind CSS classes
 */
export const getButtonClasses = (variant = 'primary', size = 'md') => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-white text-blue-700 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
};

/**
 * Get Tailwind classes for a card variant and size
 * @param {string} variant - 'default' | 'elevated' | 'outlined' | 'flat'
 * @param {string} size - 'compact' | 'medium' | 'large'
 * @param {boolean} hover - Enable hover effects
 * @returns {string} Tailwind CSS classes
 */
export const getCardClasses = (variant = 'default', size = 'medium', hover = false) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  
  const variantClasses = {
    default: 'shadow-md',
    elevated: 'shadow-lg',
    outlined: 'shadow-none border-2',
    flat: 'shadow-none border-none bg-gray-50',
  };
  
  const sizeClasses = {
    compact: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };
  
  const hoverClasses = hover 
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
    : '';
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses}`;
};

/**
 * Get Tailwind classes for an input variant and size
 * @param {string} variant - 'default' | 'filled' | 'outlined'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} state - 'default' | 'error' | 'disabled'
 * @returns {string} Tailwind CSS classes
 */
export const getInputClasses = (variant = 'default', size = 'md', state = 'default') => {
  const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
  
  const variantClasses = {
    default: 'bg-white border border-gray-300',
    filled: 'bg-gray-50 border-none',
    outlined: 'bg-transparent border-2 border-gray-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const stateClasses = {
    default: 'focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
  };
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${stateClasses[state]}`;
};

/**
 * Convert theme color to Tailwind class
 * @param {string} colorPath - e.g., 'primary.600', 'gray.500'
 * @returns {string} Tailwind color class
 */
export const getColorClass = (colorPath) => {
  const [color, shade] = colorPath.split('.');
  return `${color}-${shade}`;
};

/**
 * Get spacing class from theme
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @returns {string} Tailwind spacing class
 */
export const getSpacingClass = (size) => {
  return size;
};
