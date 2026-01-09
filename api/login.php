<?php
header('Access-Control-Allow-Origin: http://localhost:8080'); // frontend URL
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once __DIR__ . '/init.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

try{
    $stmt = $pdo->prepare('SELECT id, password_hash, name FROM users WHERE email = :email');
    $stmt->execute(['email'=>$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row){
        http_response_code(401);
        echo json_encode(['error'=>'Account not found. Please <a href="signup.html">create an account</a>.']);
        exit;
    }
    if (!password_verify($password, $row['password_hash'])){
        http_response_code(401);
        echo json_encode(['error'=>'Invalid password']);
        exit;
    }
    session_start();
    // successful login
    $_SESSION['user_id'] = $row['id'];
    // regenerate session id after successful login (temporarily disabled for debugging)
    // if (function_exists('session_regenerate_id')) { session_regenerate_id(true); }
    echo json_encode(['ok'=>true,'id'=>$row['id'],'email'=>$email,'name'=>$row['name']]);
} catch (PDOException $e){
    http_response_code(500);
    echo json_encode(['error'=>'Server error']);
}
?>