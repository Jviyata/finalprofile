import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../lib/queryClient';

// Initial state for profile management
const initialState = {
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,
  fetchStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle'
};

// Fetch all profiles thunk
export const fetchProfiles = createAsyncThunk(
  'profiles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest('GET', '/api/profiles');
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Failed to fetch profiles');
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single profile thunk
export const fetchProfile = createAsyncThunk(
  'profiles/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiRequest('GET', `/api/profiles/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Failed to fetch profile');
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create profile thunk
export const createProfile = createAsyncThunk(
  'profiles/create',
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await apiRequest('POST', '/api/profiles', profileData);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Failed to create profile');
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update profile thunk
export const updateProfile = createAsyncThunk(
  'profiles/update',
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const res = await apiRequest('PUT', `/api/profiles/${id}`, profileData);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Failed to update profile');
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete profile thunk
export const deleteProfile = createAsyncThunk(
  'profiles/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiRequest('DELETE', `/api/profiles/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Failed to delete profile');
      }
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the profile slice
const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.error = null;
      state.fetchStatus = 'idle';
      state.createStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch all profiles cases
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.isLoading = true;
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fetchStatus = 'succeeded';
        state.profiles = action.payload.profiles;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchStatus = 'failed';
        state.error = action.payload || 'Unknown error occurred';
      })
      
      // Fetch single profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fetchStatus = 'succeeded';
        state.currentProfile = action.payload.profile;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchStatus = 'failed';
        state.error = action.payload || 'Unknown error occurred';
      })
      
      // Create profile cases
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createStatus = 'succeeded';
        state.profiles.push(action.payload.profile);
        state.currentProfile = action.payload.profile;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.createStatus = 'failed';
        state.error = action.payload || 'Unknown error occurred';
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateStatus = 'succeeded';
        state.currentProfile = action.payload.profile;
        
        // Update the profile in the profiles array
        const index = state.profiles.findIndex(p => p.id === action.payload.profile.id);
        if (index !== -1) {
          state.profiles[index] = action.payload.profile;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.updateStatus = 'failed';
        state.error = action.payload || 'Unknown error occurred';
      })
      
      // Delete profile cases
      .addCase(deleteProfile.pending, (state) => {
        state.isLoading = true;
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteStatus = 'succeeded';
        state.profiles = state.profiles.filter(p => p.id !== action.payload.id);
        
        // Clear current profile if it was deleted
        if (state.currentProfile && state.currentProfile.id === action.payload.id) {
          state.currentProfile = null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.deleteStatus = 'failed';
        state.error = action.payload || 'Unknown error occurred';
      });
  }
});

export const { resetProfileState, setCurrentProfile } = profileSlice.actions;
export default profileSlice.reducer;