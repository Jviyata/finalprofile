import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, login, register, logout, resetAuthState } from '../redux/authSlice';
import { useToast } from './use-toast';

/**
 * Custom hook for managing authentication state and operations
 * 
 * @returns {Object} An object containing:
 *   - user: current user object or null if not logged in
 *   - isLoading: boolean indicating if auth operations are in progress
 *   - error: error message or null
 *   - login: function to log in a user
 *   - register: function to register a new user
 *   - logout: function to log out the current user
 */
export function useAuthRedux() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Select auth state from Redux store
  const { 
    user, 
    isLoading, 
    error, 
    loginStatus, 
    registerStatus, 
    logoutStatus 
  } = useSelector((state) => state.auth);
  
  // Fetch user data on component mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  
  // Display toast messages for errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Authentication Error',
        description: error,
        variant: 'destructive'
      });
      dispatch(resetAuthState());
    }
  }, [error, toast, dispatch]);
  
  // Login function
  const loginUser = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      toast({
        title: 'Login Successful',
        description: 'You have been logged in successfully',
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Register function
  const registerUser = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap();
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully',
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Logout function
  const logoutUser = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast({
        title: 'Logout Successful',
        description: 'You have been logged out successfully',
      });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  return {
    user,
    isLoading: isLoading || loginStatus === 'loading' || registerStatus === 'loading' || logoutStatus === 'loading',
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser
  };
}