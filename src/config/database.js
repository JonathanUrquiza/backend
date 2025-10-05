// Configuración de Sequelize con soporte para SQLite y MySQL
const { Sequelize } = require('sequelize');
const fs = require('fs');
// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();
const pc = require('picocolors');

// Determinar el tipo de base de datos desde el entorno
const DB_TYPE = process.env.DB_TYPE || 'sqlite'; // 'sqlite' o 'mysql'

let sequelize;

if (DB_TYPE === 'mysql') {
    // Configuración para MySQL (AlwaysData o cualquier MySQL en la nube)
    const DB_HOST = process.env.DB_HOST || 'mysql-funkotest.alwaysdata.net';//modificado por el programador
    const DB_PORT = process.env.DB_PORT || 3306;//modificado por el programador
    const DB_NAME = process.env.DB_NAME || 'funkotest_fiscalizar';//modificado por el programador
    const DB_USER = process.env.DB_USER || 'funkotest';//modificado por el programador
    const DB_PASSWORD = process.env.DB_PASSWORD || 'rootJonas';//modificado por el programador

    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: false,
            freezeTableName: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            connectTimeout: 60000
        }
    });

    console.log(pc.cyan(`🔗 Configurando MySQL en: ${DB_HOST}:${DB_PORT}/${DB_NAME}`));
} else {
    // Configuración para SQLite (local)
    const DATABASE_FILE = process.env.DATABASE_PATH || './elecciones.db';

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_FILE,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: false,
            freezeTableName: true
        },
        dialectOptions: {
            // Habilitar foreign keys para SQLite
            options: {
                enableForeignKeyConstraints: true
            }
        }
    });

    console.log(pc.cyan(`🔗 Configurando SQLite: ${DATABASE_FILE}`));
}

// Función para probar la conexión con Sequelize
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        
        if (DB_TYPE === 'mysql') {
            console.log(pc.green('✅ Conexión a MySQL exitosa con Sequelize'));
            console.log(pc.cyan(`📊 Base de datos: ${process.env.DB_NAME} en ${process.env.DB_HOST}`));
        } else {
            console.log(pc.green('✅ Conexión a SQLite exitosa con Sequelize'));
            const DATABASE_FILE = process.env.DATABASE_PATH || './elecciones.db';
            console.log(pc.cyan(`📊 Base de datos: ${DATABASE_FILE}`));
            
            // Verificar si el archivo de base de datos existe
            if (fs.existsSync(DATABASE_FILE)) {
                const stats = fs.statSync(DATABASE_FILE);
                console.log(pc.cyan(`📦 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`));
            } else {
                console.log(pc.yellow('📝 Base de datos será creada en la primera ejecución'));
            }
        }
        
        return true;
    } catch (error) {
        console.error(pc.red(`❌ Error conectando a ${DB_TYPE.toUpperCase()} con Sequelize:`), error.message);
        return false;
    }
};

// Función para sincronizar modelos con la base de datos
const syncDatabase = async (options = {}) => {
    try {
        await sequelize.sync(options);
        console.log(pc.green('✅ Base de datos sincronizada correctamente'));
        return true;
    } catch (error) {
        console.error(pc.red('❌ Error sincronizando base de datos:'), error.message);
        return false;
    }
};

// Función para cerrar conexión
const closeConnection = async () => {
    try {
        await sequelize.close();
        console.log(pc.yellow('🔌 Conexión Sequelize cerrada'));
        return true;
    } catch (error) {
        console.error(pc.red('Error cerrando conexión Sequelize:'), error.message);
        return false;
    }
};

// Inicializar la conexión al cargar el módulo
testConnection();

// Export de instancia de Sequelize y funciones principales
module.exports = {
    sequelize,         // Instancia principal de Sequelize
    Sequelize,         // Constructor de Sequelize para tipos de datos
    testConnection,    // Función para verificar conectividad
    syncDatabase,      // Función para sincronizar modelos
    closeConnection,   // Función para cerrar conexión
    DB_TYPE            // Tipo de base de datos en uso
};