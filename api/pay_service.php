<?php
include_once 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id_usuario) && !empty($data->servicio) && !empty($data->codigo) && !empty($data->monto)) {
    $id_usuario = intval($data->id_usuario);
    $monto = floatval($data->monto);

    $conn->begin_transaction();

    try {
        // Verificar saldo
        $stmt = $conn->prepare("SELECT saldo FROM Usuarios WHERE id_usuario = ? FOR UPDATE");
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $res = $stmt->get_result();
        $user = $res->fetch_assoc();

        if ($user['saldo'] < $monto) {
            throw new Exception("Saldo insuficiente");
        }

        // Descontar saldo
        $stmt = $conn->prepare("UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?");
        $stmt->bind_param("di", $monto, $id_usuario);
        $stmt->execute();

        // Registrar Transacción (Emisor=Usuario, Receptor=1 (Admin/Sistema) para simplificar)
        $tipo = 'pago'; 
        // Receptor 1 es Admin por defecto en nuestros seeders
        $stmt = $conn->prepare("INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo) VALUES (?, 1, ?, ?)");
        $stmt->bind_param("ids", $id_usuario, $monto, $tipo);
        $stmt->execute();

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Pago de servicio realizado"]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
