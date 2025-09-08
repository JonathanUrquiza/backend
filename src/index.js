const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const fs = require("fs");
const { testConnection } = require("./config/database");
const upload = require("./middlewares/upload");
require("dotenv").config();

const port = process.env.PORT || 3000;

// Configuración básica
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// Sesiones básicas
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_basica',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas básicas
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const fiscalZonaRouter = require("./routes/fiscalZonaRouter");
const fiscalGeneralRouter = require("./routes/fiscalGeneralRouter");
const fiscalRouter = require("./routes/fiscalRouter");

// Middleware de autenticación simple
const requireAuth = (req, res, next) => {
    if (req.session.fiscalId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Rutas básicas
app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/fiscal-zona', fiscalZonaRouter);
app.use('/fiscal-general', fiscalGeneralRouter);
app.use('/fiscal', fiscalRouter);

// Ruta de inicio (usa el diseño original)
app.get('/', (req, res) => {
    res.render('index', {
        view: {
            title: "Monolito Fiscalización - Sistema Integral",
            description: "Sistema integral para la gestión de actas e imágenes de fiscalización",
            keywords: "fiscalización, actas, imágenes, gestión",
            author: "Jonathan Javier Urquiza",
            year: new Date().getFullYear()
        },
        session: req.session // Pasar información de sesión para la navbar
    });
});

// Ruta de contacto
app.get('/contacto', (req, res) => {
    res.render('contacto', {
        view: {
            title: "Contacto - Monolito Fiscalización",
            description: "Información de contacto del sistema",
            keywords: "contacto, soporte, desarrollador",
            author: "Jonathan Javier Urquiza",
            year: new Date().getFullYear()
        },
        session: req.session // Pasar información de sesión para la navbar
    });
});

// Ruta para cargar imágenes (página de carga) - SOLO FISCALES AUTENTICADOS
app.get('/upload', requireAuth, (req, res) => {
    res.render('actas', {
        view: {
            title: "Cargar Nuevas Imágenes de Actas - Monolito Fiscalización",
            description: "Sube múltiples imágenes organizadas por zona",
            keywords: "upload, imágenes, actas, fiscalización",
            author: "Jonathan Javier Urquiza",
            year: new Date().getFullYear()
        },
        session: req.session // Pasar información de sesión para la navbar
    });
});

// Ruta POST para procesar la carga de imágenes - SOLO FISCALES AUTENTICADOS
app.post('/upload', requireAuth, upload.array('files', 10), (req, res) => {
    try {
        const { zona, usuario } = req.body;
        const files = req.files;
        
        if (!zona || !files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos (zona e imágenes)'
            });
        }

        console.log(`📁 Subidas ${files.length} imágenes a ${zona} por ${usuario || 'Anónimo'}`);
        
        res.json({
            success: true,
            message: `${files.length} imagen${files.length > 1 ? 'es' : ''} subida${files.length > 1 ? 's' : ''} exitosamente`,
            count: files.length,
            zona: zona,
            usuario: usuario || 'Anónimo',
            files: files.map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                size: file.size,
                path: `/uploads/${zona}/${file.filename}`
            }))
        });
        
    } catch (error) {
        console.error('Error al subir imágenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

// Ruta para la galería de imágenes - SOLO FISCALES AUTENTICADOS
app.get('/actas/', requireAuth, (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    let zonesData = {};
    let totalImages = 0;
    
    try {
        // Crear directorio uploads si no existe
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Leer todas las carpetas de zonas
        const items = fs.readdirSync(uploadsDir, { withFileTypes: true });
        
        items.forEach(item => {
            if (item.isDirectory() && item.name.startsWith('zona_')) {
                const zonePath = path.join(uploadsDir, item.name);
                const zoneFiles = fs.readdirSync(zonePath);
                
                const images = zoneFiles
                    .filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file))
                    .map(file => {
                        const filePath = path.join(zonePath, file);
                        const stats = fs.statSync(filePath);
                        
                        // Extraer información del nombre del archivo
                        const parts = file.split('_');
                        let usuario = 'Anónimo';
                        
                        if (parts.length >= 3) {
                            // El formato es: timestamp_usuario_nombreoriginal.ext
                            usuario = parts[1] || 'Anónimo';
                        }
                        
                        return {
                            filename: file,
                            path: `/uploads/${item.name}/${file}`,
                            uploadedAt: stats.mtime,
                            usuario: usuario.replace(/_/g, ' ')
                        };
                    })
                    .sort((a, b) => b.uploadedAt - a.uploadedAt); // Más recientes primero
                
                if (images.length > 0) {
                    zonesData[item.name] = {
                        displayName: item.name.replace('zona_', 'Zona '),
                        images: images,
                        count: images.length
                    };
                    totalImages += images.length;
                }
            }
        });
        
    } catch (error) {
        console.log('Error al leer directorio uploads:', error.message);
    }
    
    res.render('gallery', {
        view: {
            title: "Galería de Imágenes por Zona - Monolito Fiscalización",
            description: "Explora y gestiona todas las imágenes organizadas por zonas",
            keywords: "galería, imágenes, actas, zonas",
            author: "Jonathan Javier Urquiza",
            year: new Date().getFullYear()
        },
        zonesData: zonesData,
        totalImages: totalImages,
        session: req.session // Pasar información de sesión para la navbar
    });
});

