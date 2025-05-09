import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, queryClient } from '../lib/queryClient';

// Define initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  loginStatus: 'idle',
  registerStatus: 'idle',
  logoutStatus: 'idle'
};

// Fetch current user thunk
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest('GET', '/api/user');
      if (res.status === 401) {
        return null;
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await apiRequest('POST', '/api/login', credentials);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Login failed');
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await apiRequest('POST', '/api/register', userData);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || 'Registration failed');
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest('POST', '/api/logout');
      if (!res.ok) {
        return rejectWithValue('Logout failed');
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.loginStatus = 'idle';
      state.registerStatus = 'idle';
      state.logoutStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    // Fetch user cases
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user';
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.loginStatus = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.error = action.payload || 'Login failed';
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.registerStatus = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.logoutStatus = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutStatus = 'succeeded';
        state.user = null;
        // Clear user data from query cache
        queryClient.setQueryData(['/api/user'], null);
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.error = action.payload || 'Logout failed';
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;