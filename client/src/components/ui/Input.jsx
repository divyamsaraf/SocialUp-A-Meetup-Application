import React, { forwardRef } from 'react';

/**
 * Input Component - Reusable input field with consistent styling
 * 
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} error - Show error state
 * @param {string} errorMessage - Error message to display
 * @param {React.ReactNode} leftIcon - Icon to display on the left
 * @param {React.ReactNode} rightIcon - Icon to display on the right
 */
const Input = forwardRef(({
  size = 'md',
  error = false,
  errorMessage,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full outline-none transition-all duration-200 placeholder-gray-400';
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
  const inputClasses = `${baseStyles} ${sizes[size]} ${stateStyles} border rounded-lg focus:ring-2 focus:ring-offset-0 ${className}`;
  
  if (leftIcon || rightIcon) {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <input ref={ref} className={inputClasses} {...props} />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
