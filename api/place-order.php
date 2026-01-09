<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8080'); // Match your frontend URL
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
require_once __DIR__ . '/init.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

$cart = isset($data['cart']) ? $data['cart'] : [];
$shipping = isset($data['shipping']) ? $data['shipping'] : [];
$total = isset($data['total']) ? (float)$data['total'] : 0.0;

if (empty($cart) || empty($shipping) || $total <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order data']);
    exit;
}

// Validate required shipping fields
$required = ['fullname', 'phone', 'address1', 'city', 'state', 'zip', 'country'];
foreach ($required as $field) {
    if (!isset($shipping[$field]) || empty(trim($shipping[$field]))) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    // Insert order into database
    $stmt = $pdo->prepare('
        INSERT INTO orders (user_id, items, total, shipping_address, status, created_at)
        VALUES (:user_id, :items, :total, :shipping, :status, NOW())
        RETURNING id
    ');
    $stmt->execute([
        'user_id' => $_SESSION['user_id'],
        'items' => json_encode($cart),
        'total' => $total,
        'shipping' => json_encode($shipping),
        'status' => 'pending'
    ]);
    $orderId = $stmt->fetchColumn();

    // Get user email for notifications
    $userStmt = $pdo->prepare('SELECT email, name FROM users WHERE id = :id');
    $userStmt->execute(['id' => $_SESSION['user_id']]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    // Send email notifications (requires mail server setup)
    $adminEmail = 'admin@francescadeuis.com'; // Change to your admin email
    $subject = "New Order #$orderId";
    $message = "Order #$orderId placed by {$user['name']} ({$user['email']}).\nTotal: $$total\nShipping: " . json_encode($shipping, JSON_PRETTY_PRINT);
    $headers = "From: noreply@francescadeuis.com\r\n";

    // Email to admin
    mail($adminEmail, $subject, $message, $headers);

    // Email to user
    $userSubject = "Order Confirmation #$orderId";
    $userMessage = "Thank you for your order, {$user['name']}!\n\nOrder ID: $orderId\nTotal: $$total\nShipping to: {$shipping['fullname']}, {$shipping['address1']}, {$shipping['city']}, {$shipping['state']} {$shipping['zip']}, {$shipping['country']}\n\nWe will process your order shortly.";
    mail($user['email'], $userSubject, $userMessage, $headers);

    echo json_encode(['ok' => true, 'order_id' => $orderId]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>