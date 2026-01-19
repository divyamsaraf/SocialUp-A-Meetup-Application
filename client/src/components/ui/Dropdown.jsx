import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown Component - Reusable dropdown menu
 * 
 * @param {React.ReactNode} trigger - Element that triggers the dropdown
 * @param {Array} options - Array of { label, value, onClick } objects
 * @param {string} placement - 'bottom' | 'top' | 'left' | 'right'
 * @param {boolean} closeOnSelect - Close dropdown when option is selected
 */
const Dropdown = ({
  trigger,
  options = [],
  placement = 'bottom',
  closeOnSelect = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick(option.value);
    }
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const placementClasses = {
    bottom: 'top-full left-0 mt-2',
    top: 'bottom-full left-0 mb-2',
    right: 'top-0 left-full ml-2',
    left: 'top-0 right-full mr-2',
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${placementClasses[placement]} z-50 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden`}
          role="menu"
        >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionClick(option)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
              role="menuitem"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
