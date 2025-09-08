// Controlador específico para fiscales regulares
const { Fiscal, Institucion } = require('../model/index');
const path = require('path');
const fs = require('fs');

// Dashboard para fiscal regular
const showFiscalDashboard = async (req, res) => {
    try {
        const fiscalId = req.session.fiscalId;
        
        // Obtener datos completos del fiscal regular con información de institución
        const fiscal = await Fiscal.findByPk(fiscalId, {
            attributes: ['id', 'nombre', 'email', 'zona', 'direccion', 'cel_num', 'fiscal_general_asignado'],
            include: [
                {
                    model: Institucion,
                    as: 'institucionData',
                    attributes: ['id', 'nombre', 'direccion', 'zona', 'telefono', 'email']
                }
            ]
        });

        if (!fiscal) {
            return res.redirect('/login');
        }

        // Obtener fiscal general asignado si existe
        let fiscalGeneral = null;
        if (fiscal.fiscal_general_asignado) {
            fiscalGeneral = await Fiscal.findByPk(fiscal.fiscal_general_asignado, {
                attributes: ['id', 'nombre', 'email', 'cel_num'],
                where: { tipo: 'fiscal_general' },
                include: [
                    {
                        model: Institucion,
                        as: 'institucionData',
                        attributes: ['nombre', 'direccion', 'telefono', 'email']
                    }
                ]
            });
        }

        // Contar fotos subidas por este fiscal
        const uploadsDir = path.join(__dirname, '../uploads');
        let totalPhotos = 0;
        let photosByZone = {};

        try {
            if (fs.existsSync(uploadsDir)) {
                const zones = fs.readdirSync(uploadsDir, { withFileTypes: true })
                    .filter(item => item.isDirectory() && item.name.startsWith('zona_'));

                zones.forEach(zoneDir => {
                    const zonePath = path.join(uploadsDir, zoneDir.name);
                    const files = fs.readdirSync(zonePath);
                    const imageFiles = files.filter(file => 
                        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file) &&
                        file.includes(fiscal.nombre.replace(/\s+/g, '_'))
                    );
                    
                    if (imageFiles.length > 0) {
                        photosByZone[zoneDir.name] = imageFiles.length;
                        totalPhotos += imageFiles.length;
                    }
                });
            }
        } catch (error) {
            console.error('Error contando fotos:', error);
        }

        res.render('fiscal/dashboard', {
            view: {
                title: "Dashboard Fiscal - Sistema de Fiscalización",
                description: "Panel de control para fiscal regular",
                keywords: "fiscal, dashboard, presente, fotos",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscal: {
                id: fiscal.id,
                nombre: fiscal.nombre,
                email: fiscal.email,
                zona: fiscal.zona,
                direccion: fiscal.direccion,
                cel_num: fiscal.cel_num
            },
            institucion: fiscal.institucionData ? {
                nombre: fiscal.institucionData.nombre,
                direccion: fiscal.institucionData.direccion,
                zona: fiscal.institucionData.zona,
                telefono: fiscal.institucionData.telefono,
                email: fiscal.institucionData.email
            } : null,
            fiscalGeneral,
            stats: {
                totalPhotos,
                photosByZone
            },
            session: req.session // Pasar información de sesión para la navbar
        });

    } catch (error) {
        console.error('Error en dashboard de fiscal:', error);
        res.status(500).render('error', {
            view: {
                title: "Error",
                description: "Error interno",
                keywords: "error",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            error: "Error al cargar el dashboard"
        });
    }
};

// Mostrar información de institución y fiscal general
const showInstitutionInfo = async (req, res) => {
    try {
        const fiscalId = req.session.fiscalId;
        
        const fiscal = await Fiscal.findByPk(fiscalId, {
            attributes: ['id', 'nombre', 'zona', 'direccion', 'fiscal_general_asignado'],
            include: [
                {
                    model: Institucion,
                    as: 'institucionData',
                    attributes: ['id', 'nombre', 'direccion', 'zona', 'telefono', 'email', 'tipo', 'capacidad_votantes']
                }
            ]
        });

        if (!fiscal) {
            return res.redirect('/login');
        }

        let fiscalGeneral = null;
        if (fiscal.fiscal_general_asignado) {
            fiscalGeneral = await Fiscal.findByPk(fiscal.fiscal_general_asignado, {
                attributes: ['id', 'nombre', 'email', 'cel_num', 'direccion'],
                where: { tipo: 'fiscal_general' },
                include: [
                    {
                        model: Institucion,
                        as: 'institucionData',
                        attributes: ['nombre', 'direccion', 'telefono', 'email']
                    }
                ]
            });
        }

        res.render('fiscal/institucion', {
            view: {
                title: "Mi Institución - Sistema de Fiscalización",
                description: "Información de la institución y fiscal general asignado",
                keywords: "fiscal, institución, supervisor",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscal,
            fiscalGeneral
        });

    } catch (error) {
        console.error('Error mostrando información de institución:', error);
        res.status(500).render('error', {
            view: {
                title: "Error",
                description: "Error interno",
                keywords: "error",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            error: "Error al cargar información de institución"
        });
    }
};

// Registrar presente con geolocalización
const registerAttendance = async (req, res) => {
    try {
        const fiscalId = req.session.fiscalId;
        const { latitude, longitude, accuracy } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Ubicación requerida para registrar presente'
            });
        }

        const fiscal = await Fiscal.findByPk(fiscalId, {
            attributes: ['id', 'nombre', 'institucion', 'zona']
        });

        if (!fiscal) {
            return res.status(404).json({
                success: false,
                message: 'Fiscal no encontrado'
            });
        }

        // Aquí se podría validar la proximidad a la institución
        // Por ahora solo registramos el presente
        console.log(`📍 Presente registrado: ${fiscal.nombre}`);
        console.log(`   Institución: ${fiscal.institucion}`);
        console.log(`   Zona: ${fiscal.zona}`);
        console.log(`   Ubicación: ${latitude}, ${longitude}`);
        console.log(`   Precisión: ${accuracy}m`);
        console.log(`   Fecha/Hora: ${new Date().toISOString()}`);

        res.json({
            success: true,
            message: `Presente registrado exitosamente para ${fiscal.nombre}`,
            data: {
                fiscal: fiscal.nombre,
                institucion: fiscal.institucion,
                zona: fiscal.zona,
                timestamp: new Date().toISOString(),
                location: { latitude, longitude, accuracy }
            }
        });

    } catch (error) {
        console.error('Error registrando presente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Mostrar formulario de presente
const showAttendanceForm = (req, res) => {
    res.render('fiscal/presente', {
        view: {
            title: "Registrar Presente - Sistema de Fiscalización",
            description: "Registrar presente con ubicación geográfica",
            keywords: "fiscal, presente, ubicación, geolocalización",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        fiscal: {
            nombre: req.session.fiscalNombre,
            email: req.session.fiscalEmail
        }
    });
};

// Mostrar galería de fotos del fiscal
const showPhotoGallery = async (req, res) => {
    try {
        const fiscalId = req.session.fiscalId;
        
        const fiscal = await Fiscal.findByPk(fiscalId, {
            attributes: ['id', 'nombre', 'zona']
        });

        if (!fiscal) {
            return res.redirect('/login');
        }

        const uploadsDir = path.join(__dirname, '../uploads');
        let fiscalPhotos = {};
        let totalPhotos = 0;

        try {
            if (fs.existsSync(uploadsDir)) {
                const zones = fs.readdirSync(uploadsDir, { withFileTypes: true })
                    .filter(item => item.isDirectory() && item.name.startsWith('zona_'));

                zones.forEach(zoneDir => {
                    const zonePath = path.join(uploadsDir, zoneDir.name);
                    const files = fs.readdirSync(zonePath);
                    
                    // Filtrar fotos de este fiscal específico
                    const fiscalFiles = files
                        .filter(file => {
                            if (!/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)) return false;
                            
                            // Buscar el nombre del fiscal en el nombre del archivo
                            const fiscalNameForFile = fiscal.nombre.replace(/\s+/g, '_');
                            return file.includes(fiscalNameForFile);
                        })
                        .map(file => {
                            const filePath = path.join(zonePath, file);
                            const stats = fs.statSync(filePath);
                            
                            return {
                                filename: file,
                                path: `/uploads/${zoneDir.name}/${file}`,
                                uploadedAt: stats.mtime,
                                zona: zoneDir.name.replace('zona_', 'Zona ')
                            };
                        })
                        .sort((a, b) => b.uploadedAt - a.uploadedAt);

                    if (fiscalFiles.length > 0) {
                        fiscalPhotos[zoneDir.name] = {
                            displayName: zoneDir.name.replace('zona_', 'Zona '),
                            photos: fiscalFiles,
                            count: fiscalFiles.length
                        };
                        totalPhotos += fiscalFiles.length;
                    }
                });
            }
        } catch (error) {
            console.error('Error cargando galería:', error);
        }

        res.render('fiscal/galeria', {
            view: {
                title: "Mis Fotos - Sistema de Fiscalización",
                description: "Galería de fotos subidas por el fiscal",
                keywords: "fiscal, fotos, galería, imágenes",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            fiscal,
            fiscalPhotos,
            totalPhotos
        });

    } catch (error) {
        console.error('Error en galería de fotos:', error);
        res.status(500).render('error', {
            view: {
                title: "Error",
                description: "Error interno",
                keywords: "error",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            error: "Error al cargar la galería de fotos"
        });
    }
};

// Middleware para verificar que sea fiscal regular autenticado
const requireFiscalAuth = (req, res, next) => {
    if (req.session && req.session.fiscalId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

module.exports = {
    showFiscalDashboard,
    showInstitutionInfo,
    registerAttendance,
    showAttendanceForm,
    showPhotoGallery,
    requireFiscalAuth
};
