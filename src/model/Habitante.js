const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Habitante = sequelize.define('habitantes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comuna_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'comunas',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacío'
            },
            len: {
                args: [2, 255],
                msg: 'El nombre debe tener entre 2 y 255 caracteres'
            }
        }
    },
    apellido: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El apellido no puede estar vacío'
            },
            len: {
                args: [2, 255],
                msg: 'El apellido debe tener entre 2 y 255 caracteres'
            }
        }
    },
    dni: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El DNI no puede estar vacío'
            },
            is: {
                args: /^[0-9]{7,8}$/,
                msg: 'El DNI debe tener entre 7 y 8 dígitos'
            }
        }
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: 0,
                msg: 'La edad debe ser mayor o igual a 0'
            },
            max: {
                args: 120,
                msg: 'La edad debe ser menor o igual a 120'
            }
        }
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[\d\-\+\(\)\s]+$/,
                msg: 'El teléfono debe contener solo números, espacios, guiones, paréntesis y símbolo +'
            }
        }
    }
}, {
    tableName: 'habitantes',
    timestamps: false,
    hooks: {
        beforeSave: (habitante, options) => {
            // Limpiar y normalizar DNI (como el trigger original)
            if (habitante.dni) {
                habitante.dni = habitante.dni.toString().toUpperCase().replace(/\s+/g, '');
            }
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['dni']
        },
        {
            fields: ['comuna_id']
        },
        {
            fields: ['apellido', 'nombre']
        }
    ]
});

module.exports = Habitante;
