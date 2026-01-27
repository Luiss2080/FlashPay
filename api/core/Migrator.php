<?php
class Migrator {
    private $conn;
    private $migrationsDir;

    public function __construct($dbConnection, $migrationsDir) {
        $this->conn = $dbConnection;
        $this->migrationsDir = $migrationsDir;
        $this->initTable();
    }

    private function initTable() {
        $sql = "CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $this->conn->query($sql);
    }

    public function getAppliedMigrations() {
        $sql = "SELECT migration FROM migrations";
        $result = $this->conn->query($sql);
        $applied = [];
        while ($row = $result->fetch_assoc()) {
            $applied[] = $row['migration'];
        }
        return $applied;
    }

    public function migrate() {
        $applied = $this->getAppliedMigrations();
        $files = scandir($this->migrationsDir);
        $executed = [];

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            if (!in_array($file, $applied)) {
                $path = $this->migrationsDir . '/' . $file;
                $sql = file_get_contents($path);
                
                // Ejecutar multi-query (para soportar varias sentencias en un archivo)
                if ($this->conn->multi_query($sql)) {
                    // Consumir todos los resultados para limpiar el buffer
                    while ($this->conn->next_result()) {;} 
                    
                    // Registrar migración
                    $stmt = $this->conn->prepare("INSERT INTO migrations (migration) VALUES (?)");
                    $stmt->bind_param("s", $file);
                    $stmt->execute();
                    $stmt->close();
                    
                    $executed[] = $file;
                } else {
                    throw new Exception("Error aplicando migración $file: " . $this->conn->error);
                }
            }
        }
        return $executed;
    }
}
?>
