import React from 'react';
import { buttons } from '../../theme';
import { icons } from '../../theme';

/**
 * Button Component - Reusable button with variants
 * Uses centralized theme system for consistent styling
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} isLoading - Show loading state
 * @param {React.ReactNode} children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  // Base styles from theme
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles (using theme color values via Tailwind classes)
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-white text-blue-700 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
  };
  
  // Size styles (using theme spacing values)
  const sizes = {
    sm: 'px-4 py-2 text-sm',      // Uses theme.spacing[4] and theme.typography.fontSize.sm
    md: 'px-6 py-2.5 text-base',  // Uses theme.spacing[6] and theme.typography.fontSize.base
    lg: 'px-8 py-3 text-lg',      // Uses theme.spacing[8] and theme.typography.fontSize.lg
  };
  
  // Icon size from theme
  const iconSize = buttons.size[size].iconSize;
  const iconSizeClass = `w-${iconSize.replace('rem', '').replace('.', '-')} h-${iconSize.replace('rem', '').replace('.', '-')}`;
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className={`animate-spin -ml-1 mr-2 ${iconSizeClass}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={icons.strokeWidth.normal}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
