CREATE TABLE IF NOT EXISTS Promociones (
    id_promo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    descuento VARCHAR(50),
    fecha_fin DATE
);

INSERT INTO Promociones (titulo, descripcion, imagen_url, descuento, fecha_fin) VALUES 
('Pizza Hut 2x1', 'Disfruta de 2 pizzas medianas por el precio de una pagando con FlashPay.', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Pizza_Hut_logo.svg/1200px-Pizza_Hut_logo.svg.png', '2x1', DATE_ADD(NOW(), INTERVAL 30 DAY)),
('Cineplanet 50% DCTO', 'Entradas a mitad de precio de lunes a jueves.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Cineplanet_Logo.png/800px-Cineplanet_Logo.png', '50%', DATE_ADD(NOW(), INTERVAL 15 DAY)),
('Starbucks Gratis', 'Un Frappuccino gratis por recargas mayores a S/ 20.', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png', 'Gratis', DATE_ADD(NOW(), INTERVAL 7 DAY));
