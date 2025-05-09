# Setting Up Your Web Space for Photo Uploads

This guide will help you set up your web server environment (like Purdue web space) to handle profile photo uploads properly.

## 1. Create the Upload Directory

First, you need to create an upload directory in your web space where the uploaded images will be stored.

```bash
# Connect to your web server via SSH or FTP
# Navigate to your public_html folder or equivalent
cd public_html

# Create the uploads directory
mkdir uploads

# Set proper permissions for the directory (readable by the web server, writable by you)
chmod 755 uploads
```

## 2. Upload the PHP Scripts

Upload all PHP files from the `php-templates` folder to your web space. These include:

- `upload.php` - Handles the profile creation form submissions and file uploads
- `index.php` - Main entry point for the PHP application
- `display-profiles.php` - Shows a list of created profiles

## 3. Check File Permissions

Make sure the PHP files have the correct permissions:

```bash
chmod 644 *.php
```

## 4. Test the Upload Functionality

You can test the upload functionality using the provided `test-form.html` file:

1. Upload `test-form.html` to your web space
2. Open it in a browser (e.g., `https://yourwebspace.example.com/test-form.html`)
3. Fill out the form and submit to test if uploads are working

## 5. Configure Your Frontend

Update the API endpoint in your frontend code to point to your PHP upload script:

```javascript
// In your client/src/lib/api.js file, update the createProfile function:

export async function createProfile(profileData) {
  // For PHP web space deployment
  const url = 'https://yourwebspace.example.com/upload.php';
  
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
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, message: 'Network error' };
  }
}
```

## 6. Troubleshooting Common Issues

### Upload Problems

If you're having trouble with uploads, check:

1. **Directory Permissions**: Make sure your `uploads` directory is writable by the web server
   ```bash
   chmod 755 uploads
   ```

2. **File Size Limits**: PHP has several configurations that limit file upload size:
   - `upload_max_filesize` (default 2MB)
   - `post_max_size` (default 8MB)
   - `memory_limit` (default 128MB)
   
   If you have access to php.ini or .htaccess, you can increase these:
   ```
   # In .htaccess
   php_value upload_max_filesize 10M
   php_value post_max_size 10M
   ```

3. **Server Logs**: Check your server error logs for more detailed information about upload failures

### CORS Issues

If you're experiencing Cross-Origin Resource Sharing (CORS) errors:

1. Make sure the PHP script has the proper headers (they're already included in our templates):
   ```php
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type");
   ```

2. For development, you may need to configure your frontend to use the correct URL for the PHP backend.

## 7. Security Considerations

1. **Validate File Types**: Always validate uploaded files by checking both MIME type and extension
2. **Sanitize Filenames**: Never use the original filename; generate a unique name instead
3. **Limit File Size**: Restrict the maximum file size to prevent server overload
4. **Verify Image Dimensions**: Consider adding validation for image dimensions if needed for your application

By following these steps, your web space should be properly configured to handle profile photo uploads securely and reliably.