const express = require('express');
const router = express.Router();
const { 
    showFiscalZonaLogin, 
    processFiscalZonaLogin, 
    showFiscalZonaDashboard,
    fiscalZonaLogout,
    requireFiscalZonaAuth
} = require('../controller/fiscalZonaController');

// Importar funciones de gestión de fiscales (reutilizamos las del admin pero sin cambio de contraseña)
const {
    showFiscalManagement,
    assignRole,
    changeInstitution,
    deleteFiscal,
    getFiscalDetails
} = require('../controller/adminFiscalController');

// Función personalizada para mostrar gestión de fiscales para fiscal de zona
const showFiscalManagementForZona = async (req, res) => {
    try {
        // Reutilizar la lógica del admin pero con datos de fiscal de zona
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
        
        res.render('fiscal-zona/fiscales', {
            view: {
                title: "Gestión de Fiscales - Fiscal de Zona",
                description: "Administrar fiscales desde panel de fiscal de zona",
                keywords: "fiscal zona, fiscales, gestión, roles",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscalZona: {
                nombre: req.session.fiscalZonaNombre,
                zona: req.session.fiscalZonaZona,
                email: req.session.fiscalZonaEmail
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
        console.error('Error en gestión de fiscales (fiscal zona):', error);
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
router.get('/login', showFiscalZonaLogin);
router.post('/login', processFiscalZonaLogin);

// Rutas protegidas (requieren autenticación de fiscal de zona)
router.get('/dashboard', requireFiscalZonaAuth, showFiscalZonaDashboard);
router.get('/logout', requireFiscalZonaAuth, fiscalZonaLogout);
router.post('/logout', requireFiscalZonaAuth, fiscalZonaLogout);

// Rutas para gestión de fiscales (mismo acceso que admin EXCEPTO cambio de contraseña)
router.get('/fiscales', requireFiscalZonaAuth, showFiscalManagementForZona);
router.post('/fiscales/assign-role', requireFiscalZonaAuth, assignRole);
router.post('/fiscales/change-institution', requireFiscalZonaAuth, changeInstitution);
router.delete('/fiscales/delete', requireFiscalZonaAuth, deleteFiscal);
router.get('/fiscales/:id', requireFiscalZonaAuth, getFiscalDetails);

// NO incluimos la ruta de cambio de contraseña para fiscal de zona
// router.post('/fiscales/change-password', ...) // EXCLUIDA INTENCIONALMENTE

// Rutas para otras secciones (placeholder)
router.get('/reportes', requireFiscalZonaAuth, (req, res) => {
    res.render('fiscal-zona/reportes', {
        view: {
            title: "Reportes - Fiscal de Zona",
            description: "Reportes y estadísticas del sistema", 
            keywords: "fiscal zona, reportes, estadísticas",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        fiscalZona: {
            nombre: req.session.fiscalZonaNombre,
            zona: req.session.fiscalZonaZona
        }
    });
});

module.exports = router;
