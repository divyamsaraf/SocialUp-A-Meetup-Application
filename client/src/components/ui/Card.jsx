import React from 'react';
import { cards } from '../../theme';
import { transitions } from '../../theme';

/**
 * Card Component - Reusable card container with consistent styling
 * Uses centralized theme system for consistent card appearance
 * 
 * @param {boolean} hover - Enable hover elevation effect
 * @param {boolean} clickable - Make card appear clickable
 * @param {string} variant - 'default' | 'elevated' | 'outlined' | 'flat'
 * @param {string} size - 'compact' | 'medium' | 'large'
 * @param {React.ReactNode} children - Card content
 */
const Card = ({
  hover = false,
  clickable = false,
  variant = 'default',
  size = 'medium',
  className = '',
  children,
  ...props
}) => {
  // Base styles from theme
  const baseStyles = 'bg-white rounded-lg border border-gray-200';
  
  // Variant-specific shadow (using theme shadow values)
  const variantShadows = {
    default: 'shadow-md',      // cards.variant.default.boxShadow
    elevated: 'shadow-lg',     // cards.variant.elevated.boxShadow
    outlined: 'shadow-none border-2', // cards.variant.outlined
    flat: 'shadow-none border-none bg-gray-50', // cards.variant.flat
  };
  
  // Hover styles from theme
  const hoverStyles = hover || clickable
    ? `transition-all ${transitions.duration.base} ${transitions.easing.easeInOut} hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`
    : '';
  
  return (
    <div
      className={`${baseStyles} ${variantShadows[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader - Card header section
 * Uses theme spacing and border colors
 */
export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardBody - Card main content section
 * Uses theme spacing
 */
export const CardBody = ({ className = '', children, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardFooter - Card footer section
 * Uses theme spacing and border colors
 */
export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`p-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
