const express = require("express");
const router = express.Router();
const { index, contacto } = require("../controller/indexController");
const { requireAuth, optionalAuth } = require("../controller/authController");

// Ruta principal: registro para no autenticados, dashboard para autenticados
router.get("/", optionalAuth, index);
// Contacto sigue requiriendo autenticación
router.get("/contacto", requireAuth, contacto);

module.exports = router;