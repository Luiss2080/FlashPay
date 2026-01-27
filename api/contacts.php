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
    
    $sql = "SELECT c.id_contacto, c.alias, u.nombre, u.telefono, u.email, u.id_usuario as contact_user_id 
            FROM Contactos c
            JOIN Usuarios u ON c.id_usuario_contacto = u.id_usuario
            WHERE c.id_usuario = $user_id";
            
    $result = $conn->query($sql);
    
    $contacts = [];
    while($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    
    echo json_encode(["status" => "success", "contacts" => $contacts]);

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->user_id) || (empty($data->contact_phone) && empty($data->contact_email))) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
        exit;
    }

    $user_id = $data->user_id;
    $alias = !empty($data->alias) ? $conn->real_escape_string($data->alias) : null;
    
    // Find contact user
    $where = "";
    if (!empty($data->contact_phone)) {
        $phone = $conn->real_escape_string($data->contact_phone);
        $where = "telefono = '$phone'";
    } else {
        $email = $conn->real_escape_string($data->contact_email);
        $where = "email = '$email'";
    }
    
    $sql_find = "SELECT id_usuario, nombre FROM Usuarios WHERE $where";
    $result_find = $conn->query($sql_find);
    
    if ($result_find->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Usuario contacto no encontrado"]);
        exit;
    }
    
    $contact_user = $result_find->fetch_assoc();
    $contact_user_id = $contact_user['id_usuario'];
    
    if ($user_id == $contact_user_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No puedes agregarte a ti mismo"]);
        exit;
    }
    
    if (empty($alias)) {
        $alias = $contact_user['nombre'];
    }

    $sql_insert = "INSERT INTO Contactos (id_usuario, id_usuario_contacto, alias) VALUES ($user_id, $contact_user_id, '$alias')
                   ON DUPLICATE KEY UPDATE alias = '$alias'";
                   
    if ($conn->query($sql_insert)) {
        echo json_encode(["status" => "success", "message" => "Contacto agregado"]);
    } else {
         http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al agregar contacto: " . $conn->error]);
    }
}
?>
