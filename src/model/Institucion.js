const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Institucion = sequelize.define('instituciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'El nombre de la institución no puede estar vacío'
            },
            len: {
                args: [2, 200],
                msg: 'El nombre debe tener entre 2 y 200 caracteres'
            }
        }
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección no puede estar vacía'
            }
        }
    },
    zona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: 1,
                msg: 'La zona debe ser mayor a 0'
            },
            max: {
                args: 15,
                msg: 'La zona debe ser menor o igual a 15'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^[\d\-\+\(\)\s]*$/,
                msg: 'El teléfono debe contener solo números, espacios, guiones, paréntesis y símbolo +'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    tipo: {
        type: DataTypes.ENUM('escuela', 'colegio', 'instituto', 'universidad', 'centro_votacion', 'otro'),
        allowNull: false,
        defaultValue: 'centro_votacion'
    },
    activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    capacidad_votantes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: 0,
                msg: 'La capacidad debe ser un número positivo'
            }
        }
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'instituciones',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    indexes: [
        {
            unique: true,
            fields: ['nombre']
        },
        {
            fields: ['zona']
        },
        {
            fields: ['tipo']
        },
        {
            fields: ['activa']
        }
    ]
});

module.exports = Institucion;
