const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Administrador = sequelize.define('administrador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacío'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    rol: {
        type: DataTypes.STRING,
        defaultValue: 'admin',
        allowNull: false,
        validate: {
            isIn: [['super_admin', 'admin', 'moderador']]
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    ultimo_acceso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    creado_por: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'administradores',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['rol']
        },
        {
            fields: ['activo']
        }
    ]
});

module.exports = Administrador;
