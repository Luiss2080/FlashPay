<?php
include_once 'config/db.php';
include_once 'core/Seeder.php';

$seeder = new Seeder($conn, __DIR__ . '/seeders');

try {
    $executed = $seeder->seed();
    echo json_encode([
        "status" => "success", 
        "message" => "Seeders ejecutados correctamente.",
        "executed" => $executed
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
