-- ================================================
-- DATOS INICIALES - ZONAS DEL SISTEMA
-- Sistema Monolito de Fiscalización - MySQL Version
-- ================================================

-- Insertar las 15 zonas del sistema
INSERT IGNORE INTO zonas (numero_zona, nombre, descripcion) VALUES
(1, 'Zona 1', 'Primera zona electoral del distrito'),
(2, 'Zona 2', 'Segunda zona electoral del distrito'),
(3, 'Zona 3', 'Tercera zona electoral del distrito'),
(4, 'Zona 4', 'Cuarta zona electoral del distrito'),
(5, 'Zona 5', 'Quinta zona electoral del distrito'),
(6, 'Zona 6', 'Sexta zona electoral del distrito'),
(7, 'Zona 7', 'Séptima zona electoral del distrito'),
(8, 'Zona 8', 'Octava zona electoral del distrito'),
(9, 'Zona 9', 'Novena zona electoral del distrito'),
(10, 'Zona 10', 'Décima zona electoral del distrito'),
(11, 'Zona 11', 'Undécima zona electoral del distrito'),
(12, 'Zona 12', 'Duodécima zona electoral del distrito'),
(13, 'Zona 13', 'Decimotercera zona electoral del distrito'),
(14, 'Zona 14', 'Decimocuarta zona electoral del distrito'),
(15, 'Zona 15', 'Decimoquinta zona electoral del distrito');

-- Insertar algunas instituciones de ejemplo
INSERT IGNORE INTO instituciones (nombre, tipo, direccion, responsable) VALUES
('Escuela Primaria N° 1', 'escuela', 'Av. Principal 123', 'Director Juan Pérez'),
('Instituto Secundario Central', 'colegio', 'Calle Secundaria 456', 'Directora María González'),
('Centro de Votación Municipal', 'centro_votacion', 'Plaza Central s/n', 'Coordinador Luis Rodríguez'),
('Escuela Técnica N° 2', 'escuela', 'Barrio Norte 789', 'Director Carlos Martínez'),
('Universidad Regional', 'universidad', 'Campus Universitario 101', 'Rector Ana López');

-- Asignar algunas instituciones a zonas (ejemplos)
INSERT IGNORE INTO zona_instituciones (zona_id, institucion_id) VALUES
(1, 1), -- Escuela Primaria N° 1 en Zona 1
(1, 3), -- Centro de Votación en Zona 1  
(2, 2), -- Instituto Secundario en Zona 2
(3, 4), -- Escuela Técnica en Zona 3
(5, 5); -- Universidad en Zona 5
