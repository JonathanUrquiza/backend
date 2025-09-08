// Controlador de autenticación para fiscales generales
const { Fiscal } = require('../model/index');
const bcrypt = require('bcrypt');

// Mostrar página de login de fiscal general
const showFiscalGeneralLogin = (req, res) => {
    res.render("fiscal-general/login", {
        view: {
            title: "Login Fiscal General - Sistema de Fiscalización",
            description: "Acceso exclusivo para fiscales generales del sistema",
            keywords: "fiscal general, login, autenticación",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        }
    });
};

// Procesar login de fiscal general
const processFiscalGeneralLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar fiscal general
        const fiscalGeneral = await Fiscal.findOne({
            where: { 
                email: email.trim().toLowerCase(),
                tipo: 'fiscal_general' // Solo fiscales generales
            }
        });

        if (!fiscalGeneral) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas o no tienes permisos de fiscal general'
            });
        }

        // Verificar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, fiscalGeneral.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Crear sesión de fiscal general
        req.session.fiscalGeneralId = fiscalGeneral.id;
        req.session.fiscalGeneralEmail = fiscalGeneral.email;
        req.session.fiscalGeneralNombre = fiscalGeneral.nombre;
        req.session.fiscalGeneralTipo = fiscalGeneral.tipo;
        req.session.fiscalGeneralZona = fiscalGeneral.zona;
        req.session.fiscalGeneralInstitucion = fiscalGeneral.institucion;

        console.log(`⭐ Fiscal general login exitoso: ${fiscalGeneral.nombre} (${fiscalGeneral.institucion})`);

        res.json({
            success: true,
            message: 'Login de fiscal general exitoso',
            redirect: '/fiscal-general/dashboard'
        });

    } catch (error) {
        console.error('Error en login de fiscal general:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Mostrar dashboard de fiscal general
const showFiscalGeneralDashboard = async (req, res) => {
    try {
        // Obtener estadísticas completas
        const totalFiscales = await Fiscal.count();
        const fiscalesGenerales = await Fiscal.count({ where: { tipo: 'fiscal_general' } });
        const fiscalesZona = await Fiscal.count({ where: { tipo: 'fiscal_zona' } });
        const fiscalesRegulares = await Fiscal.count({ where: { tipo: 'fiscal' } });

        // Estadísticas por zona
        const fiscalesPorZona = {};
        for (let zona = 1; zona <= 15; zona++) {
            const count = await Fiscal.count({ where: { zona: zona } });
            fiscalesPorZona[zona] = count;
        }

        res.render("fiscal-general/dashboard", {
            view: {
                title: "Dashboard Fiscal General - Sistema de Fiscalización",
                description: "Panel de control para fiscales generales",
                keywords: "fiscal general, dashboard, panel, administración",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscalGeneral: {
                id: req.session.fiscalGeneralId,
                nombre: req.session.fiscalGeneralNombre,
                email: req.session.fiscalGeneralEmail,
                zona: req.session.fiscalGeneralZona,
                institucion: req.session.fiscalGeneralInstitucion
            },
            stats: {
                totalFiscales,
                fiscalesGenerales,
                fiscalesZona,
                fiscalesRegulares,
                fiscalesPorZona
            }
        });
    } catch (error) {
        console.error('Error en dashboard de fiscal general:', error);
        res.status(500).render('error', {
            view: {
                title: "Error - Sistema",
                description: "Error interno",
                keywords: "error",
                author: "Sistema Monolito", 
                year: new Date().getFullYear()
            },
            error: "Error al cargar el dashboard"
        });
    }
};

// Logout de fiscal general
const fiscalGeneralLogout = (req, res) => {
    const fiscalGeneralNombre = req.session.fiscalGeneralNombre;
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión de fiscal general:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar sesión' 
            });
        }
        
        console.log(`🚪 Fiscal general logout: ${fiscalGeneralNombre || 'Desconocido'}`);
        res.redirect('/fiscal-general/login');
    });
};

// Middleware de autenticación para fiscales generales
const requireFiscalGeneralAuth = (req, res, next) => {
    if (req.session && req.session.fiscalGeneralId) {
        return next();
    } else {
        return res.redirect('/fiscal-general/login');
    }
};

module.exports = {
    showFiscalGeneralLogin,
    processFiscalGeneralLogin,
    showFiscalGeneralDashboard,
    fiscalGeneralLogout,
    requireFiscalGeneralAuth
};
