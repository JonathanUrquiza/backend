// Controlador de autenticación para administradores
const { Administrador, Fiscal } = require('../model/index');
const bcrypt = require('bcrypt');
const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');

// Mostrar página de login de administrador
const showAdminLogin = (req, res) => {
    res.render("admin/login", {
        view: {
            title: "Login Administrador - Sistema de Fiscalización",
            description: "Acceso exclusivo para administradores del sistema",
            keywords: "admin, administrador, login, autenticación",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        }
    });
};

// Procesar login de administrador
const processAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar administrador
        const admin = await Administrador.findOne({
            where: { 
                email: email.trim().toLowerCase(),
                activo: true // Solo administradores activos
            }
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Actualizar último acceso
        await admin.update({
            ultimo_acceso: new Date()
        });

        // Crear sesión de administrador
        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;
        req.session.adminNombre = admin.nombre;
        req.session.adminRol = admin.rol;

        console.log(`🔐 Admin login exitoso: ${admin.nombre} (${admin.rol})`);

        res.json({
            success: true,
            message: 'Login de administrador exitoso',
            redirect: '/admin/dashboard'
        });

    } catch (error) {
        console.error('Error en login de administrador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Mostrar dashboard de administrador
const showAdminDashboard = async (req, res) => {
    try {
        // Obtener estadísticas básicas
        const totalFiscales = await require('../model/index').Fiscal.count();
        const totalAdmins = await Administrador.count({ where: { activo: true } });

        res.render("admin/dashboard", {
            view: {
                title: "Dashboard Administrador - Sistema de Fiscalización",
                description: "Panel de control para administradores",
                keywords: "admin, dashboard, panel, control",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            admin: {
                id: req.session.adminId,
                nombre: req.session.adminNombre,
                email: req.session.adminEmail,
                rol: req.session.adminRol
            },
            stats: {
                totalFiscales,
                totalAdmins
            }
        });
    } catch (error) {
        console.error('Error en dashboard de administrador:', error);
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

// Logout de administrador
const adminLogout = (req, res) => {
    const adminNombre = req.session.adminNombre;
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión de administrador:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar sesión' 
            });
        }
        
        console.log(`🚪 Admin logout: ${adminNombre || 'Desconocido'}`);
        res.redirect('/admin/login');
    });
};

// Middleware de autenticación para administradores
const requireAdminAuth = (req, res, next) => {
    if (req.session && req.session.adminId) {
        return next();
    } else {
        return res.redirect('/admin/login');
    }
};

// Middleware de autorización por rol
const requireAdminRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.session.adminId) {
            return res.redirect('/admin/login');
        }
        
        if (roles.length === 0 || roles.includes(req.session.adminRol)) {
            return next();
        } else {
            return res.status(403).render('error', {
                view: {
                    title: "Acceso Denegado",
                    description: "Sin permisos",
                    keywords: "error, permisos",
                    author: "Sistema Monolito",
                    year: new Date().getFullYear()
                },
                error: "No tienes permisos para acceder a esta sección"
            });
        }
    };
};

// Mostrar formulario para crear fiscal regular
const showCreateFiscal = (req, res) => {
    res.render("admin/create-fiscal", {
        view: {
            title: "Crear Fiscal Regular - Admin",
            description: "Crear nuevo fiscal regular",
            keywords: "admin, crear, fiscal, regular",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        },
        tipoFiscal: 'fiscal'
    });
};

// Mostrar formulario para crear fiscal general
const showCreateFiscalGeneral = (req, res) => {
    res.render("admin/create-fiscal", {
        view: {
            title: "Crear Fiscal General - Admin",
            description: "Crear nuevo fiscal general",
            keywords: "admin, crear, fiscal, general",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        },
        tipoFiscal: 'fiscal_general'
    });
};

// Mostrar formulario para crear fiscal de zona
const showCreateFiscalZona = (req, res) => {
    res.render("admin/create-fiscal", {
        view: {
            title: "Crear Fiscal de Zona - Admin",
            description: "Crear nuevo fiscal de zona",
            keywords: "admin, crear, fiscal, zona",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        },
        tipoFiscal: 'fiscal_zona'
    });
};

// Procesar creación de nuevo fiscal
const processCreateFiscal = async (req, res) => {
    try {
        const { 
            tipo,
            nombre,
            email,
            password,
            "cel-num": celNum,
            direccion,
            zona,
            institucion
        } = req.body;

        // Validaciones básicas
        if (!tipo || !nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Tipo, nombre, email y contraseña son requeridos'
            });
        }

        // Verificar que el tipo sea válido
        if (!['fiscal', 'fiscal_general', 'fiscal_zona'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de fiscal inválido'
            });
        }

        // Verificar que no exista otro fiscal con el mismo email
        const existingFiscal = await Fiscal.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (existingFiscal) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un fiscal con ese email'
            });
        }

        // Validar zona si se proporciona
        if (zona && (parseInt(zona) < 1 || parseInt(zona) > 15)) {
            return res.status(400).json({
                success: false,
                message: 'La zona debe estar entre 1 y 15'
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el fiscal
        const newFiscal = await Fiscal.create({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            're-password': hashedPassword, // Mantenemos consistencia con el esquema original
            'cel-num': celNum ? celNum.trim() : null,
            direccion: direccion ? direccion.trim() : null,
            zona: zona ? parseInt(zona) : null,
            institucion: institucion ? institucion.trim() : 'Sin Asignar',
            tipo: tipo
        });

        console.log(`✅ Nuevo fiscal creado por admin ${req.session.adminNombre}:`, {
            id: newFiscal.id,
            nombre: newFiscal.nombre,
            tipo: newFiscal.tipo,
            email: newFiscal.email
        });

        res.json({
            success: true,
            message: `${tipo.replace('_', ' ')} creado exitosamente`,
            redirect: '/admin/fiscales'
        });

    } catch (error) {
        console.error('Error al crear fiscal:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear el fiscal'
        });
    }
};

