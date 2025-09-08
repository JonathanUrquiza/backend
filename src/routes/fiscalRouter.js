const express = require('express');
const router = express.Router();
const { 
    showFiscalDashboard,
    showInstitutionInfo,
    registerAttendance,
    showAttendanceForm,
    showPhotoGallery,
    requireFiscalAuth
} = require('../controller/fiscalRegularController');

// Rutas protegidas para fiscales regulares
router.get('/dashboard', requireFiscalAuth, showFiscalDashboard);
router.get('/institucion', requireFiscalAuth, showInstitutionInfo);
router.get('/presente', requireFiscalAuth, showAttendanceForm);
router.post('/presente', requireFiscalAuth, registerAttendance);
router.get('/galeria', requireFiscalAuth, showPhotoGallery);

module.exports = router;
