import { useReducer, useRef, useLayoutEffect, useCallback } from 'react';

// Define action types
const ACTIONS = {
  SET_MEASUREMENTS: 'set_measurements',
  TOGGLE_IMAGE_EXPANDED: 'toggle_image_expanded',
  TOGGLE_BIO_EXPANDED: 'toggle_bio_expanded',
  SET_HOVER_STATE: 'set_hover_state',
  SET_ANIMATION_STATE: 'set_animation_state',
  RESET: 'reset'
};

// Initial state for the measurements reducer
const initialState = {
  dimensions: {
    container: { width: 0, height: 0 },
    image: { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 },
    bio: { width: 0, height: 0, fullHeight: 0, isOverflowing: false },
    isCompact: false
  },
  expandedImage: false,
  expandedBio: false,
  hoverStates: {
    image: false,
    bio: false,
    contact: false
  },
  animations: {
    image: false,
    bio: false
  }
};

// Reducer function to handle all measurement and UI state
function measurementsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MEASUREMENTS:
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          ...action.payload
        }
      };
      
    case ACTIONS.TOGGLE_IMAGE_EXPANDED:
      return {
        ...state,
        expandedImage: !state.expandedImage,
        animations: {
          ...state.animations,
          image: true
        }
      };
      
    case ACTIONS.TOGGLE_BIO_EXPANDED:
      return {
        ...state,
        expandedBio: !state.expandedBio,
        animations: {
          ...state.animations,
          bio: true
        }
      };
      
    case ACTIONS.SET_HOVER_STATE:
      return {
        ...state,
        hoverStates: {
          ...state.hoverStates,
          [action.payload.element]: action.payload.isHovered
        }
      };
      
    case ACTIONS.SET_ANIMATION_STATE:
      return {
        ...state,
        animations: {
          ...state.animations,
          [action.payload.element]: action.payload.isAnimating
        }
      };
      
    case ACTIONS.RESET:
      return initialState;
      
    default:
      return state;
  }
}

/**
 * Custom hook combining useReducer, useRef, and useLayoutEffect for profile measurements
 * This hook provides advanced functionality for measuring and managing profile UI elements
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.responsive - Whether to update on window resize
 * @param {number} options.debounceMs - Debounce time for resize handling
 * @param {number} options.bioLineClamp - Number of lines to show in collapsed bio
 * @returns {Object} An object containing state, refs, and handler functions
 */
export function useProfileMeasurements(options = {}) {
  const {
    responsive = true,
    debounceMs = 200,
    bioLineClamp = 3
  } = options;
  
  // Create state with useReducer for complex state management
  const [state, dispatch] = useReducer(measurementsReducer, initialState);
  
  // Create refs for DOM elements
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const bioRef = useRef(null);
  const bioInnerRef = useRef(null);
  
  // Use useCallback to memoize event handlers
  const toggleImageExpand = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_IMAGE_EXPANDED });
  }, []);
  
  const toggleBioExpand = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_BIO_EXPANDED });
  }, []);
  
  const setHoverState = useCallback((element, isHovered) => {
    dispatch({ 
      type: ACTIONS.SET_HOVER_STATE, 
      payload: { element, isHovered } 
    });
  }, []);
  
  const setAnimationState = useCallback((element, isAnimating) => {
    dispatch({
      type: ACTIONS.SET_ANIMATION_STATE,
      payload: { element, isAnimating }
    });
  }, []);
  
  // Function to measure all dimensions using useLayoutEffect
  const measureDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    // Get container dimensions
    const container = {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight
    };
    
    // Determine if using compact layout
    const isCompact = container.width < 640; // sm breakpoint
    
    // Get image dimensions
    let image = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 };
    if (imageRef.current) {
      const img = imageRef.current;
      image = {
        width: img.offsetWidth,
        height: img.offsetHeight,
        naturalWidth: img.naturalWidth || 0,
        naturalHeight: img.naturalHeight || 0
      };
    }
    
    // Get bio dimensions
    let bio = { width: 0, height: 0, fullHeight: 0, isOverflowing: false };
    if (bioRef.current && bioInnerRef.current) {
      const bioElement = bioRef.current;
      const bioInnerElement = bioInnerRef.current;
      
      // Calculate line height for clamping
      const computedStyle = window.getComputedStyle(bioInnerElement);
      const lineHeight = parseInt(computedStyle.lineHeight, 10) || 1.5 * parseInt(computedStyle.fontSize, 10);
      
      // Calculate dimensions
      bio = {
        width: bioElement.offsetWidth,
        height: bioElement.offsetHeight,
        fullHeight: bioInnerElement.scrollHeight,
        clampedHeight: lineHeight * bioLineClamp,
        isOverflowing: bioInnerElement.scrollHeight > (lineHeight * bioLineClamp)
      };
    }
    
    // Dispatch the measurement update
    dispatch({ 
      type: ACTIONS.SET_MEASUREMENTS, 
      payload: { container, image, bio, isCompact } 
    });
  }, [bioLineClamp]);
  
  // Set up listeners and initial measurements with useLayoutEffect
  useLayoutEffect(() => {
    // Initial measurement
    measureDimensions();
    
    if (!responsive) return;
    
    // Set up debounced resize handler
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measureDimensions, debounceMs);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [responsive, debounceMs, measureDimensions]);
  
  // Re-measure after expanding/collapsing elements
  useLayoutEffect(() => {
    measureDimensions();
  }, [state.expandedImage, state.expandedBio, measureDimensions]);
  
  // Set up animation end handlers
  useLayoutEffect(() => {
    const handleAnimationEnd = (element) => {
      setAnimationState(element, false);
    };
    
    if (state.animations.image) {
      const timer = setTimeout(() => handleAnimationEnd('image'), 300);
      return () => clearTimeout(timer);
    }
    
    if (state.animations.bio) {
      const timer = setTimeout(() => handleAnimationEnd('bio'), 300);
      return () => clearTimeout(timer);
    }
  }, [state.animations, setAnimationState]);
  
  return {
    state,
    refs: {
      containerRef,
      imageRef,
      bioRef,
      bioInnerRef
    },
    actions: {
      toggleImageExpand,
      toggleBioExpand,
      setHoverState,
      measureDimensions,
      reset: () => dispatch({ type: ACTIONS.RESET })
    }
  };
}