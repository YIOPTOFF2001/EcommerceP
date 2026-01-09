<?php
header('Content-Type: application/json');
require_once __DIR__ . '/init.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    error_log("Delete account: No session user_id");
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

error_log("Delete account: User ID " . $_SESSION['user_id']);

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$confirm_password = isset($data['confirm_password']) ? $data['confirm_password'] : '';

if (!$confirm_password) {
    error_log("Delete account: No password provided");
    http_response_code(400);
    echo json_encode(['error' => 'Password confirmation is required']);
    exit;
}

try {
    // Verify password before deleting
    $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        error_log("Delete account: User not found in database");
        http_response_code(400);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    if (!password_verify($confirm_password, $row['password_hash'])) {
        error_log("Delete account: Password verification failed");
        http_response_code(400);
        echo json_encode(['error' => 'Password is incorrect']);
        exit;
    }

    error_log("Delete account: Password verified, deleting user");

    // Delete the user account
    $delete = $pdo->prepare('DELETE FROM users WHERE id = :id');
    $result = $delete->execute(['id' => $_SESSION['user_id']]);

    if ($result) {
        error_log("Delete account: User deleted successfully");
    } else {
        error_log("Delete account: Failed to delete user");
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete account']);
        exit;
    }

    // Clear session
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();

    echo json_encode(['ok' => true, 'message' => 'Account deleted successfully']);
} catch (PDOException $e) {
    error_log("Delete account: Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>