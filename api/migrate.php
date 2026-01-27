<?php
include_once 'config/db.php';
include_once 'core/Migrator.php';

$migrator = new Migrator($conn, __DIR__ . '/migrations');

try {
    $executed = $migrator->migrate();
    echo json_encode([
        "status" => "success", 
        "message" => count($executed) . " migraciones ejecutadas.",
        "executed" => $executed
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
