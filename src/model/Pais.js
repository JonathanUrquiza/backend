const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pais = sequelize.define('paises', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El nombre del país no puede estar vacío'
            }
        }
    },
    bandera: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'paises',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['nombre']
        }
    ]
});

module.exports = Pais;
