# PHP Profile Upload System

This directory contains PHP templates for handling profile uploads and displaying profile information, designed specifically for deployment on web hosts like Purdue's web space or any PHP-enabled hosting.

## Files Overview

1. **upload.php** - Handles the profile form submission, validates inputs, processes file uploads, and returns JSON responses
2. **display-profiles.php** - Shows all uploaded profiles with their details
3. **test-form.html** - A simple HTML form for testing the upload functionality directly
4. **check-environment.php** - Diagnostic tool to verify your PHP environment is correctly configured
5. **UPLOAD_GUIDE.md** - Detailed instructions for setting up the upload directory
6. **README.md** - This documentation file

## Setup Instructions

### 1. Upload Files to Web Space

Upload all files from this directory to your web space. If using an FTP client:

1. Connect to your web server using FTP/SFTP
2. Navigate to your public HTML directory (often called `public_html`, `www`, or `htdocs`)
3. Create a new directory for this project (e.g., `profiles`)
4. Upload all files from this directory to the newly created directory

### 2. Set Up Upload Directory

The system needs a directory to store uploaded profile images:

```bash
# Create uploads directory
mkdir uploads

# Set proper permissions (writable by the server)
chmod 755 uploads
```

This can also be done via FTP by creating a directory named `uploads` and setting its permissions to 755.

### 3. Run Environment Check

Open `check-environment.php` in your browser to verify your environment is properly configured:

```
https://your-web-server.com/path/to/check-environment.php
```

Follow any recommendations provided by the checker.

### 4. Test the Upload Functionality

1. Open `test-form.html` in your browser
2. Fill out the form with test data
3. Submit the form to verify the upload process works
4. Check `display-profiles.php` to see the uploaded profile

## Integrating with Your React Application

To use these PHP files with your React application, you need to configure your frontend to send requests to your PHP endpoints.

### Update the API Endpoint in Your Frontend

In your React application, update `client/src/lib/api.js`:

```javascript
// Modify the createProfile function to use your PHP endpoint
export async function createProfile(profileData) {
  // For PHP deployment
  const phpEndpoint = 'https://your-web-server.com/path/to/upload.php';
  
  const formData = new FormData();
  formData.append('name', profileData.name);
  formData.append('email', profileData.email);
  formData.append('title', profileData.title);
  formData.append('bio', profileData.bio);
  formData.append('username', profileData.username);
  
  if (profileData.image) {
    formData.append('image', profileData.image);
  }
  
  try {
    const response = await fetch(phpEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, message: 'Network error' };
  }
}
```

## API Documentation

### `upload.php`

**Method:** POST  
**Content-Type:** multipart/form-data  
**Description:** Handles profile creation with image upload

**Request Parameters:**
- `name` (string, required): Full name
- `email` (string, required): Email address 
- `title` (string, required): Professional title
- `bio` (string, required): Professional bio (minimum 50 characters)
- `image` (file, required): Profile image (max 5MB, formats: JPG, PNG, GIF, WebP)
- `username` (string, optional): Username identifier

**Response:**
```json
{
  "success": true|false,
  "message": "Success or error message",
  "data": {
    "id": "unique_id",
    "name": "User's name",
    "email": "user@example.com",
    "title": "Professional title",
    "bio": "User's bio",
    "image_url": "https://path/to/uploaded/image.jpg",
    "username": "username"
  },
  "url": "/profile/unique_id",
  "errors": ["Optional array of validation errors"]
}
```

### `check-environment.php` 

**Method:** GET  
**Description:** Checks the PHP environment for compatibility

**Response:**
```json
{
  "status": "ok|warning|error",
  "php_version": "7.4.0",
  "server": "Apache/2.4.41",
  "checks": [
    {
      "name": "Check name",
      "status": "ok|warning|error",
      "message": "Detailed message"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "upload_limits": {
    "upload_max_filesize": "8M",
    "post_max_size": "8M",
    "memory_limit": "128M",
    "max_upload_size": "8M"
  }
}
```

## Troubleshooting

### Common Issues

1. **"Failed to move uploaded file"**
   - Check permissions on the uploads directory
   - Ensure the web server has write access
   - Solution: `chmod 755 uploads` or `chmod 775 uploads`

2. **"Image size must be less than 5MB"**
   - The uploaded file exceeds the maximum allowed size
   - Solution: Resize the image before uploading or increase PHP limits

3. **CORS Errors**
   - If your React app is hosted on a different domain
   - Solution: The PHP files already include CORS headers, but you may need to configure your server for additional headers

4. **"Only JPG, PNG, GIF, and WebP images are allowed"**
   - Attempted to upload an unsupported file type
   - Solution: Convert the image to one of the supported formats

### PHP Error Logs

If you encounter issues, check your PHP error logs:

- On shared hosting: Look for error logs in your hosting control panel
- Custom server: Check `/var/log/apache2/error.log` or equivalent

## Security Considerations

These scripts implement several security measures:

1. **Input Validation**: All user inputs are validated
2. **File Type Checking**: Both MIME types and file extensions are verified
3. **Size Limits**: Maximum file size is enforced
4. **Secure Filenames**: Unique filenames are generated to prevent overwriting
5. **XSS Prevention**: Outputs are properly escaped using `htmlspecialchars()`

## Customization

You can customize various aspects of the system:

- **Appearance**: Edit the CSS in `display-profiles.php` and `test-form.html`
- **Validation Rules**: Modify validation logic in `upload.php`
- **File Types**: Change allowed file types in `upload.php`
- **Maximum File Size**: Adjust the 5MB limit in `upload.php`

## Support

For additional assistance, refer to the complete application documentation or contact your system administrator.