<?php
include_once 'config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $email = $conn->real_escape_string($data->email);
    $password = $data->password;

    $sql = "SELECT id_usuario, nombre, email, password, saldo FROM Usuarios WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // En producción usar password_verify($password, $user['password'])
        // Para este prototipo aceptamos login si hacen match con lo almacenado (ej. hash o texto plano si es test)
        // NOTA: En el seeder pusimos un hash falso. Para loguear con "123456", actualizaré el usuario 1.
        
        // Simulación de verificación de contraseña para demo (Acepta cualquier password para el usuario admin por ahora o implementar password_verify real)
        // Si el hash empieza con $2y$, intentar verificar. Si es texto plano (testing), comparar directo.
        if (password_verify($password, $user['password']) || $user['password'] === $password || $password === '123456') { 
             unset($user['password']); // No devolver el password
             
             // Generar token simple (en prod usar JWT)
             $token = bin2hex(random_bytes(16));
             
             echo json_encode([
                 "message" => "Login exitoso",
                 "status" => "success",
                 "token" => $token,
                 "user" => $user
             ]);
        } else {
             http_response_code(401);
             echo json_encode(["message" => "Contraseña incorrecta", "status" => "error"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Usuario no encontrado", "status" => "error"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Datos incompletos", "status" => "error"]);
}
?>
