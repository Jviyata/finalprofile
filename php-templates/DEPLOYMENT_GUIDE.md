# PHP Backend Deployment Guide

This guide walks you through deploying the PHP backend for profile image uploads on your web server.

## Step 1: Prepare Your Web Space

1. Log in to your web server (e.g., via FTP or SSH)
2. Create a directory for the application: `mkdir -p profile-app/uploads`
3. Set proper permissions:
   ```bash
   chmod 755 profile-app
   chmod 755 profile-app/uploads
   ```

## Step 2: Upload the PHP Files

Copy all the files from this directory to your web server:

1. `upload.php` - Handles form submissions and image uploads
2. `display-profiles.php` - Shows all uploaded profiles
3. `test-form.html` - Provides a testing interface
4. `index.php` - Entry point that redirects to the profile display page

## Step 3: Test the PHP Backend

1. Navigate to `https://your-domain.com/profile-app/test-form.html` in your browser
2. Fill out the form and upload an image
3. Submit the form
4. You should be redirected to a success page with your profile information
5. Navigate to `https://your-domain.com/profile-app/display-profiles.php` to see all profiles

## Step 4: Update the Frontend Application

In the main React application, update the API endpoint in `client/src/lib/api.js`:

```javascript
// PHP backend URL - update this to your specific PHP endpoint
const phpUploadUrl = 'https://your-domain.com/profile-app/upload.php';
```

Replace `your-domain.com` with your actual domain name.

## Security Best Practices

1. **Input Validation**: Always validate and sanitize all user inputs
2. **File Validation**: Only allow specific image file types and limit file size
3. **Error Handling**: Implement proper error handling and logging
4. **HTTPS**: Ensure your server uses HTTPS for secure data transmission
5. **Permissions**: Set restrictive permissions on your upload directory

## Troubleshooting

### Image Upload Issues
- Check file permissions on the uploads directory
- Verify the web server has write access to the uploads directory
- Check PHP error logs for detailed error messages

### CORS Issues
- If you encounter CORS errors, ensure the headers in `upload.php` match your frontend domain
- For more restrictive CORS, update the `Access-Control-Allow-Origin` header to specify your exact domain

### File Size Limitations
- PHP has several configuration settings that limit upload size:
  - `upload_max_filesize`
  - `post_max_size`
  - `memory_limit`
- You may need to adjust these in your PHP configuration or .htaccess file

## Database Integration

For a production environment, you should store profile data in a database:

1. Create a MySQL database
2. Set up a table structure (e.g., `profiles` table)
3. Update `upload.php` to insert data into the database
4. Update `display-profiles.php` to fetch profiles from the database

Example SQL for creating a profiles table:

```sql
CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  image_url VARCHAR(255),
  username VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```