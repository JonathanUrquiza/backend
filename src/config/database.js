// Configuración de Sequelize con SQLite
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();
const pc = require('picocolors');

// Configurar la ruta para la base de datos SQLite
const DATABASE_FILE = process.env.DATABASE_PATH || './elecciones.db';

// El archivo de base de datos se creará automáticamente cuando se conecte por primera vez

// Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
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

// Función para probar la conexión con Sequelize
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(pc.green('✅ Conexión a SQLite exitosa con Sequelize'));
        console.log(pc.cyan(`📊 Base de datos: ${DATABASE_FILE}`));
        
        // Verificar si el archivo de base de datos existe
        if (fs.existsSync(DATABASE_FILE)) {
            const stats = fs.statSync(DATABASE_FILE);
            console.log(pc.cyan(`📦 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`));
        } else {
            console.log(pc.yellow('📝 Base de datos será creada en la primera ejecución'));
        }
        
        return true;
    } catch (error) {
        console.error(pc.red('❌ Error conectando a SQLite con Sequelize:'), error.message);
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
    DATABASE_FILE      // Ruta del archivo de base de datos
};