import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook for search and filtering functionality
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.items - Array of items to search/filter
 * @param {Array} options.searchFields - Fields to include in search (e.g., ['name', 'bio'])
 * @param {Object} options.filterOptions - Available filter options configuration
 * @param {Function} options.onSearchChange - Callback when search changes
 * @returns {Object} An object containing search state and functions
 */
export function useSearchFilter(options) {
  const {
    items = [],
    searchFields = ['name', 'bio'],
    filterOptions = {
      title: [
        { value: 'all', label: 'All Titles' },
        { value: 'Full Stack Developer', label: 'Full Stack Developer' },
        { value: 'UX Designer', label: 'UX Designer' },
        { value: 'Product Manager', label: 'Product Manager' },
        { value: 'Data Scientist', label: 'Data Scientist' },
        { value: 'DevOps Engineer', label: 'DevOps Engineer' }
      ]
    },
    onSearchChange = null
  } = options;
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    title: 'all'
  });
  const [searchHistory, setSearchHistory] = useState([]);
  const [, navigate] = useLocation();
  
  // Process search term input
  const handleSearchChange = useCallback((event) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);
    
    if (onSearchChange) {
      onSearchChange(newTerm);
    }
  }, [onSearchChange]);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [onSearchChange]);
  
  // Add term to search history
  const addToSearchHistory = useCallback((term) => {
    if (!term.trim()) return;
    
    setSearchHistory(prev => {
      // Remove duplicate if it exists
      const filteredHistory = prev.filter(item => item !== term);
      // Add to beginning, limit to 5 items
      return [term, ...filteredHistory].slice(0, 5);
    });
  }, []);
  
  // Handle search submission
  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm);
    }
    
    // Navigate to search results or update URL
    // Only if not already on search results page
    if (window.location.pathname !== '/search') {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  }, [searchTerm, addToSearchHistory, navigate]);
  
  // Change filter
  const setFilter = useCallback((filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setActiveFilters({
      title: 'all'
    });
  }, []);
  
  // On mount, load search history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);
  
  // Save search history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, [searchHistory]);
  
  // Filter items based on search term and active filters
  const filteredItems = useMemo(() => {
    if (!items.length) return [];
    
    return items.filter(item => {
      // Apply filters
      if (activeFilters.title !== 'all' && item.title !== activeFilters.title) {
        return false;
      }
      
      // Apply search
      if (!searchTerm.trim()) return true;
      
      // Search across all specified fields
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (!fieldValue) return false;
        
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [items, searchTerm, searchFields, activeFilters]);
  
  // Get available filter options and counts
  const filterCounts = useMemo(() => {
    const counts = {
      title: { all: items.length }
    };
    
    items.forEach(item => {
      // Count by title
      if (item.title) {
        if (!counts.title[item.title]) {
          counts.title[item.title] = 0;
        }
        counts.title[item.title]++;
      }
    });
    
    return counts;
  }, [items]);
  
  // Calculate if there are any active non-default filters
  const hasActiveFilters = useMemo(() => {
    return Object.entries(activeFilters).some(([key, value]) => {
      return value !== 'all';
    });
  }, [activeFilters]);
  
  return {
    // State
    searchTerm,
    activeFilters,
    searchHistory,
    filterCounts,
    filteredItems,
    hasActiveFilters,
    
    // Actions
    setSearchTerm,
    handleSearchChange,
    clearSearch,
    handleSearchSubmit,
    setFilter,
    resetFilters,
    addToSearchHistory
  };
}