-- Create Metas table
CREATE TABLE IF NOT EXISTS Metas (
    id_meta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    monto_objetivo DECIMAL(10, 2) NOT NULL,
    monto_actual DECIMAL(10, 2) DEFAULT 0.00,
    icono VARCHAR(50) DEFAULT 'piggy-bank',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Seed some initial data for testing (optional, but good for demo)
-- Assuming user 1 exists
INSERT INTO Metas (id_usuario, titulo, monto_objetivo, monto_actual, icono) VALUES 
(1, 'Viaje a Cusco', 1500.00, 350.00, 'airplane'),
(1, 'Nueva Laptop', 3000.00, 1200.00, 'laptop');
