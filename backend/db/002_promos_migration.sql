-- Create Promociones table
CREATE TABLE IF NOT EXISTS Promociones (
    id_promo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    descuento VARCHAR(100),
    imagen_url VARCHAR(500),
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    activo BOOLEAN DEFAULT TRUE
);

-- Seed initial data
INSERT INTO Promociones (titulo, descripcion, descuento, imagen_url) VALUES 
('Descuento en Cine', '2x1 en entradas todos los martes y jueves en cadenas seleccionadas.', '2x1', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60'),
('Comida Rápida', '20% de descuento en combos familiares fin de semana.', '20%', 'https://images.unsplash.com/photo-1561758033-d8f48f8e4f0f?w=500&auto=format&fit=crop&q=60'),
('Tienda de Ropa', 'Envío gratis en compras mayores a S/ 100 en temporada.', 'Envío Gratis', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60'),
('Tecnología', 'Hasta 15% off en accesorios para celular pagando con QR.', '15% OFF', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60');
