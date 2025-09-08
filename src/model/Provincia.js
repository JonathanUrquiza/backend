const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Provincia = sequelize.define('provincias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pais_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'paises',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre de la provincia no puede estar vacío'
            }
        }
    }
}, {
    tableName: 'provincias',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['pais_id', 'nombre']
        },
        {
            fields: ['pais_id']
        }
    ]
});

module.exports = Provincia;
