<?php
include_once 'config/db.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id_emisor) && !empty($data->telefono) && !empty($data->monto)) {
    $id_emisor = intval($data->id_emisor);
    $telefono = $conn->real_escape_string($data->telefono);
    $monto = floatval($data->monto);

    if ($monto <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "El monto debe ser mayor a 0"]);
        exit;
    }

    // Iniciar Transacción
    $conn->begin_transaction();

    try {
        // 1. Verificar Emisor (Saldo suficiente)
        $stmt = $conn->prepare("SELECT saldo FROM Usuarios WHERE id_usuario = ? FOR UPDATE");
        $stmt->bind_param("i", $id_emisor);
        $stmt->execute();
        $res = $stmt->get_result();
        $emisor = $res->fetch_assoc();

        if (!$emisor) {
            throw new Exception("Emisor no encontrado");
        }
        if ($emisor['saldo'] < $monto) {
            throw new Exception("Saldo insuficiente");
        }

        // 2. Verificar Receptor (Por teléfono)
        $stmt = $conn->prepare("SELECT id_usuario FROM Usuarios WHERE telefono = ?");
        $stmt->bind_param("s", $telefono);
        $stmt->execute();
        $res = $stmt->get_result();
        $receptor = $res->fetch_assoc();

        if (!$receptor) {
            throw new Exception("El número no está registrado en FlashPay");
        }
        
        $id_receptor = $receptor['id_usuario'];

        if ($id_emisor == $id_receptor) {
            throw new Exception("No puedes transferirte a ti mismo");
        }

        // 3. DescontarSaldo Emisor
        $stmt = $conn->prepare("UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?");
        $stmt->bind_param("di", $monto, $id_emisor);
        $stmt->execute();

        // 4. Aumentar Saldo Receptor
        $stmt = $conn->prepare("UPDATE Usuarios SET saldo = saldo + ? WHERE id_usuario = ?");
        $stmt->bind_param("di", $monto, $id_receptor);
        $stmt->execute();

        // 5. Registrar Transacción
        $stmt = $conn->prepare("INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo) VALUES (?, ?, ?, 'transferencia')");
        $stmt->bind_param("iid", $id_emisor, $id_receptor, $monto);
        $stmt->execute();

        $conn->commit();
        
        echo json_encode(["status" => "success", "message" => "Transferencia exitosa"]);

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
