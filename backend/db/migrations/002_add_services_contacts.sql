CREATE TABLE IF NOT EXISTS Servicios (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'luz', 'agua', 'telefonia', 'internet', 'otros'
    empresa VARCHAR(100) NOT NULL,
    icono VARCHAR(255) DEFAULT NULL, -- URL o nombre de icono local
    codigo_empresa VARCHAR(50) UNIQUE -- Para identificar en APIs reales
);

CREATE TABLE IF NOT EXISTS Pagos_Servicios (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_servicio INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    referencia VARCHAR(100) NOT NULL, -- Numero de suministro, recibo, etc.
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_servicio) REFERENCES Servicios(id_servicio)
);

CREATE TABLE IF NOT EXISTS Contactos (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_usuario_contacto INT NOT NULL, -- El usuario que es el contacto
    alias VARCHAR(100) DEFAULT NULL, -- Nombre personalizado
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_usuario_contacto) REFERENCES Usuarios(id_usuario),
    UNIQUE KEY unique_contacto (id_usuario, id_usuario_contacto)
);

CREATE TABLE IF NOT EXISTS Notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'info', -- 'info', 'pago', 'promo', 'seguridad'
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
