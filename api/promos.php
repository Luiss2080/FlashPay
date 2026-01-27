<?php
include_once 'config/db.php';

$sql = "SELECT * FROM Promociones WHERE fecha_fin >= CURDATE()";
$result = $conn->query($sql);

$promos = [];
while ($row = $result->fetch_assoc()) {
    $promos[] = $row;
}

echo json_encode(["status" => "success", "data" => $promos]);
?>
