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
    const timestamp = new Date().toISOString();
    const { sequelize } = require('../config/database');
    
    try {
        const { email, password } = req.body;

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('🔐 INTENTO DE LOGIN - FISCAL GENERAL');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`⏰ Timestamp: ${timestamp}`);
        console.log(`📧 Email: ${email || 'NO PROPORCIONADO'}`);
        console.log(`🔑 Password: ${password ? '***' + '*'.repeat(password.length - 3) : 'NO PROPORCIONADO'}`);
        console.log(`🌐 IP: ${req.ip || req.connection.remoteAddress}`);
        
        // Verificar estado de conexión a la base de datos
        try {
            await sequelize.authenticate();
            console.log('✅ Estado BD: Conexión activa y funcionando');
        } catch (dbError) {
            console.log('❌ Estado BD: Error de conexión');
            console.log(`   Error: ${dbError.message}`);
            return res.status(503).json({
                success: false,
                message: 'Error de conexión con la base de datos'
            });
        }
        console.log('═══════════════════════════════════════════════════════\n');

        if (!email || !password) {
            console.log('❌ LOGIN FALLIDO - Fiscal General: Campos incompletos\n');
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
            console.log(`❌ LOGIN FALLIDO - Fiscal General no encontrado o sin permisos: ${email}`);
            console.log(`🔍 Credenciales: INVÁLIDAS (usuario no existe o no es fiscal general)\n`);
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas o no tienes permisos de fiscal general'
            });
        }

        console.log(`🔍 Usuario encontrado en BD: ${fiscalGeneral.nombre} (ID: ${fiscalGeneral.id})`);
        console.log(`🔍 Tipo de usuario: ${fiscalGeneral.tipo}`);
        console.log(`🔍 Verificando credenciales...`);

        // Verificar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, fiscalGeneral.password);
        if (!passwordMatch) {
            console.log(`❌ LOGIN FALLIDO - Contraseña incorrecta para: ${fiscalGeneral.nombre} (${fiscalGeneral.email})`);
            console.log(`🔍 Credenciales: INVÁLIDAS (contraseña incorrecta)\n`);
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        console.log(`✅ Credenciales: VÁLIDAS`);

        // Crear sesión de fiscal general
        req.session.fiscalGeneralId = fiscalGeneral.id;
        req.session.fiscalGeneralEmail = fiscalGeneral.email;
        req.session.fiscalGeneralNombre = fiscalGeneral.nombre;
        req.session.fiscalGeneralTipo = fiscalGeneral.tipo;
        req.session.fiscalGeneralZona = fiscalGeneral.zona;
        req.session.fiscalGeneralInstitucion = fiscalGeneral.institucion;

        // Guardar la sesión antes de enviar la respuesta
        req.session.save((err) => {
            if (err) {
                console.error('❌ Error guardando sesión:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al guardar la sesión'
                });
            }

            console.log('✅ LOGIN EXITOSO - FISCAL GENERAL');
            console.log(`👤 Nombre: ${fiscalGeneral.nombre}`);
            console.log(`📧 Email: ${fiscalGeneral.email}`);
            console.log(`🏛️ Institución: ${fiscalGeneral.institucion || 'Sin asignar'}`);
            console.log(`📍 Zona: ${fiscalGeneral.zona || 'Sin asignar'}`);
            console.log(`🆔 ID: ${fiscalGeneral.id}`);
            console.log(`⭐ Tipo: FISCAL GENERAL`);
            console.log(`💾 Sesión guardada correctamente\n`);

            res.json({
                success: true,
                message: 'Login de fiscal general exitoso',
                redirect: '/fiscal-general/dashboard'
            });
        });

    } catch (error) {
        console.error('═══════════════════════════════════════════════════════');
        console.error('❌ ERROR EN LOGIN DE FISCAL GENERAL');
        console.error('═══════════════════════════════════════════════════════');
        console.error(`⏰ Timestamp: ${timestamp}`);
        console.error(`❌ Error: ${error.message}`);
        console.error(`📚 Stack: ${error.stack}`);
        console.error('═══════════════════════════════════════════════════════\n');
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
