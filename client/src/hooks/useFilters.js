import { useState, useCallback } from 'react';

/**
 * useFilters - Shared hook for managing filter state
 * 
 * Provides consistent filter state management across Events and Groups pages.
 * Handles filter changes, reset functionality, and URL synchronization.
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.defaultFilters - Default filter values
 * @param {Function} options.onFilterChange - Callback when filters change
 * @returns {Object} Filter state and handlers
 */
export const useFilters = ({ defaultFilters = {}, onFilterChange }) => {
  const [filters, setFilters] = useState(defaultFilters);

  // Update a single filter
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      if (onFilterChange) {
        onFilterChange(filterName, value, newFilters);
      }
      return newFilters;
    });
  }, [onFilterChange]);

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    if (onFilterChange) {
      // Notify about reset - pass all default values
      Object.keys(defaultFilters).forEach(key => {
        onFilterChange(key, defaultFilters[key], defaultFilters);
      });
    }
  }, [defaultFilters, onFilterChange]);

  // Check if any filters are active (deviate from defaults)
  const hasActiveFilters = useCallback(() => {
    return Object.keys(defaultFilters).some(key => {
      const currentValue = filters[key];
      const defaultValue = defaultFilters[key];
      return currentValue !== defaultValue && currentValue !== '' && currentValue !== null && currentValue !== undefined;
    });
  }, [filters, defaultFilters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters: hasActiveFilters(),
    setFilters, // Allow direct setting if needed
  };
};
