// Importar las funciones necesarias desde el módulo de configuración de base de datos
const { testConnection, query, closeConnection } = require('../config/database');

// Función principal para realizar una prueba completa de conexión a la base de datos
async function testDatabaseConnection() {
    // Mostrar mensaje inicial de inicio de pruebas
    console.log('🔍 Iniciando prueba de conexión a la base de datos...\n');
    
    // Verificar que todas las variables de entorno requeridas estén configuradas
    console.log('📋 Verificando variables de entorno:');
    // Array con los nombres de las variables de entorno obligatorias para la conexión
    const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    // Array para almacenar las variables que no estén definidas
    const missingVars = [];
    
    // Iterar por cada variable requerida para verificar su existencia
    requiredVars.forEach(varName => {
        // Obtener el valor de la variable de entorno actual
        const value = process.env[varName];
        // Si la variable no está definida o está vacía
        if (!value) {
            // Mostrar mensaje de error y agregar a la lista de faltantes
            console.log(`❌ ${varName}: NO DEFINIDA`);
            missingVars.push(varName);
        } else {
            // Si la variable existe, mostrarla (ocultando la contraseña por seguridad)
            const displayValue = varName === 'DB_PASSWORD' ? '***' : value;
            console.log(`✅ ${varName}: ${displayValue}`);
        }
    });
    
    // Si hay variables faltantes, mostrar instrucciones y terminar la prueba
    if (missingVars.length > 0) {
        // Mostrar cuántas variables faltan y cómo crear el archivo .env
        console.log(`\n❌ Faltan ${missingVars.length} variables de entorno. Crea un archivo .env con:`);
        // Listar cada variable faltante con el formato necesario
        missingVars.forEach(varName => {
            console.log(`   ${varName}=tu_valor_aqui`);
        });
        // Referir al archivo de documentación para más ayuda
        console.log('\nVe el archivo CONFIGURACION_DB.md para más detalles.\n');
        // Salir de la función sin continuar con las pruebas
        return;
    }
    
    // Si todas las variables están presentes, continuar con la prueba de conexión
    console.log('\n🔗 Intentando conexión a la base de datos...\n');
    
    // Llamar a la función testConnection del módulo database para probar conectividad
    const connectionSuccess = await testConnection();
    
    // Si la conexión básica fue exitosa, ejecutar consultas adicionales de diagnóstico
    if (connectionSuccess) {
        console.log('\n🧪 Ejecutando consultas de prueba...\n');
        
        try {
            // Ejecutar consulta SQL para obtener la versión del servidor MySQL
            const serverInfo = await query('SELECT VERSION() as version');
            // Mostrar la versión del servidor (primer resultado, campo 'version')
            console.log('📝 Versión de MySQL:', serverInfo[0].version);
            
            // Ejecutar consulta para obtener la fecha y hora actual del servidor
            const dateTime = await query('SELECT NOW() as current_time');
            // Mostrar la fecha/hora del servidor para verificar zona horaria
            console.log('⏰ Fecha/hora del servidor:', dateTime[0].current_time);
            
            // Intentar listar las bases de datos disponibles (puede fallar por permisos)
            try {
                // Ejecutar comando SHOW DATABASES para ver todas las bases disponibles
                const databases = await query('SHOW DATABASES');
                console.log('🗄️  Bases de datos disponibles:');
                // Iterar y mostrar cada base de datos encontrada
                databases.forEach(db => {
                    console.log(`   - ${db.Database}`);
                });
            } catch (error) {
                // Si no hay permisos para ver bases de datos, mostrar mensaje informativo
                console.log('ℹ️  No se pudieron listar las bases de datos (permisos limitados)');
            }
            
            // Intentar mostrar las tablas existentes en la base de datos actual
            try {
                // Ejecutar SHOW TABLES para listar todas las tablas de la BD actual
                const tables = await query('SHOW TABLES');
                console.log('📋 Tablas en la base de datos actual:');
                // Verificar si existen tablas
                if (tables.length > 0) {
                    // Iterar por cada tabla encontrada
                    tables.forEach(table => {
                        // Extraer el nombre de la tabla (primer valor del objeto)
                        const tableName = Object.values(table)[0];
                        console.log(`   - ${tableName}`);
                    });
                } else {
                    // Si no hay tablas, mostrar mensaje informativo
                    console.log('   (No hay tablas en la base de datos)');
                }
            } catch (error) {
                // Si hay error accediendo a las tablas, mostrar el mensaje de error
                console.log('⚠️  Error al mostrar tablas:', error.message);
            }
            
            // Mostrar mensaje de éxito si todas las consultas se ejecutaron correctamente
            console.log('\n✅ Todas las pruebas completadas exitosamente!');
            
        } catch (error) {
            // Si hay errores durante las consultas de prueba, mostrar el mensaje de error
            console.error('\n❌ Error durante las pruebas:', error.message);
        }
    } else {
        // Si la conexión básica falló, mostrar instrucciones para solucionarlo
        console.log('\n❌ La conexión falló. Verifica tu configuración en el archivo .env');
        console.log('\n📋 Variables de entorno requeridas:');
        // Listar todas las variables necesarias para la conexión
        console.log('   - DB_HOST');
        console.log('   - DB_PORT');
        console.log('   - DB_USER');
        console.log('   - DB_PASSWORD');
        console.log('   - DB_NAME');
    }
    
    // Cerrar todas las conexiones del pool de forma limpia
    await closeConnection();
    // Mostrar mensaje final confirmando que la prueba terminó
    console.log('\n🏁 Prueba de conexión finalizada.');
}

// Ejecutar la función principal y capturar cualquier error no manejado
testDatabaseConnection().catch(error => {
    // Si hay un error crítico no capturado, mostrarlo y terminar el proceso
    console.error('💥 Error crítico:', error);
    // Salir del proceso con código de error (1 = error)
    process.exit(1);
});
