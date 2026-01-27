<?php
include_once 'config/db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (empty($_GET['user_id'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Falta user_id"]);
        exit;
    }
    
    $user_id = intval($_GET['user_id']);
    
    // Mark all as read when fetching? Or separate endpoint?
    // Let's just fetch for now.
    
    $sql = "SELECT * FROM Notificaciones WHERE id_usuario = $user_id ORDER BY fecha DESC LIMIT 20";
    $result = $conn->query($sql);
    
    $notifications = [];
    while($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }
    
    // Auto-mark as read for simplicity when opening the screen
    $conn->query("UPDATE Notificaciones SET leido = 1 WHERE id_usuario = $user_id AND leido = 0");
    
    echo json_encode(["status" => "success", "notifications" => $notifications]);
}
?>
