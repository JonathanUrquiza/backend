const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fiscal = sequelize.define('fiscal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.TEXT,
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
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    cel_num: {
        type: DataTypes.TEXT,
        field: 'cel-num', // mapea al nombre real de la columna
        allowNull: true,
        validate: {
            is: {
                args: /^[\d\-\+\(\)\s]*$/,
                msg: 'El teléfono debe contener solo números, espacios, guiones, paréntesis y símbolo +'
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
            }
        }
    },
    institucion: {
        type: DataTypes.TEXT,
        allowNull: true, // Temporal para migración
        validate: {
            notEmpty: {
                msg: 'La institución no puede estar vacía'
            }
        }
    },
    institucion_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Temporal, será NOT NULL después de la migración
        references: {
            model: 'instituciones',
            key: 'id'
        },
        comment: 'ID de la institución asignada al fiscal'
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    re_password: {
        type: DataTypes.TEXT,
        field: 're-password', // mapea al nombre real de la columna
        allowNull: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'fiscal',
        validate: {
            isIn: [['fiscal', 'fiscal_general', 'fiscal_zona']]
        }
    },
    fiscal_general_asignado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'fiscal',
            key: 'id'
        },
        comment: 'ID del fiscal general asignado a la institución de este fiscal'
    }
}, {
    tableName: 'fiscal',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['zona']
        },
        {
            fields: ['institucion']
        },
        {
            fields: ['nombre']
        },
        {
            fields: ['tipo']
        },
        {
            fields: ['fiscal_general_asignado']
        }
    ]
});

module.exports = Fiscal;
