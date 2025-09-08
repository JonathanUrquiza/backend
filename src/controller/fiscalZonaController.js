// Controlador de autenticación para fiscales de zona
const { Fiscal } = require('../model/index');
const bcrypt = require('bcrypt');

// Mostrar página de login de fiscal de zona
const showFiscalZonaLogin = (req, res) => {
    res.render("fiscal-zona/login", {
        view: {
            title: "Login Fiscal de Zona - Sistema de Fiscalización",
            description: "Acceso exclusivo para fiscales de zona del sistema",
            keywords: "fiscal zona, login, autenticación",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        }
    });
};

// Procesar login de fiscal de zona
const processFiscalZonaLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar fiscal de zona
        const fiscalZona = await Fiscal.findOne({
            where: { 
                email: email.trim().toLowerCase(),
                tipo: 'fiscal_zona' // Solo fiscales de zona
            }
        });

        if (!fiscalZona) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas o no tienes permisos de fiscal de zona'
            });
        }

        // Verificar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, fiscalZona.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Crear sesión de fiscal de zona
        req.session.fiscalZonaId = fiscalZona.id;
        req.session.fiscalZonaEmail = fiscalZona.email;
        req.session.fiscalZonaNombre = fiscalZona.nombre;
        req.session.fiscalZonaTipo = fiscalZona.tipo;
        req.session.fiscalZonaZona = fiscalZona.zona;

        console.log(`🏛️ Fiscal de zona login exitoso: ${fiscalZona.nombre} (Zona ${fiscalZona.zona})`);

        res.json({
            success: true,
            message: 'Login de fiscal de zona exitoso',
            redirect: '/fiscal-zona/dashboard'
        });

    } catch (error) {
        console.error('Error en login de fiscal de zona:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Mostrar dashboard de fiscal de zona
const showFiscalZonaDashboard = async (req, res) => {
    try {
        // Obtener estadísticas básicas
        const totalFiscales = await Fiscal.count();
        const fiscalesZona = await Fiscal.count({ where: { zona: req.session.fiscalZonaZona } });
        const fiscalesGenerales = await Fiscal.count({ where: { tipo: 'fiscal_general' } });
        const fiscalesRegulares = await Fiscal.count({ where: { tipo: 'fiscal' } });

        res.render("fiscal-zona/dashboard", {
            view: {
                title: "Dashboard Fiscal de Zona - Sistema de Fiscalización",
                description: "Panel de control para fiscales de zona",
                keywords: "fiscal zona, dashboard, panel, control",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscalZona: {
                id: req.session.fiscalZonaId,
                nombre: req.session.fiscalZonaNombre,
                email: req.session.fiscalZonaEmail,
                zona: req.session.fiscalZonaZona
            },
            stats: {
                totalFiscales,
                fiscalesZona,
                fiscalesGenerales,
                fiscalesRegulares
            }
        });
    } catch (error) {
        console.error('Error en dashboard de fiscal de zona:', error);
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

// Logout de fiscal de zona
const fiscalZonaLogout = (req, res) => {
    const fiscalZonaNombre = req.session.fiscalZonaNombre;
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión de fiscal de zona:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar sesión' 
            });
        }
        
        console.log(`🚪 Fiscal de zona logout: ${fiscalZonaNombre || 'Desconocido'}`);
        res.redirect('/fiscal-zona/login');
    });
};

// Middleware de autenticación para fiscales de zona
const requireFiscalZonaAuth = (req, res, next) => {
    if (req.session && req.session.fiscalZonaId) {
        return next();
    } else {
        return res.redirect('/fiscal-zona/login');
    }
};

module.exports = {
    showFiscalZonaLogin,
    processFiscalZonaLogin,
    showFiscalZonaDashboard,
    fiscalZonaLogout,
    requireFiscalZonaAuth
};
