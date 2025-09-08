const picocolors = require("picocolors");
const { getAllFiscales } = require("../services/fiscalesService");
const { Fiscal, Institucion, FiscalGeneral, Presentismo } = require("../model/index");

module.exports = {
    fiscales: async (req, res) => {
        try {
            const fiscalLogueado = req.fiscal;
            
            if (!fiscalLogueado) {
                return res.redirect('/login');
            }

            // Obtener información completa del fiscal logueado
            const fiscalCompleto = await Fiscal.findByPk(fiscalLogueado.id, {
                include: [
                    {
                        model: require('../model/index').Zona,
                        as: 'zonaInfo',
                        required: false
                    },
                    {
                        model: require('../model/index').Institucion,
                        as: 'institucionInfo',
                        required: false
                    }
                ]
            });

            // Obtener información completa de la institución asignada
            let institucionCompleta = null;
            if (fiscalCompleto.institucion && fiscalCompleto.institucion !== 'Sin Asignar') {
                institucionCompleta = await Institucion.findOne({
                    where: {
                        nombre: fiscalCompleto.institucion
                    }
                });
            }

            // Buscar el fiscal general de esta institución
            let fiscalGeneral = null;
            if (institucionCompleta) {
                fiscalGeneral = await FiscalGeneral.findOne({
                    where: {
                        institucion: institucionCompleta.nombre
                    }
                });
            }

            res.render("fiscales-personal", {
                view: {
                    title: "Mi Panel de Fiscal - Sistema de Fiscalización", 
                    description: "Panel personal del fiscal con control de presentismo",
                    keywords: "fiscal, presentismo, panel, personal",
                    author: "Sistema Monolito",
                    year: new Date().getFullYear()
                },
                fiscal: fiscalCompleto,
                institucion: institucionCompleta,
                fiscalGeneral: fiscalGeneral
            });
        } catch (error) {
            console.error('Error en controlador fiscales:', error);
            res.status(500).render("error", {
                view: {
                    title: "Error - Sistema de Fiscalización",
                    description: "Error interno del servidor",
                    keywords: "error, servidor",
                    author: "Sistema Monolito",
                    year: new Date().getFullYear()
                },
                error: "Error al cargar tu información personal"
            });
        }
    },
    instituciones: (req, res) => {
        console.log(picocolors.blue("Consultando instituciones"));
        res.send("Lista de Instituciones - Próximamente");
    },
    zonas: (req, res) => {
        console.log(picocolors.blue("Consultando zonas"));
        res.send("Lista de Zonas Electorales - Próximamente");
    },

    // Creación de entidades (POST)
    fiscalUp: (req, res) => {
        console.log(picocolors.green("Creando nuevo fiscal"));
        const { nombre, dni, telefono } = req.body;
        console.log({ nombre, dni, telefono });
        res.json({ 
            message: "Fiscal creado exitosamente", 
            data: { nombre, dni, telefono }
        });
    },
    institucionUp: (req, res) => {
        console.log(picocolors.green("Creando nueva institución"));
        const { nombre, direccion, tipo } = req.body;
        console.log({ nombre, direccion, tipo });
        res.json({ 
            message: "Institución creada exitosamente", 
            data: { nombre, direccion, tipo }
        });
    },
    zonaUp: (req, res) => {
        console.log(picocolors.green("Creando nueva zona"));
        const { nombre, numero, distrito } = req.body;
        console.log({ nombre, numero, distrito });
        res.json({ 
            message: "Zona creada exitosamente", 
            data: { nombre, numero, distrito }
        });
    },

    // Asignaciones (POST)
    fiscalInstitucionUp: (req, res) => {
        console.log(picocolors.yellow("Asignando institución a fiscal"));
        const { fiscalId, institucionId } = req.body;
        console.log({ fiscalId, institucionId });
        res.json({ 
            message: "Institución asignada al fiscal exitosamente",
            data: { fiscalId, institucionId }
        });
    },
    fiscalZonaUp: (req, res) => {
        console.log(picocolors.yellow("Asignando zona a fiscal"));
        const { fiscalId, zonaId } = req.body;
        console.log({ fiscalId, zonaId });
        res.json({ 
            message: "Zona asignada al fiscal exitosamente",
            data: { fiscalId, zonaId }
        });
    },
    institucionZonaUp: (req, res) => {
        console.log(picocolors.yellow("Asignando zona a institución"));
        const { institucionId, zonaId } = req.body;
        console.log({ institucionId, zonaId });
        res.json({ 
            message: "Zona asignada a la institución exitosamente",
            data: { institucionId, zonaId }
        });
    },
    zonaInstitucionUp: (req, res) => {
        console.log(picocolors.yellow("Asignando institución a zona"));
        const { zonaId, institucionId } = req.body;
        console.log({ zonaId, institucionId });
        res.json({ 
            message: "Institución asignada a la zona exitosamente",
            data: { zonaId, institucionId }
        });
    },

    // Nueva función para marcar presentismo
    marcarPresente: async (req, res) => {
        try {
            const fiscalLogueado = req.fiscal;
            const { latitud, longitud } = req.body;

            if (!fiscalLogueado) {
                return res.status(401).json({
                    success: false,
                    message: 'No estás autenticado'
                });
            }

            if (!latitud || !longitud) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan coordenadas de ubicación'
                });
            }

            // Obtener información completa del fiscal
            const fiscal = await Fiscal.findByPk(fiscalLogueado.id);
            
            if (!fiscal.institucion || fiscal.institucion === 'Sin Asignar') {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes una institución asignada'
                });
            }

            // Obtener información de la institución
            const institucion = await Institucion.findOne({
                where: { nombre: fiscal.institucion }
            });

            if (!institucion) {
                return res.status(400).json({
                    success: false,
                    message: 'No se encontró información de tu institución'
                });
            }

            if (!institucion.latitud || !institucion.longitud) {
                return res.status(400).json({
                    success: false,
                    message: 'Tu institución no tiene coordenadas configuradas'
                });
            }

            // Calcular distancia usando fórmula de Haversine
            const distancia = calcularDistancia(
                parseFloat(latitud), 
                parseFloat(longitud),
                parseFloat(institucion.latitud),
                parseFloat(institucion.longitud)
            );

            const RADIO_PERMITIDO = 50; // 50 metros
            const esValido = distancia <= RADIO_PERMITIDO;

            // Obtener dirección legible (simulada por ahora)
            const direccion = await obtenerDireccion(latitud, longitud);

            // Guardar registro de presentismo
            const presentismo = await Presentismo.create({
                fiscal_id: fiscal.id,
                fecha_hora: new Date(),
                latitud: parseFloat(latitud),
                longitud: parseFloat(longitud),
                direccion: direccion,
                validado: esValido,
                distancia_metros: distancia,
                institucion_asignada: institucion.nombre,
                direccion_institucion: institucion.direccion,
                observaciones: esValido ? 'Presentismo válido' : `Fuera del radio permitido (${RADIO_PERMITIDO}m)`
            });

            if (esValido) {
                console.log(picocolors.green(`✅ Presentismo válido: ${fiscal.nombre} - Distancia: ${distancia.toFixed(2)}m`));
                return res.json({
                    success: true,
                    message: 'Presente marcado exitosamente',
                    direccion: direccion,
                    distancia: Math.round(distancia),
                    presentismo_id: presentismo.id
                });
            } else {
                console.log(picocolors.yellow(`⚠️ Presentismo inválido: ${fiscal.nombre} - Distancia: ${distancia.toFixed(2)}m`));
                return res.status(400).json({
                    success: false,
                    message: 'Debes estar en tu institución asignada para marcar presente',
                    direccion: direccion,
                    distancia: Math.round(distancia),
                    institucion: institucion.nombre,
                    direccion_institucion: institucion.direccion
                });
            }

        } catch (error) {
            console.error('Error al marcar presente:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

// Función auxiliar para calcular distancia entre dos coordenadas GPS (Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI/180; // φ, λ en radianes
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // en metros
    return distance;
}

// Función auxiliar para obtener dirección legible (placeholder)
async function obtenerDireccion(lat, lng) {
    // Por ahora retorna las coordenadas, luego se puede integrar con API de geocoding
    return `Lat: ${parseFloat(lat).toFixed(6)}, Lng: ${parseFloat(lng).toFixed(6)}`;
}