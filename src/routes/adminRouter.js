const express = require('express');
const router = express.Router();
const { 
    showAdminLogin, 
    processAdminLogin, 
    showAdminDashboard,
    adminLogout,
    requireAdminAuth,
    requireAdminRole,
    showCreateFiscal,
    showCreateFiscalGeneral,
    showCreateFiscalZona,
    processCreateFiscal,
    showExcelUpload,
    processExcelUpload,
    handleExcelUpload
} = require('../controller/adminController');

const {
    showFiscalManagement,
    assignRole,
    changeInstitution,
    changePassword,
    deleteFiscal,
    getFiscalDetails
} = require('../controller/adminFiscalController');

// Rutas públicas (sin autenticación)
router.get('/login', showAdminLogin);
router.post('/login', processAdminLogin);

// Rutas protegidas (requieren autenticación de administrador)
router.get('/dashboard', requireAdminAuth, showAdminDashboard);
router.get('/logout', requireAdminAuth, adminLogout);
router.post('/logout', requireAdminAuth, adminLogout);

// Rutas para gestión de fiscales
router.get('/fiscales', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), showFiscalManagement);
router.post('/fiscales/assign-role', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), assignRole);
router.post('/fiscales/change-institution', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), changeInstitution);
router.post('/fiscales/change-password', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), changePassword);
router.delete('/fiscales/delete', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), deleteFiscal);
router.get('/fiscales/:id', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), getFiscalDetails);

// Rutas para crear nuevos fiscales
router.get('/create-fiscal', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), showCreateFiscal);
router.get('/create-fiscal-general', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), showCreateFiscalGeneral);
router.get('/create-fiscal-zona', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), showCreateFiscalZona);
router.post('/create-fiscal', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), processCreateFiscal);

// Rutas para carga de archivos Excel
router.get('/excel-upload', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), showExcelUpload);
router.post('/excel-upload', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), handleExcelUpload, processExcelUpload);

router.get('/reportes', requireAdminAuth, requireAdminRole(['super_admin', 'admin']), (req, res) => {
    res.render('admin/reportes', {
        view: {
            title: "Reportes - Admin",
            description: "Reportes y estadísticas del sistema", 
            keywords: "admin, reportes, estadísticas",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        }
    });
});

router.get('/configuracion', requireAdminAuth, requireAdminRole(['super_admin']), (req, res) => {
    res.render('admin/configuracion', {
        view: {
            title: "Configuración del Sistema - Admin",
            description: "Configuración avanzada del sistema",
            keywords: "admin, configuración, sistema",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        }
    });
});

module.exports = router;
