const express = require("express");
const router = express.Router();
const { requireAuth } = require("../controller/authController");

// Rutas para actas - Solo galería (protegida)
router.get("/", requireAuth, (req, res) => {
    // Mostrar galería de imágenes organizadas por zona
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads');
    
    let zonesData = {};
    let totalImages = 0;
    
    try {
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
        
        // También buscar imágenes sueltas en el directorio principal (compatibilidad)
        const rootFiles = fs.readdirSync(uploadsDir);
        const rootImages = rootFiles
            .filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file))
            .map(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                
                return {
                    filename: file,
                    path: `/uploads/${file}`,
                    uploadedAt: stats.mtime,
                    usuario: 'Sin clasificar'
                };
            })
            .sort((a, b) => b.uploadedAt - a.uploadedAt);
        
        if (rootImages.length > 0) {
            zonesData['sin_zona'] = {
                displayName: 'Sin Zona Asignada',
                images: rootImages,
                count: rootImages.length
            };
            totalImages += rootImages.length;
        }
        
    } catch (error) {
        console.log('No se pudo leer el directorio uploads:', error.message);
    }
    
    res.render("gallery", {
        view: {
            title: "Galería de Imágenes por Zona"
        },
        zonesData: zonesData,
        totalImages: totalImages
    });
});

module.exports = router;
