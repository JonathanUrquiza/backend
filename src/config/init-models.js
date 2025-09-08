// Inicialización de modelos y relaciones de Sequelize
const pc = require('picocolors');

// Función para inicializar todos los modelos y sus relaciones
const initModels = () => {
    try {
        console.log(pc.blue('🔄 Inicializando modelos de Sequelize...'));
        
        // Importar todos los modelos (esto configurará las relaciones)
        const models = require('../model/index');
        
        // Verificar que los modelos se importaron correctamente
        const modelNames = Object.keys(models);
        console.log(pc.cyan(`📋 Modelos cargados: ${modelNames.join(', ')}`));
        
        console.log(pc.green('✅ Modelos de Sequelize inicializados correctamente'));
        return true;
    } catch (error) {
        console.error(pc.red('❌ Error inicializando modelos:'), error.message);
        console.error(pc.red('Stack trace:'), error.stack);
        return false;
    }
};

module.exports = {
    initModels
};
