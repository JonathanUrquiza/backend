const express = require("express");
const router = express.Router();
const { 
    fiscales, instituciones, zonas,
    fiscalUp, institucionUp, zonaUp,
    fiscalInstitucionUp, fiscalZonaUp, institucionZonaUp, zonaInstitucionUp
} = require("../controller/fiscalizacionController");

// Rutas para fiscalización
router.get("/", fiscales);
router.post("/fiscales", fiscalUp);//crea un nuevo fiscal
router.get("/instituciones", instituciones);//consulta las instituciones
router.post("/instituciones", institucionUp);//crea una nueva institución
router.get("/zonas", zonas);//consulta las zonas
router.post("/zonas", zonaUp);//crea una nueva zona
router.post("/fiscales/instituciones", fiscalInstitucionUp);//asigna una institución a un fiscal
router.post("/fiscales/zonas", fiscalZonaUp);//asigna una zona a un fiscal
router.post("/instituciones/zonas", institucionZonaUp);//asigna una zona a una institución
router.post("/zonas/instituciones", zonaInstitucionUp);//asigna una institución a una zona


module.exports = router;