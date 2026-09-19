-- Alinea Transacciones con lo que usan los controladores:
--   * columna `descripcion`
--   * valores 'servicio' e 'ingreso' en el ENUM `tipo`
-- Idempotente: seguro para bases nuevas (001 ya lo incluye) y para bases creadas con la 001 antigua.

SET @has_desc := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Transacciones' AND COLUMN_NAME = 'descripcion');
SET @sql := IF(@has_desc = 0,
  'ALTER TABLE Transacciones ADD COLUMN descripcion VARCHAR(255) DEFAULT NULL AFTER tipo',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE Transacciones
  MODIFY COLUMN tipo ENUM('transferencia', 'pago', 'recarga', 'servicio', 'ingreso') NOT NULL;
