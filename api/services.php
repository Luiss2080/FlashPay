<?php
include_once 'config/db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List all services
    $sql = "SELECT * FROM Servicios";
    $result = $conn->query($sql);
    
    $services = [];
    while($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
    
    echo json_encode(["status" => "success", "services" => $services]);

} elseif ($method === 'POST') {
    // Pay service
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->user_id) || empty($data->service_id) || empty($data->amount) || empty($data->reference)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
        exit;
    }

    $user_id = $data->user_id;
    $service_id = $data->service_id;
    $amount = $data->amount;
    $reference = $conn->real_escape_string($data->reference);

    // Check balance
    $sql_balance = "SELECT saldo FROM Usuarios WHERE id_usuario = $user_id";
    $result_balance = $conn->query($sql_balance);
    if ($result_balance->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
        exit;
    }
    $user = $result_balance->fetch_assoc();
    
    if ($user['saldo'] < $amount) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Saldo insuficiente"]);
        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Deduct balance
        $conn->query("UPDATE Usuarios SET saldo = saldo - $amount WHERE id_usuario = $user_id");

        // Record payment
        $stmt = $conn->prepare("INSERT INTO Pagos_Servicios (id_usuario, id_servicio, monto, referencia) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iids", $user_id, $service_id, $amount, $reference);
        $stmt->execute();
        
        // Record as transaction (Generic)
        // Check if there is a generic system user for services or just log it?
        // For now, we just log the deduction in Transacciones if needed, but Pagos_Servicios is specific enough.
        // However, to show in history, we might want to add to Transacciones too, or query both.
        // Let's add to Transacciones with a special flag or receptor 0?
        // Ideally Transacciones needs to support Service Payments. 
        // The enum is 'pago', 'transferencia', 'recarga'.
        // We can use 'pago' and maybe set receptor to NULL or a system ID?
        // The schema says id_receptor INT NOT NULL. So we need a placeholder.
        // Let's assume id 1 needs to exist or valid ID.
        // Ideally we should have updated Transacciones schema to allow NULL receptor.
        // For this task, I'll skip inserting into Transacciones for now to avoid FK error, 
        // OR I'll assume ID 1 is the 'admin/system' account.
        
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Pago realizado con éxito"]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al procesar el pago"]);
    }
}
?>
