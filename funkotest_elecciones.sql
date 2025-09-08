-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-funkotest.alwaysdata.net
-- Generation Time: Sep 04, 2025 at 06:02 AM
-- Server version: 10.11.13-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `funkotest_elecciones`
--

-- --------------------------------------------------------

--
-- Table structure for table `actas`
--

CREATE TABLE `actas` (
  `id` int(11) NOT NULL,
  `mesa_id` int(11) NOT NULL,
  `acta_url` varchar(255) NOT NULL,
  `fecha_carga` timestamp NOT NULL DEFAULT current_timestamp(),
  `cargada_por_votante_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actas`
--

INSERT INTO `actas` (`id`, `mesa_id`, `acta_url`, `fecha_carga`, `cargada_por_votante_id`) VALUES
(1, 1, 'actas/mesa1.png', '2025-08-09 09:09:18', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `provincia_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ciudades`
--

INSERT INTO `ciudades` (`id`, `provincia_id`, `nombre`) VALUES
(1, 1, 'CABA');

-- --------------------------------------------------------

--
-- Table structure for table `comunas`
--

CREATE TABLE `comunas` (
  `id` int(11) NOT NULL,
  `ciudad_id` int(11) NOT NULL,
  `nombre_numerico` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comunas`
--

INSERT INTO `comunas` (`id`, `ciudad_id`, `nombre_numerico`) VALUES
(1, 1, 15);

-- --------------------------------------------------------

--
-- Table structure for table `fiscales_generales`
--

CREATE TABLE `fiscales_generales` (
  `id` int(11) NOT NULL,
  `habitante_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_ultimo_acceso` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fiscales_generales`
--

INSERT INTO `fiscales_generales` (`id`, `habitante_id`, `email`, `password`, `activo`, `fecha_creacion`, `fecha_ultimo_acceso`) VALUES
(1, 12, 'pedro.martinez@test.com', '123456', 1, '2025-08-16 04:39:24', NULL),
(2, 13, 'jurquiza86@hotmail.com', '123123123', 1, '2025-08-16 04:52:36', NULL),
(3, 14, 'j_j_rock_86@hotmail.com', '320963', 1, '2025-08-17 02:23:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `habitantes`
--

CREATE TABLE `habitantes` (
  `id` int(11) NOT NULL,
  `comuna_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ;

--
-- Dumping data for table `habitantes`
--

INSERT INTO `habitantes` (`id`, `comuna_id`, `nombre`, `apellido`, `dni`, `edad`, `direccion`, `telefono`) VALUES
(1, 1, 'Juan', 'Perez', '12345678', 30, 'Direccion 123', '11111111'),
(2, 1, 'Ariane', 'Bechtelar', '48445172', 25, '329 Obie Freeway', '1-681-961-0478 x0403'),
(3, 1, 'Sim', 'Carter', '49917167', 20, '176 Collier Bridge', '665.801.0687'),
(4, 1, 'Jerald', 'Botsford', '32307800', 90, '75902 Macejkovic Overpass', '717.541.5199 x0117'),
(5, 1, 'Joelle', 'Schmeler', '26089994', 58, '4236 Witting Point', '654-471-3170 x79570'),
(6, 1, 'Oswaldo', 'Spinka', '45519689', 79, '67465 Beatty Walks', '367.336.2603'),
(7, 1, 'Kip', 'Moore', '27173213', 86, '38476 River Road', '891.606.6534 x5482'),
(8, 1, 'Norval', 'Mayert', '40958232', 84, '240 Pedro Isle', '870-669-6703 x5001'),
(9, 1, 'Howell', 'Cartwright', '50741829', 71, '38067 S Railroad Street', '(690) 533-0433 x0375'),
(10, 1, 'Elody', 'Deckow', '10428578', 80, '917 N Cedar Street', '491-474-8416 x10411'),
(11, 1, 'Eleazar', 'Collins', '38017883', 43, '83699 Treutel Mountains', '881-520-3682 x153'),
(12, 1, 'Pedro Luis', 'Martinez', '66778899', NULL, '', ''),
(13, 1, 'Jonathan', 'urquiza', '123123123', NULL, '', ''),
(14, 1, 'Jonathan Javier', 'urquiza', '32524709', NULL, '', '');

--
-- Triggers `habitantes`
--
DELIMITER $$
CREATE TRIGGER `trg_habitantes_bi` BEFORE INSERT ON `habitantes` FOR EACH ROW BEGIN
  SET NEW.dni = UPPER(REPLACE(TRIM(NEW.dni), ' ', ''));
  IF NEW.edad IS NOT NULL AND NEW.edad < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'edad debe ser >= 0';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_habitantes_bu` BEFORE UPDATE ON `habitantes` FOR EACH ROW BEGIN
  SET NEW.dni = UPPER(REPLACE(TRIM(NEW.dni), ' ', ''));
  IF NEW.edad IS NOT NULL AND NEW.edad < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'edad debe ser >= 0';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `institutos`
--

CREATE TABLE `institutos` (
  `id` int(11) NOT NULL,
  `comuna_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `institutos`
--

INSERT INTO `institutos` (`id`, `comuna_id`, `nombre`, `direccion`) VALUES
(1, 1, 'Instituto Central', 'Direccion 123'),
(2, 1, 'Inst Dakota Ways 60', '40050 E Franklin Street'),
(3, 1, 'Inst Zane Falls 4', '9045 Jalon Valleys'),
(4, 1, 'Inst General Overpass 14', '915 Paucek Shoal'),
(5, 1, 'Inst Ankunding Union 33', '5714 Lionel Lodge'),
(6, 1, 'Instituto Prueba', 'Calle 123');

-- --------------------------------------------------------

--
-- Table structure for table `mesas`
--

CREATE TABLE `mesas` (
  `id` int(11) NOT NULL,
  `instituto_id` int(11) NOT NULL,
  `numero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mesas`
--

INSERT INTO `mesas` (`id`, `instituto_id`, `numero`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 2, 2),
(4, 3, 1),
(5, 3, 2),
(6, 4, 1),
(7, 4, 2),
(8, 5, 1),
(9, 5, 2);

--
-- Triggers `mesas`
--
DELIMITER $$
CREATE TRIGGER `trg_mesas_bi` BEFORE INSERT ON `mesas` FOR EACH ROW BEGIN
  IF NEW.numero IS NULL OR NEW.numero <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'numero de mesa debe ser > 0';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_mesas_bu` BEFORE UPDATE ON `mesas` FOR EACH ROW BEGIN
  IF NEW.numero IS NULL OR NEW.numero <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'numero de mesa debe ser > 0';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `paises`
--

CREATE TABLE `paises` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `bandera` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paises`
--

INSERT INTO `paises` (`id`, `nombre`, `bandera`) VALUES
(1, 'Argentina', 'bandera_argentina.png');

-- --------------------------------------------------------

--
-- Table structure for table `provincias`
--

CREATE TABLE `provincias` (
  `id` int(11) NOT NULL,
  `pais_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provincias`
--

INSERT INTO `provincias` (`id`, `pais_id`, `nombre`) VALUES
(1, 1, 'Buenos Aires');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('GENERAL','MESA','TERRITORIO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `tipo`) VALUES
(1, 'fiscal_mesa', 'MESA'),
(2, 'fiscal_general', 'GENERAL'),
(3, 'fiscal_territorio', 'TERRITORIO'),
(4, 'representante_territorio', 'TERRITORIO');

-- --------------------------------------------------------

--
-- Table structure for table `super_admins`
--

CREATE TABLE `super_admins` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `territorios`
--

CREATE TABLE `territorios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `pais_id` int(11) DEFAULT NULL,
  `provincia_id` int(11) DEFAULT NULL,
  `ciudad_id` int(11) DEFAULT NULL,
  `comuna_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `votantes`
--

CREATE TABLE `votantes` (
  `habitante_id` int(11) NOT NULL,
  `mesa_id` int(11) NOT NULL,
  `orden` int(11) NOT NULL,
  `ya_ha_votado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votantes`
--

INSERT INTO `votantes` (`habitante_id`, `mesa_id`, `orden`, `ya_ha_votado`) VALUES
(1, 1, 1, 0),
(2, 2, 1, 0),
(3, 2, 2, 0),
(4, 2, 3, 0),
(5, 2, 4, 0),
(6, 2, 5, 0),
(7, 6, 1, 0),
(8, 6, 2, 0),
(9, 6, 3, 0),
(10, 6, 4, 0),
(11, 6, 5, 0);

--
-- Triggers `votantes`
--
DELIMITER $$
CREATE TRIGGER `trg_votantes_bi` BEFORE INSERT ON `votantes` FOR EACH ROW BEGIN
  DECLARE v_comuna_mesa INT;
  DECLARE v_comuna_votante INT;

  IF NEW.orden IS NULL OR NEW.orden <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'orden debe ser > 0';
  END IF;

  SELECT i.comuna_id INTO v_comuna_mesa
  FROM mesas m
  JOIN institutos i ON i.id = m.instituto_id
  WHERE m.id = NEW.mesa_id;

  SELECT h.comuna_id INTO v_comuna_votante
  FROM habitantes h
  WHERE h.id = NEW.habitante_id;

  IF v_comuna_mesa IS NOT NULL AND v_comuna_votante IS NOT NULL AND v_comuna_mesa <> v_comuna_votante THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El votante debe pertenecer a la misma comuna que la mesa';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_votantes_bu` BEFORE UPDATE ON `votantes` FOR EACH ROW BEGIN
  DECLARE v_comuna_mesa INT;
  DECLARE v_comuna_votante INT;

  IF NEW.orden IS NULL OR NEW.orden <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'orden debe ser > 0';
  END IF;

  IF NEW.ya_ha_votado = FALSE AND OLD.ya_ha_votado = TRUE THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede revertir ya_ha_votado de TRUE a FALSE';
  END IF;

  IF NEW.mesa_id <> OLD.mesa_id OR NEW.habitante_id <> OLD.habitante_id THEN
    SELECT i.comuna_id INTO v_comuna_mesa
    FROM mesas m
    JOIN institutos i ON i.id = m.instituto_id
    WHERE m.id = NEW.mesa_id;

    SELECT h.comuna_id INTO v_comuna_votante
    FROM habitantes h
    WHERE h.id = NEW.habitante_id;

    IF v_comuna_mesa IS NOT NULL AND v_comuna_votante IS NOT NULL AND v_comuna_mesa <> v_comuna_votante THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El votante debe pertenecer a la misma comuna que la mesa';
    END IF;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `votante_roles`
--

CREATE TABLE `votante_roles` (
  `votante_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `mesa_id` int(11) DEFAULT NULL,
  `territorio_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votante_roles`
--

INSERT INTO `votante_roles` (`votante_id`, `role_id`, `mesa_id`, `territorio_id`) VALUES
(1, 1, 1, NULL);

--
-- Triggers `votante_roles`
--
DELIMITER $$
CREATE TRIGGER `trg_votante_roles_bi` BEFORE INSERT ON `votante_roles` FOR EACH ROW BEGIN
  DECLARE v_tipo ENUM('GENERAL','MESA','TERRITORIO');
  SELECT tipo INTO v_tipo FROM roles WHERE id = NEW.role_id;

  IF v_tipo = 'MESA' THEN
    IF NEW.mesa_id IS NULL OR NEW.territorio_id IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol de tipo MESA requiere mesa_id y debe tener territorio_id NULL';
    END IF;
  ELSEIF v_tipo = 'TERRITORIO' THEN
    IF NEW.territorio_id IS NULL OR NEW.mesa_id IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol de tipo TERRITORIO requiere territorio_id y debe tener mesa_id NULL';
    END IF;
  ELSEIF v_tipo = 'GENERAL' THEN
    IF NEW.mesa_id IS NOT NULL OR NEW.territorio_id IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol GENERAL no debe estar asociado a mesa ni territorio';
    END IF;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_votante_roles_bu` BEFORE UPDATE ON `votante_roles` FOR EACH ROW BEGIN
  DECLARE v_tipo ENUM('GENERAL','MESA','TERRITORIO');
  SELECT tipo INTO v_tipo FROM roles WHERE id = NEW.role_id;

  IF v_tipo = 'MESA' THEN
    IF NEW.mesa_id IS NULL OR NEW.territorio_id IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol de tipo MESA requiere mesa_id y debe tener territorio_id NULL';
    END IF;
  ELSEIF v_tipo = 'TERRITORIO' THEN
    IF NEW.territorio_id IS NULL OR NEW.mesa_id IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol de tipo TERRITORIO requiere territorio_id y debe tener mesa_id NULL';
    END IF;
  ELSEIF v_tipo = 'GENERAL' THEN
    IF NEW.mesa_id IS NOT NULL OR NEW.territorio_id IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Rol GENERAL no debe estar asociado a mesa ni territorio';
    END IF;
  END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actas`
--
ALTER TABLE `actas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_actas_mesa` (`mesa_id`),
  ADD KEY `fk_actas_cargador` (`cargada_por_votante_id`),
  ADD KEY `idx_actas_mesa_id` (`mesa_id`);

--
-- Indexes for table `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_ciudades_nombre` (`provincia_id`,`nombre`),
  ADD KEY `idx_ciudades_provincia_id` (`provincia_id`);

--
-- Indexes for table `comunas`
--
ALTER TABLE `comunas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_comunas_nombre` (`ciudad_id`,`nombre_numerico`),
  ADD KEY `idx_comunas_ciudad_id` (`ciudad_id`);

--
-- Indexes for table `fiscales_generales`
--
ALTER TABLE `fiscales_generales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_fiscales_email` (`email`),
  ADD UNIQUE KEY `uq_fiscales_habitante` (`habitante_id`),
  ADD KEY `idx_fiscales_email` (`email`),
  ADD KEY `idx_fiscales_activo` (`activo`);

--
-- Indexes for table `habitantes`
--
ALTER TABLE `habitantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_habitantes_dni` (`dni`),
  ADD KEY `idx_habitantes_comuna_id` (`comuna_id`),
  ADD KEY `idx_habitantes_apellido_nombre` (`apellido`,`nombre`);

--
-- Indexes for table `institutos`
--
ALTER TABLE `institutos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_institutos_nombre` (`comuna_id`,`nombre`),
  ADD KEY `idx_institutos_comuna_id` (`comuna_id`);

--
-- Indexes for table `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_mesas_numero` (`instituto_id`,`numero`),
  ADD KEY `idx_mesas_instituto_id` (`instituto_id`);

--
-- Indexes for table `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_paises_nombre` (`nombre`);

--
-- Indexes for table `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_provincias_nombre` (`pais_id`,`nombre`),
  ADD KEY `idx_provincias_pais_id` (`pais_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_roles_nombre` (`nombre`);

--
-- Indexes for table `super_admins`
--
ALTER TABLE `super_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_super_admins_username` (`username`);

--
-- Indexes for table `territorios`
--
ALTER TABLE `territorios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_territorios_pais` (`pais_id`),
  ADD KEY `fk_territorios_prov` (`provincia_id`),
  ADD KEY `fk_territorios_ciudad` (`ciudad_id`),
  ADD KEY `fk_territorios_comuna` (`comuna_id`);

--
-- Indexes for table `votantes`
--
ALTER TABLE `votantes`
  ADD PRIMARY KEY (`habitante_id`),
  ADD UNIQUE KEY `uq_votantes_mesa_orden` (`mesa_id`,`orden`),
  ADD KEY `idx_votantes_mesa_id` (`mesa_id`);

--
-- Indexes for table `votante_roles`
--
ALTER TABLE `votante_roles`
  ADD PRIMARY KEY (`votante_id`,`role_id`),
  ADD KEY `fk_vr_role` (`role_id`),
  ADD KEY `idx_vr_mesa_id` (`mesa_id`),
  ADD KEY `idx_vr_territorio_id` (`territorio_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actas`
--
ALTER TABLE `actas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `comunas`
--
ALTER TABLE `comunas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `fiscales_generales`
--
ALTER TABLE `fiscales_generales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `habitantes`
--
ALTER TABLE `habitantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `institutos`
--
ALTER TABLE `institutos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mesas`
--
ALTER TABLE `mesas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `paises`
--
ALTER TABLE `paises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `territorios`
--
ALTER TABLE `territorios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `actas`
--
ALTER TABLE `actas`
  ADD CONSTRAINT `fk_actas_cargador` FOREIGN KEY (`cargada_por_votante_id`) REFERENCES `votantes` (`habitante_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actas_mesa` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `fk_ciudades_prov` FOREIGN KEY (`provincia_id`) REFERENCES `provincias` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `comunas`
--
ALTER TABLE `comunas`
  ADD CONSTRAINT `fk_comunas_ciudad` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `fiscales_generales`
--
ALTER TABLE `fiscales_generales`
  ADD CONSTRAINT `fk_fiscales_habitante` FOREIGN KEY (`habitante_id`) REFERENCES `habitantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `habitantes`
--
ALTER TABLE `habitantes`
  ADD CONSTRAINT `fk_habitantes_comuna` FOREIGN KEY (`comuna_id`) REFERENCES `comunas` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `institutos`
--
ALTER TABLE `institutos`
  ADD CONSTRAINT `fk_institutos_comuna` FOREIGN KEY (`comuna_id`) REFERENCES `comunas` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `mesas`
--
ALTER TABLE `mesas`
  ADD CONSTRAINT `fk_mesas_instituto` FOREIGN KEY (`instituto_id`) REFERENCES `institutos` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `provincias`
--
ALTER TABLE `provincias`
  ADD CONSTRAINT `fk_provincias_pais` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `territorios`
--
ALTER TABLE `territorios`
  ADD CONSTRAINT `fk_territorios_ciudad` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_territorios_comuna` FOREIGN KEY (`comuna_id`) REFERENCES `comunas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_territorios_pais` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_territorios_prov` FOREIGN KEY (`provincia_id`) REFERENCES `provincias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `votantes`
--
ALTER TABLE `votantes`
  ADD CONSTRAINT `fk_votantes_habitante` FOREIGN KEY (`habitante_id`) REFERENCES `habitantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_votantes_mesa` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `votante_roles`
--
ALTER TABLE `votante_roles`
  ADD CONSTRAINT `fk_vr_mesa` FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vr_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vr_territorio` FOREIGN KEY (`territorio_id`) REFERENCES `territorios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vr_votante` FOREIGN KEY (`votante_id`) REFERENCES `votantes` (`habitante_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
