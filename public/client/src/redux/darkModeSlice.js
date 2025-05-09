import { createSlice } from '@reduxjs/toolkit';

// Initialize the dark mode state from localStorage (if available)
const initialState = {
  darkMode: typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false
};

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', String(state.darkMode));
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', String(state.darkMode));
      }
    }
  }
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;