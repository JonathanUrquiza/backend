const express = require("express");
const app = express();
const cors = require("cors");
const picocolors = require("picocolors");
const path = require("path");
const {auth} = require("./middlewares/auth");
require("dotenv").config();

const port = process.env.PORT || 3000;

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Servir archivos estáticos del directorio uploads y sus subdirectorios
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const indexRouter = require("./routes/indexRouter");
const registerRouter = require("./routes/registerRouter");
const fiscalizacionRouter = require("./routes/fiscalizacionRouter");
const actasRouter = require("./routes/actasRouter");
const { actas } = require("./controller/actasController");
const upload = require("./middlewares/upload");
const archiver = require('archiver');
const fs = require('fs');




try {
  
 
  app.use('/', indexRouter);
  app.use('/registro', registerRouter);
  //app.use('/login', auth, authRouter);
  app.use('/fiscales', fiscalizacionRouter);
  //app.use('/presentismo', auth, controlRouter);
  app.use('/actas', actasRouter);
  //app.use('/presentismo', auth, controlRouter);
  
  // Rutas para el formulario de carga en /upload
  app.get('/upload', actas);
  app.post('/upload', upload.array('files', 10), (req, res) => {
    // Handle multiple file upload with zone and user info
    try {
        if (req.files && req.files.length > 0) {
            const zona = req.body.zona;
            const usuario = req.body.usuario || 'Anónimo';
            
            const uploadedFiles = req.files.map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                zona: zona,
                usuario: usuario,
                path: file.path
            }));
            
            console.log(`✅ ${req.files.length} archivos subidos a ${zona} por ${usuario}`);
            
            res.json({ 
                success: true, 
                message: `${req.files.length} archivos subidos exitosamente a ${zona.replace('zona_', 'Zona ')}`,
                files: uploadedFiles,
                count: req.files.length,
                zona: zona,
                usuario: usuario
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'No se subieron archivos' 
            });
        }
    } catch (error) {
        console.error('Error al subir archivos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor: ' + error.message
        });
    }
  });

  // Endpoint para descargar todas las imágenes
  app.get('/download/all', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    const zipName = `actas_todas_${new Date().toISOString().split('T')[0]}.zip`;
    
    res.attachment(zipName);
    
    const archive = archiver('zip', {
      zlib: { level: 9 } // máxima compresión
    });
    
    archive.on('error', (err) => {
      console.error('Error creando ZIP:', err);
      res.status(500).send('Error al crear el archivo ZIP');
    });
    
    archive.pipe(res);
    
    try {
      // Agregar todas las imágenes de todas las zonas
      const items = fs.readdirSync(uploadsDir, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.isDirectory() && item.name.startsWith('zona_')) {
          const zonePath = path.join(uploadsDir, item.name);
          const zoneFiles = fs.readdirSync(zonePath);
          
          zoneFiles.forEach(file => {
            if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)) {
              const filePath = path.join(zonePath, file);
              archive.file(filePath, { name: `${item.name}/${file}` });
            }
          });
        } else if (item.isFile() && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.name)) {
          // Imágenes en el directorio raíz (sin zona)
          const filePath = path.join(uploadsDir, item.name);
          archive.file(filePath, { name: `sin_zona/${item.name}` });
        }
      });
      
      archive.finalize();
    } catch (error) {
      console.error('Error leyendo directorio:', error);
      res.status(500).send('Error al acceder a las imágenes');
    }
  });

  // Endpoint para descargar imágenes de una zona específica
  app.get('/download/zona/:zona', (req, res) => {
    const zona = req.params.zona;
    const zipName = `actas_${zona}_${new Date().toISOString().split('T')[0]}.zip`;
    
    res.attachment(zipName);
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    archive.on('error', (err) => {
      console.error('Error creando ZIP:', err);
      res.status(500).send('Error al crear el archivo ZIP');
    });
    
    archive.pipe(res);
    
    try {
      let files = [];
      
      if (zona === 'sin_zona') {
        // Manejar imágenes en el directorio raíz
        const uploadsDir = path.join(__dirname, 'uploads');
        const rootFiles = fs.readdirSync(uploadsDir);
        
        files = rootFiles
          .filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file))
          .map(file => ({
            filePath: path.join(uploadsDir, file),
            name: file
          }));
      } else {
        // Manejar zona específica
        const zonePath = path.join(__dirname, 'uploads', zona);
        
        if (!fs.existsSync(zonePath)) {
          return res.status(404).send('Zona no encontrada');
        }
        
        const zoneFiles = fs.readdirSync(zonePath);
        
        files = zoneFiles
          .filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file))
          .map(file => ({
            filePath: path.join(zonePath, file),
            name: file
          }));
      }
      
      if (files.length === 0) {
        return res.status(404).send('No hay imágenes en esta zona');
      }
      
      files.forEach(file => {
        archive.file(file.filePath, { name: file.name });
      });
      
      archive.finalize();
    } catch (error) {
      console.error('Error leyendo zona:', error);
      res.status(500).send('Error al acceder a las imágenes de la zona');
    }
  });

  // Endpoint para eliminar una imagen específica
  app.delete('/delete/image', (req, res) => {
    const { filename, zona } = req.body;
    
    if (!filename || !zona) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: filename y zona'
      });
    }
    
    try {
      let imagePath;
      
      if (zona === 'sin_zona') {
        imagePath = path.join(__dirname, 'uploads', filename);
      } else {
        imagePath = path.join(__dirname, 'uploads', zona, filename);
      }
      
      // Verificar que el archivo existe
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({
          success: false,
          message: 'La imagen no existe'
        });
      }
      
      // Eliminar el archivo
      fs.unlinkSync(imagePath);
      
      console.log(`🗑️ Imagen eliminada: ${filename} de ${zona}`);
      
      res.json({
        success: true,
        message: `Imagen ${filename} eliminada exitosamente`,
        filename: filename,
        zona: zona
      });
      
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al eliminar la imagen'
      });
    }
  });

  // Endpoint para eliminar todas las imágenes de una zona
  app.delete('/delete/zone', (req, res) => {
    const { zona } = req.body;
    
    if (!zona) {
      return res.status(400).json({
        success: false,
        message: 'Falta el parámetro requerido: zona'
      });
    }
    
    try {
      let zonePath;
      let deletedFiles = [];
      
      if (zona === 'sin_zona') {
        // Eliminar imágenes en el directorio raíz
        const uploadsDir = path.join(__dirname, 'uploads');
        const files = fs.readdirSync(uploadsDir);
        
        files.forEach(file => {
          if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)) {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
              fs.unlinkSync(filePath);
              deletedFiles.push(file);
            }
          }
        });
      } else {
        // Eliminar zona específica
        zonePath = path.join(__dirname, 'uploads', zona);
        
        if (!fs.existsSync(zonePath)) {
          return res.status(404).json({
            success: false,
            message: 'La zona no existe'
          });
        }
        
        const files = fs.readdirSync(zonePath);
        
        files.forEach(file => {
          if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)) {
            const filePath = path.join(zonePath, file);
            fs.unlinkSync(filePath);
            deletedFiles.push(file);
          }
        });
        
        // Eliminar el directorio si está vacío
        try {
          const remainingFiles = fs.readdirSync(zonePath);
          if (remainingFiles.length === 0) {
            fs.rmdirSync(zonePath);
            console.log(`📁 Directorio eliminado: ${zona}`);
          }
        } catch (error) {
          console.log(`⚠️ No se pudo eliminar el directorio ${zona}:`, error.message);
        }
      }
      
      console.log(`🗑️ Zona eliminada: ${zona} - ${deletedFiles.length} archivos eliminados`);
      
      res.json({
        success: true,
        message: `Zona ${zona} eliminada exitosamente. ${deletedFiles.length} imágenes eliminadas.`,
        zona: zona,
        deletedFiles: deletedFiles,
        count: deletedFiles.length
      });
      
    } catch (error) {
      console.error('Error eliminando zona:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al eliminar la zona'
      });
    }
  });


  app.listen(port, () => {
    console.log(picocolors.green(`Server is running on port ${port}`));
    console.log(picocolors.green(`http://127.0.0.1:${port}`));
  });
} catch (error) {
  console.log(picocolors.red(`Error: ${error}`));
}

