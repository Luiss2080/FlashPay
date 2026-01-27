<?php
class Seeder {
    private $conn;
    private $seedersDir;

    public function __construct($dbConnection, $seedersDir) {
        $this->conn = $dbConnection;
        $this->seedersDir = $seedersDir;
    }

    public function seed() {
        $files = scandir($this->seedersDir);
        $executed = [];

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $path = $this->seedersDir . '/' . $file;
            
            if (pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                $sql = file_get_contents($path);
                if ($this->conn->multi_query($sql)) {
                    while ($this->conn->next_result()) {;}
                    $executed[] = $file;
                } else {
                    throw new Exception("Error en seeder $file: " . $this->conn->error);
                }
            } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                include $path; // El archivo PHP debe usar la variable $conn disponible
                $executed[] = $file;
            }
        }
        return $executed;
    }
}
?>
