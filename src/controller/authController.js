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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
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
            return res.json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, fiscal.password);
        if (!passwordMatch) {
            return res.json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Crear sesión simple
        req.session.fiscalId = fiscal.id;
        req.session.fiscalEmail = fiscal.email;
        req.session.fiscalNombre = fiscal.nombre;

            res.json({
                success: true,
                message: 'Login exitoso',
                redirect: '/fiscal/dashboard'
            });

    } catch (error) {
        console.error('Error en login:', error);
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