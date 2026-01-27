<?php
include_once 'config/db.php';

$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario > 0) {
    // Obtener TODAS las transacciones ordenadas por fecha reciente
    $sql_trans = "SELECT t.*, 
                  CASE 
                    WHEN t.id_emisor = ? THEN 'egreso' 
                    ELSE 'ingreso' 
                  END as direccion,
                  CASE 
                    WHEN t.id_emisor = ? THEN (SELECT nombre FROM Usuarios WHERE id_usuario = t.id_receptor)
                    ELSE (SELECT nombre FROM Usuarios WHERE id_usuario = t.id_emisor)
                  END as otro_usuario_nombre
                  FROM Transacciones t 
                  WHERE t.id_emisor = ? OR t.id_receptor = ? 
                  ORDER BY t.fecha DESC"; // Sin límite para historial completo

    $stmt = $conn->prepare($sql_trans);
    $stmt->bind_param("iiii", $id_usuario, $id_usuario, $id_usuario, $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $transactions]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID de usuario requerido"]);
}
?>
