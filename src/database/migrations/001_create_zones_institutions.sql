-- ================================================
-- CREACIÓN DE TABLAS PARA GESTIÓN TERRITORIAL
-- Sistema Monolito de Fiscalización - MySQL Version
-- ================================================

-- Crear tabla de ZONAS
CREATE TABLE IF NOT EXISTS zonas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_zona INT NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activa TINYINT(1) DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_numero_zona (numero_zona),
    INDEX idx_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de INSTITUCIONES
CREATE TABLE IF NOT EXISTS instituciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('escuela', 'colegio', 'universidad', 'centro_votacion', 'oficina_publica', 'otro') DEFAULT 'escuela',
    direccion TEXT,
    telefono VARCHAR(50),
    email VARCHAR(255),
    responsable VARCHAR(255),
    activa TINYINT(1) DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_activa_inst (activa),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de FISCALES (básica)
CREATE TABLE IF NOT EXISTS fiscales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    documento VARCHAR(50) UNIQUE,
    telefono VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_documento (documento),
    INDEX idx_email (email),
    INDEX idx_activo (activo),
    INDEX idx_nombre_apellido (nombre, apellido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de RELACIÓN ZONA-INSTITUCIÓN
CREATE TABLE IF NOT EXISTS zona_instituciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zona_id INT NOT NULL,
    institucion_id INT NOT NULL,
    activa TINYINT(1) DEFAULT 1,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE CASCADE,
    FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_zona_institucion (zona_id, institucion_id),
    INDEX idx_zona (zona_id),
    INDEX idx_institucion (institucion_id),
    INDEX idx_activa_zi (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de RELACIÓN FISCAL-ZONA
CREATE TABLE IF NOT EXISTS fiscal_zonas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fiscal_id INT NOT NULL,
    zona_id INT NOT NULL,
    es_responsable_principal TINYINT(1) DEFAULT 0,
    activa TINYINT(1) DEFAULT 1,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fiscal_id) REFERENCES fiscales(id) ON DELETE CASCADE,
    FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_fiscal_zona (fiscal_id, zona_id),
    INDEX idx_fiscal (fiscal_id),
    INDEX idx_zona_fz (zona_id),
    INDEX idx_responsable (es_responsable_principal),
    INDEX idx_activa_fz (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de LOGS DE ACTIVIDAD
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id INT NOT NULL,
    accion ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    usuario VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tabla (tabla_afectada),
    INDEX idx_registro (registro_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (fecha_accion),
    INDEX idx_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
