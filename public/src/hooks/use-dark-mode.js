import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, setDarkMode } from '../redux/darkModeSlice';

/**
 * Custom hook for managing the application's dark mode state
 * 
 * @returns {Object} An object containing:
 *   - darkMode: boolean indicating if dark mode is active
 *   - toggleDarkMode: function to toggle dark mode
 *   - setDarkMode: function to set dark mode to a specific value
 */
export function useDarkMode() {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const dispatch = useDispatch();
  
  // Function to toggle between dark and light mode
  const toggle = () => {
    dispatch(toggleDarkMode());
    
    // Apply appropriate class to the body element
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  
  // Function to set dark mode to a specific value
  const set = (value) => {
    dispatch(setDarkMode(value));
    
    // Apply appropriate class to the body element
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return {
    darkMode,
    toggleDarkMode: toggle,
    setDarkMode: set
  };
}