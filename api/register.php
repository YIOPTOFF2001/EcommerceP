<?php
header('Content-Type: application/json');
require_once __DIR__ . '/init.php';

// simple JSON POST handler
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';
$name = isset($data['name']) ? trim($data['name']) : '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

try{
    // check existing
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->execute(['email'=>$email]);
    if ($stmt->fetch()){
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins = $pdo->prepare('INSERT INTO users (email, password_hash, name) VALUES (:email, :hash, :name) RETURNING id');
    $ins->execute(['email'=>$email,'hash'=>$hash,'name'=>$name]);
    $id = $ins->fetchColumn();

    // create session
    session_start();
    $_SESSION['user_id'] = $id;
    // regenerate session id after successful authentication (temporarily disabled for debugging)
    // if (function_exists('session_regenerate_id')) { session_regenerate_id(true); }

    echo json_encode(['ok'=>true,'id'=>$id,'email'=>$email,'name'=>$name]);
} catch (PDOException $e){
    http_response_code(500);
    echo json_encode(['error'=>'Server error']);
}

?>