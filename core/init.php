<?php
// Database connection configuration — prefer environment variables
$host = getenv('POSTGRES_HOST') ?: getenv('DB_HOST') ?: 'db'; // docker-compose service name
$port = getenv('POSTGRES_PORT') ?: '5432';
$dbname = getenv('POSTGRES_DB') ?: 'francesca_de_luis';
$user = getenv('POSTGRES_USER') ?: 'yolanda';
$password = getenv('POSTGRES_PASSWORD') ?: 'strongpassword';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    // Keep message short for production safety but allow local debugging
    die("Database connection failed: " . $e->getMessage());
}
?>
