<?php
$host = "localhost";
$username = "root";
$password = "";
$db_name = "FlashPay";

echo "--- INICIANDO CONFIGURACIÓN DE FLASHPAY BACKEND ---\n";

// 1. Conexión al servidor MySQL (sin DB)
$conn = new mysqli($host, $username, $password);
if ($conn->connect_error) {
    die("❌ Error conectando a MySQL: " . $conn->connect_error . "\n");
}

// 2. Crear Base de Datos si no existe
$sql = "CREATE DATABASE IF NOT EXISTS $db_name";
if ($conn->query($sql) === TRUE) {
    echo "✅ Base de datos '$db_name' verificada.\n";
} else {
    die("❌ Error creando base de datos: " . $conn->error . "\n");
}
$conn->close();

// 3. Conectar a la BD FlashPay
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    die("❌ Error conectando a la BD: " . $conn->connect_error . "\n");
}
$conn->set_charset("utf8mb4");

// 4. Ejecutar Migraciones y Seeders
require_once __DIR__ . '/core/Migrator.php';
require_once __DIR__ . '/core/Seeder.php';

try {
    // Migraciones
    $migrator = new Migrator($conn, __DIR__ . '/migrations');
    $migrations = $migrator->migrate();
    
    if (count($migrations) > 0) {
        echo "✅ Migraciones ejecutadas (" . count($migrations) . "):\n";
        foreach ($migrations as $m) echo "   - $m\n";
    } else {
        echo "✅ Estructura de BD actualizada.\n";
    }

    // Seeders
    $seeder = new Seeder($conn, __DIR__ . '/seeders');
    $seeds = $seeder->seed();
    
    if (count($seeds) > 0) {
        echo "✅ Seeders ejecutados (" . count($seeds) . "):\n";
        foreach ($seeds as $s) echo "   - $s\n";
    } else {
        echo "✅ Datos de prueba verificados.\n";
    }

    echo "\n🚀 BACKEND LISTO PARA USAR.\n";

} catch (Exception $e) {
    echo "\n❌ ERROR DURANTE LA INSTALACIÓN: " . $e->getMessage() . "\n";
}
?>
