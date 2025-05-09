import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProfiles, 
  fetchProfile, 
  createProfile, 
  updateProfile, 
  deleteProfile,
  resetProfileState,
  setCurrentProfile
} from '../redux/profileSlice';
import { useToast } from './use-toast';
import { useLocation } from 'wouter';

/**
 * Custom hook for managing profile operations with Redux
 * 
 * @returns {Object} An object containing:
 *   - profiles: Array of all profiles
 *   - currentProfile: Current selected profile or null
 *   - isLoading: Boolean indicating if operations are in progress
 *   - error: Error message or null
 *   - fetchAllProfiles: Function to fetch all profiles
 *   - fetchProfileById: Function to fetch a profile by ID
 *   - addProfile: Function to create a new profile
 *   - editProfile: Function to update an existing profile
 *   - removeProfile: Function to delete a profile
 *   - setProfile: Function to manually set the current profile
 */
export function useProfilesRedux() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Select profile state from Redux store
  const { 
    profiles, 
    currentProfile, 
    isLoading, 
    error,
    fetchStatus,
    createStatus,
    updateStatus,
    deleteStatus
  } = useSelector((state) => state.profiles);

  // Display toast messages for errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Profile Operation Error',
        description: error,
        variant: 'destructive'
      });
      dispatch(resetProfileState());
    }
  }, [error, toast, dispatch]);

  // Display success messages for completed operations
  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast({
        title: 'Profile Created',
        description: 'The profile has been created successfully'
      });
      dispatch(resetProfileState());
    } else if (updateStatus === 'succeeded') {
      toast({
        title: 'Profile Updated',
        description: 'The profile has been updated successfully'
      });
      dispatch(resetProfileState());
    } else if (deleteStatus === 'succeeded') {
      toast({
        title: 'Profile Deleted',
        description: 'The profile has been deleted successfully'
      });
      dispatch(resetProfileState());
    }
  }, [createStatus, updateStatus, deleteStatus, toast, dispatch]);

  // Function to fetch all profiles
  const fetchAllProfiles = async () => {
    try {
      await dispatch(fetchProfiles()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Function to fetch a profile by ID
  const fetchProfileById = async (id) => {
    try {
      const result = await dispatch(fetchProfile(id)).unwrap();
      return result.profile;
    } catch (error) {
      return null;
    }
  };

  // Function to create a new profile
  const addProfile = async (profileData) => {
    try {
      const result = await dispatch(createProfile(profileData)).unwrap();
      navigate('/');
      return result.profile;
    } catch (error) {
      return null;
    }
  };

  // Function to update an existing profile
  const editProfile = async (id, profileData) => {
    try {
      const result = await dispatch(updateProfile({ id, profileData })).unwrap();
      navigate(`/profile/${id}`);
      return result.profile;
    } catch (error) {
      return null;
    }
  };

  // Function to delete a profile
  const removeProfile = async (id) => {
    try {
      await dispatch(deleteProfile(id)).unwrap();
      navigate('/');
      return true;
    } catch (error) {
      return false;
    }
  };

  // Function to manually set the current profile
  const setProfile = (profile) => {
    dispatch(setCurrentProfile(profile));
  };

  return {
    profiles,
    currentProfile,
    isLoading,
    error,
    fetchAllProfiles,
    fetchProfileById,
    addProfile,
    editProfile,
    removeProfile,
    setProfile
  };
}