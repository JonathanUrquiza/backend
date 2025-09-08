// Lógica que trae todos los fiscales de la base de datos usando Sequelize
const { Fiscal, Zona, Institucion, Sesion } = require('./index');

const fiscalesModel = async () => {
    try {
        const fiscales = await Fiscal.findAll({
            include: [
                {
                    model: Zona,
                    as: 'zonaInfo',
                    required: false // LEFT JOIN para incluir fiscales sin zona asignada
                },
                {
                    model: Institucion,
                    as: 'institucionInfo',
                    required: false // LEFT JOIN para incluir fiscales sin institución asignada
                },
                {
                    model: Sesion,
                    as: 'sesiones',
                    required: false,
                    where: {
                        activa: true
                    },
                    limit: 1,
                    order: [['creada_en', 'DESC']]
                }
            ],
            order: [['id', 'DESC']]
        });
        
        return fiscales;
    } catch (error) {
        console.error('Error en fiscalesModel:', error);
        throw error;
    }
};

// Función para obtener un fiscal por ID
const getFiscalById = async (id) => {
    try {
        const fiscal = await Fiscal.findByPk(id, {
            include: [
                {
                    model: Zona,
                    as: 'zonaInfo',
                    required: false
                },
                {
                    model: Institucion,
                    as: 'institucionInfo',
                    required: false
                },
                {
                    model: Sesion,
                    as: 'sesiones',
                    required: false,
                    where: {
                        activa: true
                    },
                    order: [['creada_en', 'DESC']]
                }
            ]
        });
        
        return fiscal;
    } catch (error) {
        console.error('Error en getFiscalById:', error);
        throw error;
    }
};

// Función para crear un nuevo fiscal
const createFiscal = async (fiscalData) => {
    try {
        const nuevoFiscal = await Fiscal.create(fiscalData);
        return nuevoFiscal;
    } catch (error) {
        console.error('Error en createFiscal:', error);
        throw error;
    }
};

// Función para actualizar un fiscal
const updateFiscal = async (id, fiscalData) => {
    try {
        const [updatedRows] = await Fiscal.update(fiscalData, {
            where: { id }
        });
        
        if (updatedRows === 0) {
            throw new Error('Fiscal no encontrado');
        }
        
        return await getFiscalById(id);
    } catch (error) {
        console.error('Error en updateFiscal:', error);
        throw error;
    }
};

module.exports = {
    fiscalesModel,
    getFiscalById,
    createFiscal,
    updateFiscal
};