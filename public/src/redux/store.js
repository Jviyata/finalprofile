import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeSlice';
import authReducer from './authSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    auth: authReducer,
    profiles: profileReducer
  }
});