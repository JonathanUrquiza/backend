const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Obtener la zona del cuerpo de la petición
        const zona = req.body.zona || 'sin_zona';
        const uploadPath = path.join(__dirname, "../uploads", zona);
        
        // Crear el directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Crear nombre único con timestamp
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
        const usuario = req.body.usuario ? `_${req.body.usuario.replace(/\s+/g, '_')}` : '';
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        
        const filename = `${timestamp}${usuario}_${basename}${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Verificar que sea una imagen
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo por archivo
        files: 10 // máximo 10 archivos
    }
});

module.exports = upload;