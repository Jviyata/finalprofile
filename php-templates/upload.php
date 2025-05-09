<?php
// Set headers to allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// If it's an OPTIONS request, just return 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Define upload directory
$upload_dir = 'uploads/';

// Create upload directory if it doesn't exist
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Initialize response array
$response = [
    'success' => false,
    'message' => 'An error occurred during file upload',
    'data' => null
];

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $bio = isset($_POST['bio']) ? trim($_POST['bio']) : '';
    $username = isset($_POST['username']) ? trim($_POST['username']) : 'anonymous';
    
    // Validate required fields
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email format is invalid';
    }
    
    if (empty($title)) {
        $errors[] = 'Professional title is required';
    }
    
    if (empty($bio)) {
        $errors[] = 'Bio is required';
    } elseif (strlen($bio) < 50) {
        $errors[] = 'Bio should be at least 50 characters';
    }
    
    // If there are validation errors, return them
    if (!empty($errors)) {
        $response['message'] = implode(', ', $errors);
        $response['errors'] = $errors;
        echo json_encode($response);
        exit();
    }
    
    // Process image upload if exists
    $image_url = '';
    
    // Check if image is required
    if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
        $response['message'] = 'Profile image is required';
        $response['errors'] = ['image' => 'Profile image is required'];
        echo json_encode($response);
        exit();
    }
    
    // Check for upload errors
    if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $error_message = 'Unknown upload error';
        
        switch ($_FILES['image']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $error_message = 'The uploaded file exceeds the maximum allowed size';
                break;
            case UPLOAD_ERR_PARTIAL:
                $error_message = 'The file was only partially uploaded';
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                $error_message = 'Missing a temporary folder';
                break;
            case UPLOAD_ERR_CANT_WRITE:
                $error_message = 'Failed to write file to disk';
                break;
            case UPLOAD_ERR_EXTENSION:
                $error_message = 'A PHP extension stopped the file upload';
                break;
        }
        
        $response['message'] = $error_message;
        $response['errors'] = ['image' => $error_message];
        echo json_encode($response);
        exit();
    }
    
    // Process the uploaded file
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['image']['tmp_name'];
        $file_name = $_FILES['image']['name'];
        $file_size = $_FILES['image']['size'];
        $file_type = $_FILES['image']['type'];
        
        // Validate file type using both MIME and extension
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (!in_array($file_type, $allowed_types) || !in_array($file_ext, $allowed_exts)) {
            $response['message'] = 'Only JPG, PNG, GIF, and WebP images are allowed';
            $response['errors'] = ['image' => 'Only JPG, PNG, GIF, and WebP images are allowed'];
            echo json_encode($response);
            exit();
        }
        
        // Validate file size (max 5MB)
        if ($file_size > 5 * 1024 * 1024) {
            $response['message'] = 'Image size must be less than 5MB';
            $response['errors'] = ['image' => 'Image size must be less than 5MB'];
            echo json_encode($response);
            exit();
        }
        
        // Verify the file is actually an image
        if (!getimagesize($file_tmp)) {
            $response['message'] = 'File is not a valid image';
            $response['errors'] = ['image' => 'File is not a valid image'];
            echo json_encode($response);
            exit();
        }
        
        // Generate unique filename to prevent conflicts
        $unique_name = time() . '_' . bin2hex(random_bytes(8)) . '.' . $file_ext;
        $upload_path = $upload_dir . $unique_name;
        
        // Try to move the uploaded file
        if (move_uploaded_file($file_tmp, $upload_path)) {
            // Set proper permissions
            chmod($upload_path, 0644);
            
            // Set image URL (update this to your actual domain)
            $server_url = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $server_url .= "://$_SERVER[HTTP_HOST]";
            $image_url = $server_url . dirname($_SERVER['REQUEST_URI']) . '/' . $upload_path;
            
            // Log successful upload
            error_log("File successfully uploaded to: " . $upload_path);
        } else {
            // Detailed error for failed upload
            $error_message = 'Failed to move uploaded file. Check directory permissions.';
            error_log($error_message . ' Path: ' . $upload_path);
            
            $response['message'] = $error_message;
            $response['errors'] = ['image' => $error_message];
            echo json_encode($response);
            exit();
        }
    }
    
    // Generate unique ID for the profile
    $profile_id = time() . rand(1000, 9999);
    
    // Create profile data (in a real app, you would save this to a database)
    $profile = [
        'id' => $profile_id,
        'name' => $name,
        'email' => $email,
        'title' => $title,
        'bio' => $bio,
        'image_url' => $image_url,
        'username' => $username
    ];
    
    // Set successful response
    $response = [
        'success' => true,
        'message' => 'Profile created successfully',
        'data' => $profile,
        'url' => '/profile/' . $profile_id
    ];
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>