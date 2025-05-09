<?php
// Set content type to HTML
header('Content-Type: text/html');

// Define upload directory
$upload_dir = 'uploads/';

// Helper function to get profiles
function getProfiles() {
    // In a real application, you would fetch this from a database
    // For this example, we'll just check the uploads directory for images
    global $upload_dir;
    
    $profiles = [];
    
    // Check if uploads directory exists
    if (file_exists($upload_dir) && is_dir($upload_dir)) {
        $files = scandir($upload_dir);
        
        foreach ($files as $file) {
            // Skip . and .. directories
            if ($file === '.' || $file === '..') {
                continue;
            }
            
            // Only include image files
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            
            if (in_array(strtolower($extension), $allowed_extensions)) {
                // Get image URL
                $server_url = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                $server_url .= "://$_SERVER[HTTP_HOST]";
                $image_url = $server_url . dirname($_SERVER['REQUEST_URI']) . '/' . $upload_dir . $file;
                
                // Extract timestamp from filename (assuming format from upload.php)
                $timestamp_parts = explode('_', $file);
                $timestamp = $timestamp_parts[0] ?? time();
                
                // Create mock profile (in a real app, this would come from a database)
                $profiles[] = [
                    'id' => $timestamp . rand(1000, 9999),
                    'name' => 'User ' . substr($file, 0, 8),
                    'email' => 'user_' . substr($file, 0, 6) . '@example.com',
                    'title' => 'Professional',
                    'bio' => 'This is a placeholder bio for profiles created through the PHP upload script. In a real application, this would be stored in a database along with other profile details.',
                    'image_url' => $image_url,
                    'timestamp' => $timestamp
                ];
            }
        }
        
        // Sort by timestamp (newest first)
        usort($profiles, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });
    }
    
    return $profiles;
}

// Get profiles
$profiles = getProfiles();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uploaded Profiles</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .profiles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .profile-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        .profile-card:hover {
            transform: translateY(-5px);
        }
        .profile-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        .profile-info {
            padding: 15px;
        }
        .profile-name {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
        }
        .profile-title {
            font-size: 16px;
            color: #556b2f;
            margin: 0 0 8px 0;
        }
        .profile-email {
            font-size: 14px;
            color: #555;
            margin: 0 0 12px 0;
        }
        .profile-bio {
            font-size: 14px;
            color: #555;
            margin: 0 0 10px 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .profile-date {
            font-size: 13px;
            color: #777;
            margin-top: 8px;
        }
        .no-profiles {
            text-align: center;
            padding: 50px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .upload-link {
            display: block;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Uploaded Profiles</h1>
    
    <?php if (empty($profiles)): ?>
        <div class="no-profiles">
            <p>No profiles have been uploaded yet.</p>
        </div>
    <?php else: ?>
        <div class="profiles-grid">
            <?php foreach ($profiles as $profile): ?>
                <div class="profile-card">
                    <img src="<?php echo htmlspecialchars($profile['image_url']); ?>" alt="<?php echo htmlspecialchars($profile['name']); ?>" class="profile-image">
                    <div class="profile-info">
                        <h2 class="profile-name"><?php echo htmlspecialchars($profile['name']); ?></h2>
                        <p class="profile-title"><?php echo htmlspecialchars($profile['title']); ?></p>
                        <p class="profile-email"><?php echo htmlspecialchars($profile['email']); ?></p>
                        <p class="profile-bio"><?php echo htmlspecialchars($profile['bio']); ?></p>
                        <p class="profile-date">Uploaded: <?php echo date('M j, Y', $profile['timestamp']); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    
    <a href="test-form.html" class="upload-link">Upload New Profile</a>
</body>
</html>