// Controlador básico de autenticación
const { Fiscal } = require('../model/index');
const bcrypt = require('bcrypt');

// Mostrar página de login
const showLogin = (req, res) => {
    res.render("auth/login", {
        view: {
            title: "Login - Sistema de Fiscalización",
            description: "Iniciar sesión en el sistema",
            keywords: "login, autenticación",
            author: "Sistema",
            year: new Date().getFullYear()
        },
        session: req.session // Pasar información de sesión para la navbar
    });
};

// Mostrar página de registro
const showRegister = (req, res) => {
    res.render("auth/register", {
        view: {
            title: "Registro - Sistema de Fiscalización",
            description: "Crear una nueva cuenta",
            keywords: "registro, cuenta nueva",
            author: "Sistema", 
            year: new Date().getFullYear()
        },
        session: req.session // Pasar información de sesión para la navbar
    });
};

// Procesar login básico
const processLogin = async (req, res) => {
    const timestamp = new Date().toISOString();
    const { sequelize } = require('../config/database');
    
    try {
        const { email, password } = req.body;

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('🔐 INTENTO DE LOGIN - FISCAL REGULAR');
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
            return res.json({
                success: false,
                message: 'Error de conexión con la base de datos'
            });
        }
        console.log('═══════════════════════════════════════════════════════\n');

        if (!email || !password) {
            console.log('❌ LOGIN FALLIDO - Fiscal: Campos incompletos\n');
            return res.json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar fiscal
        const fiscal = await Fiscal.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (!fiscal) {
            console.log(`❌ LOGIN FALLIDO - Fiscal no encontrado: ${email}`);
            console.log(`🔍 Credenciales: INVÁLIDAS (usuario no existe)\n`);
            return res.json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        console.log(`🔍 Usuario encontrado en BD: ${fiscal.nombre} (ID: ${fiscal.id})`);
        console.log(`🔍 Verificando credenciales...`);

        // Verificar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, fiscal.password);
        if (!passwordMatch) {
            console.log(`❌ LOGIN FALLIDO - Contraseña incorrecta para: ${fiscal.nombre} (${fiscal.email})`);
            console.log(`🔍 Credenciales: INVÁLIDAS (contraseña incorrecta)\n`);
            return res.json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        console.log(`✅ Credenciales: VÁLIDAS`);

        // Crear sesión simple
        req.session.fiscalId = fiscal.id;
        req.session.fiscalEmail = fiscal.email;
        req.session.fiscalNombre = fiscal.nombre;

        // Guardar la sesión antes de enviar la respuesta
        req.session.save((err) => {
            if (err) {
                console.error('❌ Error guardando sesión:', err);
                return res.json({
                    success: false,
                    message: 'Error al guardar la sesión'
                });
            }

            console.log('✅ LOGIN EXITOSO - FISCAL REGULAR');
            console.log(`👤 Nombre: ${fiscal.nombre}`);
            console.log(`📧 Email: ${fiscal.email}`);
            console.log(`🏛️ Institución: ${fiscal.institucion || 'Sin asignar'}`);
            console.log(`📍 Zona: ${fiscal.zona || 'Sin asignar'}`);
            console.log(`🆔 ID: ${fiscal.id}`);
            console.log(`📋 Tipo: ${fiscal.tipo || 'fiscal'}`);
            console.log(`💾 Sesión guardada correctamente\n`);

            res.json({
                success: true,
                message: 'Login exitoso',
                redirect: '/fiscal/dashboard'
            });
        });

    } catch (error) {
        console.error('═══════════════════════════════════════════════════════');
        console.error('❌ ERROR EN LOGIN DE FISCAL');
        console.error('═══════════════════════════════════════════════════════');
        console.error(`⏰ Timestamp: ${timestamp}`);
        console.error(`❌ Error: ${error.message}`);
        console.error(`📚 Stack: ${error.stack}`);
        console.error('═══════════════════════════════════════════════════════\n');
        res.json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Procesar registro básico
const processRegister = async (req, res) => {
    try {
        const { nombre, email, password, confirmPassword } = req.body;

        // Validaciones básicas
        if (!nombre || !email || !password) {
            return res.json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el email ya existe
        const existingFiscal = await Fiscal.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (existingFiscal) {
            return res.json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo fiscal básico
        await Fiscal.create({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            cel_num: '', // campo opcional vacío
            direccion: 'Sin especificar', // valor por defecto para evitar validación
            zona: 1, // valor por defecto válido (mayor a 0)
            institucion: 'Sin Asignar',
            password: hashedPassword,
            re_password: hashedPassword
        });

        res.json({
            success: true,
            message: 'Cuenta creada exitosamente',
            redirect: '/login'
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.json({
                success: false,
                message: 'Error de validación: ' + error.errors.map(e => e.message).join(', ')
            });
        }

        res.json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Logout básico
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error en logout:', err);
        }
        res.redirect('/login');
    });
};

// Middleware de autenticación (opcional para el momento)
const requireAuth = (req, res, next) => {
    if (req.session && req.session.fiscalId) {
        return next();
    } else {
        // Por ahora, permitir acceso sin autenticación
        // En el futuro se puede cambiar a: res.redirect('/login');
        return next();
    }
};

module.exports = {
    showLogin,
    showRegister,
    processLogin,
    processRegister,
    logout,
    requireAuth
};