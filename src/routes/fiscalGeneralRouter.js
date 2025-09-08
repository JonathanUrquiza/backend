const express = require('express');
const router = express.Router();
const { 
    showFiscalGeneralLogin, 
    processFiscalGeneralLogin, 
    showFiscalGeneralDashboard,
    fiscalGeneralLogout,
    requireFiscalGeneralAuth
} = require('../controller/fiscalGeneralController');

// Importar funciones de gestión de fiscales (reutilizamos las del admin CON TODAS las funciones)
const {
    assignRole,
    changeInstitution,
    changePassword,
    deleteFiscal,
    getFiscalDetails
} = require('../controller/adminFiscalController');

// Función personalizada para mostrar gestión de fiscales para fiscal general
const showFiscalManagementForGeneral = async (req, res) => {
    try {
        // Reutilizar la lógica del admin con datos de fiscal general
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        
        const { Fiscal } = require('../model/index');
        
        const { count, rows: fiscales } = await Fiscal.findAndCountAll({
            order: [['tipo', 'DESC'], ['nombre', 'ASC']],
            limit,
            offset,
            attributes: ['id', 'nombre', 'email', 'cel_num', 'direccion', 'zona', 'institucion', 'tipo']
        });
        
        const totalPages = Math.ceil(count / limit);
        
        // Contar por tipo
        const stats = {
            total: count,
            fiscales: await Fiscal.count({ where: { tipo: 'fiscal' } }),
            fiscalesGenerales: await Fiscal.count({ where: { tipo: 'fiscal_general' } }),
            fiscalesZona: await Fiscal.count({ where: { tipo: 'fiscal_zona' } })
        };
        
        res.render('fiscal-general/fiscales', {
            view: {
                title: "Gestión de Fiscales - Fiscal General",
                description: "Administrar fiscales desde panel de fiscal general",
                keywords: "fiscal general, fiscales, gestión, administración",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscalGeneral: {
                nombre: req.session.fiscalGeneralNombre,
                zona: req.session.fiscalGeneralZona,
                email: req.session.fiscalGeneralEmail,
                institucion: req.session.fiscalGeneralInstitucion
            },
            fiscales,
            stats,
            pagination: {
                currentPage: page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            }
        });
    } catch (error) {
        console.error('Error en gestión de fiscales (fiscal general):', error);
        res.status(500).render('error', {
            view: {
                title: "Error",
                description: "Error interno",
                keywords: "error",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            error: "Error al cargar la gestión de fiscales"
        });
    }
};

// Rutas públicas (sin autenticación)
router.get('/login', showFiscalGeneralLogin);
router.post('/login', processFiscalGeneralLogin);

// Rutas protegidas (requieren autenticación de fiscal general)
router.get('/dashboard', requireFiscalGeneralAuth, showFiscalGeneralDashboard);
router.get('/logout', requireFiscalGeneralAuth, fiscalGeneralLogout);
router.post('/logout', requireFiscalGeneralAuth, fiscalGeneralLogout);

// Rutas para gestión de fiscales (ACCESO COMPLETO como admin, INCLUYENDO cambio de contraseña)
router.get('/fiscales', requireFiscalGeneralAuth, showFiscalManagementForGeneral);
router.post('/fiscales/assign-role', requireFiscalGeneralAuth, assignRole);
router.post('/fiscales/change-institution', requireFiscalGeneralAuth, changeInstitution);
router.post('/fiscales/change-password', requireFiscalGeneralAuth, changePassword); // INCLUIDO - fiscal general SÍ puede cambiar contraseñas
router.delete('/fiscales/delete', requireFiscalGeneralAuth, deleteFiscal);
router.get('/fiscales/:id', requireFiscalGeneralAuth, getFiscalDetails);

// Rutas para otras secciones
router.get('/reportes', requireFiscalGeneralAuth, (req, res) => {
    res.render('fiscal-general/reportes', {
        view: {
            title: "Reportes - Fiscal General",
            description: "Reportes y estadísticas generales del sistema", 
            keywords: "fiscal general, reportes, estadísticas",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        fiscalGeneral: {
            nombre: req.session.fiscalGeneralNombre,
            zona: req.session.fiscalGeneralZona,
            institucion: req.session.fiscalGeneralInstitucion
        }
    });
});

router.get('/configuracion', requireFiscalGeneralAuth, (req, res) => {
    res.render('fiscal-general/configuracion', {
        view: {
            title: "Configuración - Fiscal General",
            description: "Configuración del sistema para fiscal general",
            keywords: "fiscal general, configuración, sistema",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        fiscalGeneral: {
            nombre: req.session.fiscalGeneralNombre,
            zona: req.session.fiscalGeneralZona,
            institucion: req.session.fiscalGeneralInstitucion
        }
    });
});

module.exports = router;
