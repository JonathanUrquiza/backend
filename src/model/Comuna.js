const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comuna = sequelize.define('comunas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ciudad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ciudades',
            key: 'id'
        }
    },
    nombre_numerico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: 1,
                msg: 'El número de comuna debe ser mayor a 0'
            }
        }
    }
}, {
    tableName: 'comunas',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['ciudad_id', 'nombre_numerico']
        },
        {
            fields: ['ciudad_id']
        }
    ]
});

module.exports = Comuna;
