<?php
// Set headers to allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Initialize response array
$result = array(
    'status' => 'ok',
    'php_version' => PHP_VERSION,
    'server' => isset($_SERVER['SERVER_SOFTWARE']) ? $_SERVER['SERVER_SOFTWARE'] : 'Unknown',
    'checks' => array(),
    'recommendations' => array()
);

// Check PHP version
if (version_compare(PHP_VERSION, '7.0.0', '<')) {
    $result['checks'][] = array(
        'name' => 'PHP Version',
        'status' => 'warning',
        'message' => 'Your PHP version (' . PHP_VERSION . ') is quite old. We recommend using PHP 7.4 or higher for better security and performance.'
    );
    $result['recommendations'][] = 'Upgrade PHP to version 7.4 or higher if possible.';
} else {
    $result['checks'][] = array(
        'name' => 'PHP Version',
        'status' => 'ok',
        'message' => 'PHP version (' . PHP_VERSION . ') is acceptable.'
    );
}

// Check for GD Library (required for image processing)
if (function_exists('gd_info')) {
    $gd_info = gd_info();
    $result['checks'][] = array(
        'name' => 'GD Library',
        'status' => 'ok',
        'message' => 'GD Library is available (' . (isset($gd_info['GD Version']) ? $gd_info['GD Version'] : 'Unknown version') . ').'
    );
} else {
    $result['checks'][] = array(
        'name' => 'GD Library',
        'status' => 'warning',
        'message' => 'GD Library is not available. Some image processing features may not work.'
    );
    $result['recommendations'][] = 'Install or enable the GD Library for PHP.';
}

// Check upload directory
$upload_dir = 'uploads/';
if (file_exists($upload_dir)) {
    if (is_writable($upload_dir)) {
        $result['checks'][] = array(
            'name' => 'Upload Directory',
            'status' => 'ok',
            'message' => 'Upload directory exists and is writable.'
        );
    } else {
        $result['checks'][] = array(
            'name' => 'Upload Directory',
            'status' => 'error',
            'message' => 'Upload directory exists but is not writable. Set permissions to 755 or 775.'
        );
        $result['recommendations'][] = 'Change permissions on the uploads directory: chmod 755 ' . $upload_dir;
    }
} else {
    if (@mkdir($upload_dir, 0755, true)) {
        $result['checks'][] = array(
            'name' => 'Upload Directory',
            'status' => 'ok',
            'message' => 'Upload directory was created successfully.'
        );
    } else {
        $result['checks'][] = array(
            'name' => 'Upload Directory',
            'status' => 'error',
            'message' => 'Upload directory does not exist and could not be created.'
        );
        $result['recommendations'][] = 'Manually create the uploads directory and set permissions: mkdir -p ' . $upload_dir . ' && chmod 755 ' . $upload_dir;
    }
}

// Check file upload permissions
$max_upload_size = min(
    ini_get('upload_max_filesize'),
    ini_get('post_max_size'),
    ini_get('memory_limit')
);
$result['upload_limits'] = array(
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'memory_limit' => ini_get('memory_limit'),
    'max_upload_size' => $max_upload_size
);

if (str_replace('M', '', $max_upload_size) < 5) {
    $result['checks'][] = array(
        'name' => 'Upload Limits',
        'status' => 'warning',
        'message' => 'Maximum upload size is less than 5MB (' . $max_upload_size . '). This may be too restrictive for uploading profile images.'
    );
    $result['recommendations'][] = 'Increase PHP limits in php.ini or .htaccess if possible: upload_max_filesize, post_max_size, and memory_limit.';
} else {
    $result['checks'][] = array(
        'name' => 'Upload Limits',
        'status' => 'ok',
        'message' => 'Maximum upload size is adequate (' . $max_upload_size . ').'
    );
}

// Check for error_log (writable directory for debugging)
$log_file = 'php_errors.log';
$check_writable = @touch($log_file);
if ($check_writable) {
    $result['checks'][] = array(
        'name' => 'Error Logging',
        'status' => 'ok',
        'message' => 'Error logging directory is writable.'
    );
    @unlink($log_file); // Clean up test file
} else {
    $result['checks'][] = array(
        'name' => 'Error Logging',
        'status' => 'warning',
        'message' => 'Error logging directory is not writable. This may make debugging difficult.'
    );
    $result['recommendations'][] = 'Ensure your web directory is writable for error logs or configure error logging in php.ini.';
}

// Determine overall status
$has_error = false;
foreach ($result['checks'] as $check) {
    if ($check['status'] === 'error') {
        $has_error = true;
        break;
    }
}

$result['overall_status'] = $has_error ? 'error' : 'ok';
if (!$has_error && !empty($result['recommendations'])) {
    $result['overall_status'] = 'warning';
}

// Output JSON
echo json_encode($result, JSON_PRETTY_PRINT);
?>