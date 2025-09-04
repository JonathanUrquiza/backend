const picocolors = require("picocolors");

module.exports = {
    // Consultas (GET)
    fiscales: (req, res) => {
        console.log(picocolors.blue("Consultando fiscales"));
        res.send("Lista de Fiscales - Próximamente");
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
    }
}