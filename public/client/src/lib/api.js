import { apiRequest } from "./queryClient";

// Profile type:
// {
//   id: string;
//   name: string;
//   email: string;
//   title: string;
//   bio: string;
//   image_url: string;
//   username: string;
// }

// Fetch all profiles
export async function getProfiles() {
  try {
    const response = await apiRequest("GET", "/api/profiles");
    const data = await response.json();
    return data.profiles || [];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
}

// Fetch a single profile by ID
export async function getProfile(id) {
  try {
    console.log(`Fetching profile with ID: ${id}`);
    const response = await apiRequest("GET", `/api/profiles/${id}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Profile data:`, data);
    
    if (!data || !data.profile) {
      console.warn(`No profile data found for ID ${id}`);
      return null;
    }
    
    return data.profile;
  } catch (error) {
    console.error(`Error fetching profile ${id}:`, error);
    throw error;
  }
}

// Create a new profile
export async function createProfile(profileData) {
  try {
    const formData = new FormData();
    if (profileData.image) {
      formData.append('image', profileData.image);
    }
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('title', profileData.title);
    // Bio field removed as requested
    
    // Get username from auth context or local storage
    const storedUser = localStorage.getItem('user');
    const username = profileData.username || (storedUser ? JSON.parse(storedUser).username : '');
    formData.append('username', username);

    // PHP backend URL - update this to your specific PHP endpoint
    const phpUploadUrl = 'https://web.ics.purdue.edu/~zong6/profile-app/upload.php';
    
    // Use fetch directly to call PHP endpoint
    const response = await fetch(phpUploadUrl, {
      method: 'POST',
      body: formData,
      // No need to set Content-Type header, browser will set it correctly with boundary
    });

    // Process PHP response
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Format the response to match our existing API format
    return {
      success: result.success || result.status === 'success',
      message: result.message || '',
      url: result.url || '/profile',
      profile: result.profile || result.data || {}
    };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, message: 'Failed to create profile. Please try again.' };
  }
}

// Update an existing profile
export async function updateProfile(id, profileData) {
  try {
    // First try to use the Express backend
    try {
      const response = await apiRequest("PUT", `/api/profiles/${id}`, profileData);
      
      if (response.ok) {
        const result = await response.json();
        return result.profile;
      }
    } catch (error) {
      console.warn('Express API update failed, trying PHP fallback:', error);
      // If Express update fails, try PHP fallback
    }

    // PHP fallback - similar to createProfile
    let formData;
    if (profileData instanceof FormData) {
      // If profileData is already FormData (from the component)
      formData = profileData;
      // Add ID to form data
      formData.append('id', id);
      formData.append('_method', 'PUT'); // For PHP to understand it's an update
    } else {
      // If profileData is an object, convert to FormData
      formData = new FormData();
      if (profileData.image) {
        formData.append('image', profileData.image);
      }
      formData.append('id', id);
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('title', profileData.title);
      formData.append('bio', profileData.bio || '');
      formData.append('website', profileData.website || '');
      formData.append('_method', 'PUT');
      
      // Get username if available
      const storedUser = localStorage.getItem('user');
      const username = profileData.username || (storedUser ? JSON.parse(storedUser).username : '');
      formData.append('username', username);
    }

    // PHP backend URL for updates
    const phpUpdateUrl = 'https://web.ics.purdue.edu/~zong6/profile-app/update.php';
    
    const response = await fetch(phpUpdateUrl, {
      method: 'POST', // PHP typically accepts POST with a _method field
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Return the updated profile object
    return result.profile || result.data || {};
  } catch (error) {
    console.error(`Error updating profile ${id}:`, error);
    throw new Error('Failed to update profile: ' + error.message);
  }
}

// Delete a profile
export async function deleteProfile(id) {
  try {
    const response = await apiRequest("DELETE", `/api/profiles/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to delete profile: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error(`Error deleting profile ${id}:`, error);
    return false;
  }
}