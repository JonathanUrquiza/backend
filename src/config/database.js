// Configuración de Sequelize para MySQL
const { Sequelize } = require('sequelize');
// Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const pc = require('picocolors');

// Configuración para MySQL (AlwaysData)
const DB_HOST = process.env.DB_HOST || 'mysql-funkotest.alwaysdata.net';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || 'funkotest_fiscalizar';
const DB_USER = process.env.DB_USER || 'funkotest';
const DB_PASSWORD = process.env.DB_PASSWORD || 'rootJonas';

console.log(pc.blue('═══════════════════════════════════════════════════════'));
console.log(pc.blue('📦 CONFIGURACIÓN DE BASE DE DATOS MySQL'));
console.log(pc.blue('═══════════════════════════════════════════════════════'));
console.log(pc.cyan(`🔗 Host: ${DB_HOST}`));
console.log(pc.cyan(`🔗 Puerto: ${DB_PORT}`));
console.log(pc.cyan(`🔗 Base de datos: ${DB_NAME}`));
console.log(pc.cyan(`🔗 Usuario: ${DB_USER}`));
console.log(pc.cyan(`🔗 Password: ${'*'.repeat(DB_PASSWORD.length)}`));
console.log(pc.blue('═══════════════════════════════════════════════════════'));

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? 
        (sql) => console.log(pc.gray(`[SQL] ${sql}`)) : false,
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

console.log(pc.cyan(`✨ Instancia Sequelize creada correctamente`));

// Event listeners para monitorear el pool (se configuran después de la primera conexión)
const setupPoolListeners = () => {
    try {
        if (sequelize.connectionManager && sequelize.connectionManager.pool) {
            sequelize.connectionManager.pool.on('acquire', (connection) => {
                console.log(pc.green(`🔌 Conexión MySQL adquirida del pool (ID: ${connection.threadId})`));
            });

            sequelize.connectionManager.pool.on('release', (connection) => {
                console.log(pc.yellow(`🔌 Conexión MySQL liberada al pool (ID: ${connection.threadId})`));
            });

            sequelize.connectionManager.pool.on('error', (error) => {
                console.error(pc.red('═══════════════════════════════════════════════════════'));
                console.error(pc.red('❌ ERROR EN EL POOL DE CONEXIONES MySQL'));
                console.error(pc.red('═══════════════════════════════════════════════════════'));
                console.error(pc.red(`❌ Mensaje: ${error.message}`));
                console.error(pc.red(`❌ Código: ${error.code || 'N/A'}`));
                console.error(pc.gray(error.stack));
                console.error(pc.red('═══════════════════════════════════════════════════════\n'));
            });

            console.log(pc.cyan(`📊 Event listeners del pool configurados correctamente`));
        }
    } catch (error) {
        console.log(pc.yellow(`⚠️  No se pudieron configurar los listeners del pool: ${error.message}`));
    }
};

// Función para probar la conexión con Sequelize
const testConnection = async () => {
    console.log(pc.blue('\n🔍 Probando conexión a MySQL...'));
    try {
        const startTime = Date.now();
        await sequelize.authenticate();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(pc.green('═══════════════════════════════════════════════════════'));
        console.log(pc.green('✅ CONEXIÓN A MySQL EXITOSA'));
        console.log(pc.green('═══════════════════════════════════════════════════════'));
        console.log(pc.cyan(`📊 Base de datos: ${DB_NAME}`));
        console.log(pc.cyan(`🌐 Host: ${DB_HOST}:${DB_PORT}`));
        console.log(pc.cyan(`⏱️  Tiempo de conexión: ${duration}ms`));
        console.log(pc.cyan(`🔢 Pool máx: 5 conexiones`));
        console.log(pc.green('═══════════════════════════════════════════════════════\n'));
        
        return true;
    } catch (error) {
        console.error(pc.red('═══════════════════════════════════════════════════════'));
        console.error(pc.red('❌ ERROR CONECTANDO A MySQL'));
        console.error(pc.red('═══════════════════════════════════════════════════════'));
        console.error(pc.red(`❌ Mensaje: ${error.message}`));
        console.error(pc.red(`❌ Código: ${error.code || 'N/A'}`));
        console.error(pc.red(`❌ Host: ${DB_HOST}:${DB_PORT}`));
        console.error(pc.red(`❌ Base de datos: ${DB_NAME}`));
        console.error(pc.red(`❌ Usuario: ${DB_USER}`));
        
        if (error.original) {
            console.error(pc.red(`❌ Error original: ${error.original.message}`));
            console.error(pc.red(`❌ Código error original: ${error.original.code}`));
        }
        
        console.error(pc.red('\n📚 Stack trace:'));
        console.error(pc.gray(error.stack));
        console.error(pc.red('═══════════════════════════════════════════════════════\n'));
        
        return false;
    }
};

// Función para sincronizar modelos con la base de datos
const syncDatabase = async (options = {}) => {
    console.log(pc.blue('🔄 Iniciando sincronización de modelos...'));
    try {
        const startTime = Date.now();
        await sequelize.sync(options);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(pc.green('✅ Base de datos sincronizada correctamente'));
        console.log(pc.cyan(`⏱️  Tiempo de sincronización: ${duration}ms`));
        
        if (options.force) {
            console.log(pc.yellow('⚠️  Modo FORCE activado: todas las tablas fueron eliminadas y recreadas'));
        }
        if (options.alter) {
            console.log(pc.yellow('⚠️  Modo ALTER activado: las tablas fueron alteradas para coincidir con los modelos'));
        }
        
        return true;
    } catch (error) {
        console.error(pc.red('❌ Error sincronizando base de datos:'));
        console.error(pc.red(`   Mensaje: ${error.message}`));
        console.error(pc.red(`   Código: ${error.code || 'N/A'}`));
        
        if (error.original) {
            console.error(pc.red(`   Error original: ${error.original.message}`));
        }
        
        console.error(pc.gray(error.stack));
        return false;
    }
};

// Función para cerrar conexión
const closeConnection = async () => {
    console.log(pc.yellow('🔌 Cerrando conexión a MySQL...'));
    try {
        await sequelize.close();
        console.log(pc.green('✅ Conexión MySQL cerrada correctamente'));
        console.log(pc.cyan('   Todas las conexiones del pool han sido liberadas'));
        return true;
    } catch (error) {
        console.error(pc.red('❌ Error cerrando conexión MySQL:'));
        console.error(pc.red(`   Mensaje: ${error.message}`));
        console.error(pc.gray(error.stack));
        return false;
    }
};

// Inicializar la conexión al cargar el módulo
console.log(pc.blue('\n🚀 Inicializando módulo de base de datos...'));
testConnection().then((success) => {
    if (success) {
        // Configurar listeners del pool después de la primera conexión exitosa
        setupPoolListeners();
        console.log(pc.green('✨ Módulo de base de datos inicializado correctamente\n'));
    } else {
        console.log(pc.red('⚠️  Módulo de base de datos inicializado con errores\n'));
    }
});

// Export de instancia de Sequelize y funciones principales
module.exports = {
    sequelize,         // Instancia principal de Sequelize
    Sequelize,         // Constructor de Sequelize para tipos de datos
    testConnection,    // Función para verificar conectividad
    syncDatabase,      // Función para sincronizar modelos
    closeConnection    // Función para cerrar conexión
};