-- Transacciones entre Luis Admin (1) y Juan Perez (2)
INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo, fecha) VALUES 
(1, 2, 50.00, 'transferencia', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, 15.50, 'pago', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 2, 100.00, 'recarga', NOW());