// Configuración de multer para carga de archivos Excel
const excelStorage = multer.memoryStorage();
const excelUpload = multer({
    storage: excelStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
            file.mimetype === 'application/vnd.ms-excel' ||
            file.originalname.match(/\.(xlsx|xls)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

// Mostrar formulario para cargar datos desde Excel
const showExcelUpload = (req, res) => {
    res.render("admin/excel-upload", {
        view: {
            title: "Cargar Fiscales desde Excel - Admin",
            description: "Importar fiscales masivamente desde archivo Excel",
            keywords: "admin, excel, importar, fiscales",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        }
    });
};

// Procesar carga de archivo Excel
const processExcelUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se seleccionó ningún archivo'
            });
        }

        // Leer el archivo Excel desde memoria
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir a JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        if (data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El archivo Excel está vacío o no tiene datos válidos'
            });
        }

        console.log(`📊 Procesando ${data.length} registros del archivo Excel...`);

        const results = {
            created: 0,
            updated: 0,
            errors: [],
            skipped: 0
        };

        // Procesar cada fila del Excel
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            
            try {
                // Mapear campos del Excel (ajustar según la estructura de tu Excel)
                const fiscalData = {
                    nombre: row.NOMBRE || row.nombre || row.Nombre,
                    email: row.EMAIL || row.email || row.Email,
                    'cel-num': row.CELULAR || row['cel-num'] || row.Celular,
                    direccion: row.DIRECCION || row.direccion || row.Dirección,
                    zona: row.ZONA || row.zona || null,
                    institucion: row.INSTITUCION || row.institucion || row.Institución || 'Sin Asignar',
                    tipo: 'fiscal' // Por defecto fiscal regular
                };

                // Determinar tipo según columnas especiales
                if (row.TIPO || row.tipo) {
                    const tipoValue = (row.TIPO || row.tipo).toString().toLowerCase();
                    if (tipoValue.includes('general') || tipoValue === 'g') {
                        fiscalData.tipo = 'fiscal_general';
                    } else if (tipoValue.includes('zona') || tipoValue === 'z') {
                        fiscalData.tipo = 'fiscal_zona';
                    }
                }

                // Validaciones básicas
                if (!fiscalData.nombre || !fiscalData.email) {
                    results.errors.push(`Fila ${i + 2}: Nombre y email son requeridos`);
                    results.skipped++;
                    continue;
                }

                // Normalizar email
                fiscalData.email = fiscalData.email.toString().toLowerCase().trim();

                // Validar email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fiscalData.email)) {
                    results.errors.push(`Fila ${i + 2}: Email inválido (${fiscalData.email})`);
                    results.skipped++;
                    continue;
                }

                // Validar zona si existe
                if (fiscalData.zona) {
                    const zonaNum = parseInt(fiscalData.zona);
                    if (isNaN(zonaNum) || zonaNum < 1 || zonaNum > 15) {
                        results.errors.push(`Fila ${i + 2}: Zona debe estar entre 1 y 15 (${fiscalData.zona})`);
                        results.skipped++;
                        continue;
                    }
                    fiscalData.zona = zonaNum;
                }

                // Verificar si el fiscal ya existe
                const existingFiscal = await Fiscal.findOne({
                    where: { email: fiscalData.email }
                });

                if (existingFiscal) {
                    // Actualizar fiscal existente
                    await existingFiscal.update({
                        nombre: fiscalData.nombre.trim(),
                        'cel-num': fiscalData['cel-num'] ? fiscalData['cel-num'].toString().trim() : existingFiscal['cel-num'],
                        direccion: fiscalData.direccion ? fiscalData.direccion.trim() : existingFiscal.direccion,
                        zona: fiscalData.zona || existingFiscal.zona,
                        institucion: fiscalData.institucion.trim(),
                        tipo: fiscalData.tipo
                    });
                    results.updated++;
                } else {
                    // Crear nuevo fiscal con contraseña por defecto
                    const defaultPassword = 'fiscal123';
                    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
                    
                    await Fiscal.create({
                        nombre: fiscalData.nombre.trim(),
                        email: fiscalData.email,
                        password: hashedPassword,
                        're-password': hashedPassword,
                        'cel-num': fiscalData['cel-num'] ? fiscalData['cel-num'].toString().trim() : null,
                        direccion: fiscalData.direccion ? fiscalData.direccion.trim() : null,
                        zona: fiscalData.zona,
                        institucion: fiscalData.institucion.trim(),
                        tipo: fiscalData.tipo
                    });
                    results.created++;
                }
            } catch (rowError) {
                console.error(`Error en fila ${i + 2}:`, rowError);
                results.errors.push(`Fila ${i + 2}: ${rowError.message}`);
                results.skipped++;
            }
        }

        console.log(`✅ Procesamiento completado:`, results);

        res.json({
            success: true,
            message: `Procesamiento completado: ${results.created} creados, ${results.updated} actualizados, ${results.skipped} omitidos`,
            results: results
        });

    } catch (error) {
        console.error('Error procesando archivo Excel:', error);
        res.status(500).json({
            success: false,
            message: `Error procesando archivo: ${error.message}`
        });
    }
};

// Middleware para carga de Excel
const handleExcelUpload = excelUpload.single('excelFile');

module.exports = {
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
};
