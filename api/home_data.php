<?php
include_once 'config/db.php';

$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario > 0) {
    $response = [];

    // 1. Obtener Saldo y QR
    $sql_user = "SELECT u.saldo, u.nombre, u.email, u.telefono, q.codigo_qr 
                 FROM Usuarios u 
                 LEFT JOIN QR_Pagos q ON u.id_usuario = q.id_usuario 
                 WHERE u.id_usuario = ?";
    
    $stmt = $conn->prepare($sql_user);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $response['user'] = $row;
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
        exit;
    }
    $stmt->close();

    // 2. Obtener Últimas Transacciones (donde sea emisor o receptor)
    // Mostramos las últimas 5
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
                  ORDER BY t.fecha DESC 
                  LIMIT 5";

    $stmt = $conn->prepare($sql_trans);
    $stmt->bind_param("iiii", $id_usuario, $id_usuario, $id_usuario, $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
    $response['transactions'] = $transactions;

    // 3. Obtener Notificaciones (No leídas)
    $sql_notif = "SELECT * FROM Notificaciones WHERE id_usuario = ? AND leido = 0 ORDER BY fecha DESC LIMIT 5";
    $stmt = $conn->prepare($sql_notif);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $res_notif = $stmt->get_result();
    
    $notifications = [];
    while ($row = $res_notif->fetch_assoc()) {
        $notifications[] = $row;
    }
    $response['notifications'] = $notifications;
    
    // 4. Obtener Contactos (Favoritos / Recientes)
    $sql_contacts = "SELECT c.id_contacto, c.alias, u.nombre, u.telefono 
                     FROM Contactos c
                     JOIN Usuarios u ON c.id_usuario_contacto = u.id_usuario
                     WHERE c.id_usuario = ?
                     LIMIT 10";
    $stmt = $conn->prepare($sql_contacts);
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $res_contacts = $stmt->get_result();
    
    $contacts = [];
    while ($row = $res_contacts->fetch_assoc()) {
        $contacts[] = $row;
    }
    $response['contacts'] = $contacts;

    echo json_encode(["status" => "success", "data" => $response]);

} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID de usuario requerido"]);
}
?>
