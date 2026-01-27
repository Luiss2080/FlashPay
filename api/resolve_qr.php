<?php
include_once 'config/db.php';

$code = isset($_GET['code']) ? $_GET['code'] : '';

if (!empty($code)) {
    $code = $conn->real_escape_string($code);
    
    // Buscar en tabla QR_Pagos
    $sql = "SELECT u.id_usuario, u.nombre, u.telefono 
            FROM QR_Pagos q
            JOIN Usuarios u ON q.id_usuario = u.id_usuario
            WHERE q.codigo_qr = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["status" => "success", "data" => $row]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Código QR no válido"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Código requerido"]);
}
?>
