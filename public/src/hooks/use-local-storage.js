import { useState, useEffect } from "react";

/**
 * Custom hook for managing state that persists in localStorage
 * 
 * @param {string} key - The localStorage key to store the value under
 * @param {any} initialValue - The initial value if no value exists in localStorage
 * @returns {Array} A stateful value and a function to update it
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch storage event for other tabs to listen for
      window.dispatchEvent(new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(valueToStore),
        oldValue: JSON.stringify(storedValue),
        storageArea: localStorage,
        url: window.location.href
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage item in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value:`, error);
        }
      }
    };
    
    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);
    
    // Cleanup
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}