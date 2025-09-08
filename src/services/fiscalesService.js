const { 
    fiscalesModel, 
    getFiscalById, 
    createFiscal, 
    updateFiscal 
} = require('../model/fiscalesModel');

// Obtener todos los fiscales activos
const getAllFiscales = async () => {
    try {
        return await fiscalesModel();
    } catch (error) {
        console.error('Error en getAllFiscales service:', error);
        throw new Error('Error al obtener la lista de fiscales');
    }
};

// Obtener un fiscal específico por ID
const getFiscalByIdService = async (id) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID de fiscal inválido');
        }
        
        const fiscal = await getFiscalById(id);
        
        if (!fiscal) {
            throw new Error('Fiscal no encontrado');
        }
        
        return fiscal;
    } catch (error) {
        console.error('Error en getFiscalByIdService:', error);
        throw error;
    }
};

// Crear un nuevo fiscal
const createFiscalService = async (fiscalData) => {
    try {
        // Validar datos requeridos
        const { habitante_id, email, password } = fiscalData;
        
        if (!habitante_id || !email || !password) {
            throw new Error('Faltan datos requeridos: habitante_id, email, password');
        }
        
        return await createFiscal(fiscalData);
    } catch (error) {
        console.error('Error en createFiscalService:', error);
        throw error;
    }
};

// Actualizar un fiscal existente
const updateFiscalService = async (id, fiscalData) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID de fiscal inválido');
        }
        
        return await updateFiscal(id, fiscalData);
    } catch (error) {
        console.error('Error en updateFiscalService:', error);
        throw error;
    }
};

// Función para buscar fiscales por zona
const getFiscalesByZona = async (numeroZona) => {
    try {
        const { Fiscal, Zona, Institucion } = require('../model/index');
        
        const fiscales = await Fiscal.findAll({
            include: [
                {
                    model: Zona,
                    as: 'zonaInfo',
                    required: true,
                    where: {
                        numero_zona: numeroZona
                    }
                },
                {
                    model: Institucion,
                    as: 'institucionInfo',
                    required: false
                }
            ]
        });
        
        return fiscales;
    } catch (error) {
        console.error('Error en getFiscalesByZona:', error);
        throw new Error('Error al obtener fiscales por zona');
    }
};

module.exports = {
    getAllFiscales,
    getFiscalByIdService,
    createFiscalService,
    updateFiscalService,
    getFiscalesByZona
};