// Ruta para eliminar una imagen individual - SOLO FISCALES AUTENTICADOS
app.delete('/delete/image', requireAuth, (req, res) => {
    try {
        const { filename, zona } = req.body;
        
        if (!filename || !zona) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros (filename, zona)'
            });
        }

        const filePath = path.join(__dirname, 'uploads', zona, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Imagen eliminada: ${filename} de ${zona}`);
            
            res.json({
                success: true,
                message: 'Imagen eliminada exitosamente'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Imagen no encontrada'
            });
        }
        
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Ruta para eliminar todas las imágenes de una zona - SOLO FISCALES AUTENTICADOS
app.delete('/delete/zone', requireAuth, (req, res) => {
    try {
        const { zona } = req.body;
        
        if (!zona) {
            return res.status(400).json({
                success: false,
                message: 'Falta parámetro zona'
            });
        }

        const zonePath = path.join(__dirname, 'uploads', zona);
        
        if (fs.existsSync(zonePath)) {
            const files = fs.readdirSync(zonePath);
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file));
            
            imageFiles.forEach(file => {
                const filePath = path.join(zonePath, file);
                fs.unlinkSync(filePath);
            });
            
            console.log(`🗑️ Eliminadas ${imageFiles.length} imágenes de ${zona}`);
            
            res.json({
                success: true,
                message: `${imageFiles.length} imágenes eliminadas de ${zona}`,
                count: imageFiles.length
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Zona no encontrada'
            });
        }
        
    } catch (error) {
        console.error('Error eliminando zona:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Ruta para descargar todas las imágenes (placeholder)
app.get('/download/all', (req, res) => {
    res.status(501).json({
        success: false,
        message: 'Función de descarga masiva aún no implementada'
    });
});

// Ruta para descargar imágenes por zona (placeholder)
app.get('/download/zona/:zona', (req, res) => {
    const { zona } = req.params;
    res.status(501).json({
        success: false,
        message: `Función de descarga para ${zona} aún no implementada`
    });
});

app.get('/fiscales', requireAuth, (req, res) => {
    res.render('placeholder', {
        view: {
            title: "Información de Fiscales - Sistema",
            description: "Información general del sistema de fiscales",
            keywords: "fiscales, información, sistema",
            author: "Jonathan Javier Urquiza",
            year: new Date().getFullYear()
        },
        page: {
            title: "👥 Información de Fiscales",
            subtitle: "Solo para fiscales autenticados",
            description: "Accede a tu dashboard de fiscal para ver información detallada, subir fotos y gestionar tu actividad de fiscalización.",
            backLink: "/fiscal/dashboard",
            backText: "Ir a Mi Dashboard"
        },
        session: req.session // Pasar información de sesión para la navbar
    });
});

// Error 404
app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada</h1><a href="/login">Ir al login</a>');
});

// Inicializar servidor
async function startServer() {
    try {
        console.log("🚀 Iniciando servidor básico...");
        
        // Probar conexión
        await testConnection();
        
        app.listen(port, () => {
            console.log(`✅ Servidor funcionando en puerto ${port}`);
            console.log(`🌐 http://localhost:${port}`);
            console.log("🚀 Funcionalidades disponibles:");
            console.log("  📝 Login/Register de fiscales");
            console.log("  📤 Carga de imágenes por zonas");
            console.log("  📷 Galería de imágenes organizada");
            console.log("  🗑️ Eliminación de imágenes individual/masiva");
            console.log(`📁 Directorio de uploads: ${path.join(__dirname, 'uploads')}`);
        });

    } catch (error) {
        console.error("❌ Error iniciando servidor:", error);
        process.exit(1);
    }
}

startServer();