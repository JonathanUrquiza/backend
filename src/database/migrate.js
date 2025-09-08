const fs = require('fs');
const path = require('path');
const { exec, testConnection } = require('../config/database');
const picocolors = require('picocolors');

async function runMigrations() {
    console.log(picocolors.blue('🚀 Iniciando migraciones de base de datos...'));
    
    try {
        // Probar conexión primero
        const connected = await testConnection();
        if (!connected) {
            throw new Error('No se pudo conectar a la base de datos');
        }

        // Obtener archivos de migración
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log(picocolors.yellow(`📁 Encontrados ${migrationFiles.length} archivos de migración`));

        // Ejecutar cada migración
        for (const file of migrationFiles) {
            console.log(picocolors.cyan(`🔧 Ejecutando migración: ${file}`));
            
            const filePath = path.join(migrationsDir, file);
            let sql = fs.readFileSync(filePath, 'utf8');
            
            // Limpiar comentarios pero mantener la estructura
            sql = sql.split('\n')
                .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
                .join('\n')
                .trim();
            
            // Ejecutar todo el SQL de una sola vez
            if (sql.length > 0) {
                await query(sql);
            }
            
            console.log(picocolors.green(`✅ Migración completada: ${file}`));
        }

        console.log(picocolors.green('🎉 Todas las migraciones ejecutadas exitosamente!'));
        
    } catch (error) {
        console.error(picocolors.red('❌ Error ejecutando migraciones:'), error.message);
        process.exit(1);
    }
}

async function runSeeds() {
    console.log(picocolors.blue('🌱 Iniciando seeds de base de datos...'));
    
    try {
        // Obtener archivos de seeds
        const seedsDir = path.join(__dirname, 'seeds');
        const seedFiles = fs.readdirSync(seedsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log(picocolors.yellow(`📁 Encontrados ${seedFiles.length} archivos de seeds`));

        // Ejecutar cada seed
        for (const file of seedFiles) {
            console.log(picocolors.cyan(`🌱 Ejecutando seed: ${file}`));
            
            const filePath = path.join(seedsDir, file);
            let sql = fs.readFileSync(filePath, 'utf8');
            
            // Limpiar comentarios pero mantener la estructura
            sql = sql.split('\n')
                .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
                .join('\n')
                .trim();
            
            // Ejecutar todo el SQL de una sola vez
            if (sql.length > 0) {
                await query(sql);
            }
            
            console.log(picocolors.green(`✅ Seed completado: ${file}`));
        }

        console.log(picocolors.green('🎉 Todos los seeds ejecutados exitosamente!'));
        
    } catch (error) {
        console.error(picocolors.red('❌ Error ejecutando seeds:'), error.message);
        process.exit(1);
    }
}

// Si se ejecuta directamente este archivo
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'migrate') {
        runMigrations().then(() => process.exit(0));
    } else if (command === 'seed') {
        runSeeds().then(() => process.exit(0));
    } else if (command === 'fresh') {
        runMigrations()
            .then(() => runSeeds())
            .then(() => process.exit(0));
    } else {
        console.log(picocolors.yellow('📖 Uso:'));
        console.log('  node src/database/migrate.js migrate  # Ejecutar solo migraciones');
        console.log('  node src/database/migrate.js seed     # Ejecutar solo seeds');
        console.log('  node src/database/migrate.js fresh    # Ejecutar migraciones + seeds');
        process.exit(0);
    }
}

module.exports = {
    runMigrations,
    runSeeds
};
