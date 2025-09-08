// Modelos básicos
const Fiscal = require('./Fiscal');
const Administrador = require('./Administrador');
const Institucion = require('./Institucion');

// Definir relaciones
const defineAssociations = () => {
    // Un fiscal pertenece a una institución
    Fiscal.belongsTo(Institucion, {
        foreignKey: 'institucion_id',
        as: 'institucionData'
    });
    
    // Una institución tiene muchos fiscales
    Institucion.hasMany(Fiscal, {
        foreignKey: 'institucion_id',
        as: 'fiscales'
    });
    
    // Relación de fiscal general asignado (self-referencing)
    Fiscal.belongsTo(Fiscal, {
        foreignKey: 'fiscal_general_asignado',
        as: 'fiscalGeneral'
    });
    
    Fiscal.hasMany(Fiscal, {
        foreignKey: 'fiscal_general_asignado',
        as: 'fiscalesAsignados'
    });
};

// Ejecutar definición de relaciones
defineAssociations();

// Exportar modelos
module.exports = {
    Fiscal,
    Administrador,
    Institucion
};