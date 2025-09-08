const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ciudad = sequelize.define('ciudades', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provincia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'provincias',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre de la ciudad no puede estar vacío'
            }
        }
    }
}, {
    tableName: 'ciudades',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['provincia_id', 'nombre']
        },
        {
            fields: ['provincia_id']
        }
    ]
});

module.exports = Ciudad;
