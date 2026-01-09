<?php
header('Access-Control-Allow-Origin: http://localhost:8080'); // frontend URL
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');

header('Content-Type: application/json');
require_once __DIR__ . '/init.php';
session_start();
if (!isset($_SESSION['user_id'])){ http_response_code(401); echo json_encode(['error'=>'Not authenticated']); exit; }
try{
  $stmt = $pdo->prepare('SELECT id,email,name,role,created_at FROM users WHERE id = :id');
  $stmt->execute(['id'=>$_SESSION['user_id']]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if(!$row){ http_response_code(401); echo json_encode(['error'=>'Not authenticated']); exit; }
  echo json_encode(['ok'=>true,'user'=>$row]);
} catch(PDOException $e){ http_response_code(500); echo json_encode(['error'=>'Server error']); }
?>