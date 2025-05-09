import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing profile card dimensions and interactions
 * This hook provides functionality to track dimensions and responsive behavior
 * of profile cards
 * 
 * @param {Object} options - Options for the hook
 * @param {boolean} options.responsive - Whether to update dimensions on resize
 * @param {number} options.debounceMs - Debounce time in ms for resize handling
 * @returns {Object} An object containing refs, dimensions and utility functions
 */
export function useProfileDimensions(options = {}) {
  const { 
    responsive = true, 
    debounceMs = 200 
  } = options;
  
  // Create refs for DOM elements
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const bioRef = useRef(null);
  
  // State for dimensions
  const [dimensions, setDimensions] = useState({
    container: { width: 0, height: 0 },
    image: { width: 0, height: 0 },
    bio: { width: 0, height: 0 },
    isCompact: false
  });
  
  // State for expanded elements
  const [expandedImage, setExpandedImage] = useState(false);
  const [expandedBio, setExpandedBio] = useState(false);
  
  // Function to toggle image expansion
  const toggleImageExpand = useCallback(() => {
    setExpandedImage(prev => !prev);
  }, []);
  
  // Function to toggle bio expansion
  const toggleBioExpand = useCallback(() => {
    setExpandedBio(prev => !prev);
  }, []);
  
  // Function to measure dimensions
  const measureDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    let imageWidth = 0;
    let imageHeight = 0;
    
    if (imageRef.current) {
      imageWidth = imageRef.current.offsetWidth;
      imageHeight = imageRef.current.offsetHeight;
    }
    
    let bioWidth = 0;
    let bioHeight = 0;
    
    if (bioRef.current) {
      bioWidth = bioRef.current.offsetWidth;
      bioHeight = bioRef.current.offsetHeight;
    }
    
    // Determine if we should use compact layout
    const isCompact = containerWidth < 640; // sm breakpoint
    
    setDimensions({
      container: { width: containerWidth, height: containerHeight },
      image: { width: imageWidth, height: imageHeight },
      bio: { width: bioWidth, height: bioHeight },
      isCompact
    });
  }, []);
  
  // Set up resize listener if responsive is true
  useEffect(() => {
    if (!responsive) return;
    
    // Initial measurement
    measureDimensions();
    
    // Debounced resize handler
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measureDimensions, debounceMs);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [responsive, debounceMs, measureDimensions]);
  
  // Re-measure when elements expand/collapse
  useEffect(() => {
    measureDimensions();
  }, [expandedImage, expandedBio, measureDimensions]);
  
  return {
    refs: {
      containerRef,
      imageRef,
      bioRef
    },
    dimensions,
    expandedImage,
    expandedBio,
    toggleImageExpand,
    toggleBioExpand,
    measureDimensions
  };
}