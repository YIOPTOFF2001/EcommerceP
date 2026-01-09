<?php
// Simple include wrapper to expose $pdo
require_once __DIR__ . '/../core/init.php';
// Configure session cookie parameters before any session_start() in endpoints
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
$cookieParams = [
  'lifetime' => 0,
  'path' => '/',
  'domain' => '', // Empty for localhost
  'secure' => false, // false for localhost HTTP
  'httponly' => false, // false to allow JavaScript access for debugging
  'samesite' => 'Lax'
];
if (defined('PHP_VERSION_ID') && PHP_VERSION_ID >= 70300) {
  session_set_cookie_params($cookieParams);
} else {
  // fallback for very old PHP versions (unlikely here)
  session_set_cookie_params($cookieParams['lifetime'], $cookieParams['path'], $cookieParams['domain'], $cookieParams['secure'], $cookieParams['httponly']);
}
ini_set('session.use_strict_mode', 1);
// Ensure users table exists
$create = "CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";
try{
  $pdo->exec($create);
} catch (PDOException $e){
  // ignore/create errors — endpoints will surface errors
}
?>