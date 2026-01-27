INSERT INTO Servicios (nombre, categoria, empresa, codigo_empresa) VALUES
('Luz del Sur', 'luz', 'Luz del Sur S.A.A.', 'LDS001'),
('Enel', 'luz', 'Enel Distribución Perú', 'ENEL001'),
('Sedapal', 'agua', 'Sedapal', 'SED001'),
('Movistar', 'telefonia', 'Telefonica del Peru', 'MOV001'),
('Claro', 'telefonia', 'Claro Peru', 'CLA001'),
('Entel', 'telefonia', 'Entel Peru', 'ENT001'),
('Bitel', 'telefonia', 'Bitel', 'BIT001'),
('Win', 'internet', 'Win', 'WIN001'),
('Nubyx', 'internet', 'Nubyx', 'NUB001');

-- Mock Notifications for User 1
INSERT INTO Notificaciones (id_usuario, titulo, mensaje, tipo) VALUES
(1, '¡Bienvenido a FlashPay!', 'Gracias por unirte a la billetera digital más rápida.', 'info'),
(1, 'Promo de Bienvenida', 'Tienes un descuento del 50% en tu primera recarga.', 'promo'),
(1, 'Seguridad', 'Recuerda no compartir tu contraseña con nadie.', 'seguridad');
