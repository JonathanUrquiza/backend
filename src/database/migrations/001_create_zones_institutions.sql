-- ================================================
-- CREACIÓN DE TABLAS PARA GESTIÓN TERRITORIAL
-- Sistema Monolito de Fiscalización - SQLite Version
-- ================================================

-- Crear tabla de ZONAS
CREATE TABLE IF NOT EXISTS zonas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_zona INTEGER NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    activa INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_numero_zona ON zonas (numero_zona);
CREATE INDEX IF NOT EXISTS idx_activa ON zonas (activa);

-- Crear tabla de INSTITUCIONES
CREATE TABLE IF NOT EXISTS instituciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT DEFAULT 'escuela' CHECK (tipo IN ('escuela', 'colegio', 'universidad', 'centro_votacion', 'oficina_publica', 'otro')),
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    responsable TEXT,
    activa INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tipo ON instituciones (tipo);
CREATE INDEX IF NOT EXISTS idx_activa_inst ON instituciones (activa);
CREATE INDEX IF NOT EXISTS idx_nombre ON instituciones (nombre);

-- Crear tabla de FISCALES (básica)
CREATE TABLE IF NOT EXISTS fiscales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    documento TEXT UNIQUE,
    telefono TEXT,
    email TEXT UNIQUE,
    activo INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documento ON fiscales (documento);
CREATE INDEX IF NOT EXISTS idx_email ON fiscales (email);
CREATE INDEX IF NOT EXISTS idx_activo ON fiscales (activo);
CREATE INDEX IF NOT EXISTS idx_nombre_apellido ON fiscales (nombre, apellido);

-- Crear tabla de RELACIÓN ZONA-INSTITUCIÓN
CREATE TABLE IF NOT EXISTS zona_instituciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zona_id INTEGER NOT NULL,
    institucion_id INTEGER NOT NULL,
    activa INTEGER DEFAULT 1,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE CASCADE,
    FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
    
    UNIQUE(zona_id, institucion_id)
);

CREATE INDEX IF NOT EXISTS idx_zona ON zona_instituciones (zona_id);
CREATE INDEX IF NOT EXISTS idx_institucion ON zona_instituciones (institucion_id);
CREATE INDEX IF NOT EXISTS idx_activa_zi ON zona_instituciones (activa);

-- Crear tabla de RELACIÓN FISCAL-ZONA
CREATE TABLE IF NOT EXISTS fiscal_zonas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fiscal_id INTEGER NOT NULL,
    zona_id INTEGER NOT NULL,
    es_responsable_principal INTEGER DEFAULT 0,
    activa INTEGER DEFAULT 1,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (fiscal_id) REFERENCES fiscales(id) ON DELETE CASCADE,
    FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE CASCADE,
    
    UNIQUE(fiscal_id, zona_id)
);

CREATE INDEX IF NOT EXISTS idx_fiscal ON fiscal_zonas (fiscal_id);
CREATE INDEX IF NOT EXISTS idx_zona_fz ON fiscal_zonas (zona_id);
CREATE INDEX IF NOT EXISTS idx_responsable ON fiscal_zonas (es_responsable_principal);
CREATE INDEX IF NOT EXISTS idx_activa_fz ON fiscal_zonas (activa);

-- Crear tabla de LOGS DE ACTIVIDAD
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tabla_afectada TEXT NOT NULL,
    registro_id INTEGER NOT NULL,
    accion TEXT NOT NULL CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE')),
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    usuario TEXT,
    ip_address TEXT,
    user_agent TEXT,
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tabla ON activity_logs (tabla_afectada);
CREATE INDEX IF NOT EXISTS idx_registro ON activity_logs (registro_id);
CREATE INDEX IF NOT EXISTS idx_accion ON activity_logs (accion);
CREATE INDEX IF NOT EXISTS idx_fecha ON activity_logs (fecha_accion);
CREATE INDEX IF NOT EXISTS idx_usuario ON activity_logs (usuario);
