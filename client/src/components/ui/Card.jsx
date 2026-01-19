import React from 'react';

/**
 * Card Component - Reusable card container with consistent styling
 * 
 * @param {boolean} hover - Enable hover elevation effect
 * @param {boolean} clickable - Make card appear clickable
 * @param {React.ReactNode} children - Card content
 */
const Card = ({
  hover = false,
  clickable = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 shadow-md';
  
  const hoverStyles = hover || clickable
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
    : '';
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader - Card header section
 */
export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardBody - Card main content section
 */
export const CardBody = ({ className = '', children, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardFooter - Card footer section
 */
export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`p-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
