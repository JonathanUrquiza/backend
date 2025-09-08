const { query, testConnection, closeConnection } = require('../config/database');
const picocolors = require('picocolors');

// Consultas de prueba para verificar datos
const testQueries = {
    // Obtener todas las zonas
    getAllZones: async () => {
        console.log(picocolors.cyan('\n🗺️  Consultando todas las zonas...'));
        const zones = await query('SELECT * FROM zonas ORDER BY numero_zona');
        console.log(picocolors.green(`✅ Encontradas ${zones.length} zonas`));
        zones.forEach(zone => {
            console.log(`   ${zone.numero_zona}: ${zone.nombre} (Activa: ${zone.activa ? 'Sí' : 'No'})`);
        });
        return zones;
    },

    // Obtener todas las instituciones
    getAllInstitutions: async () => {
        console.log(picocolors.cyan('\n🏢 Consultando todas las instituciones...'));
        const institutions = await query('SELECT * FROM instituciones ORDER BY nombre');
        console.log(picocolors.green(`✅ Encontradas ${institutions.length} instituciones`));
        institutions.forEach(inst => {
            console.log(`   • ${inst.nombre} (${inst.tipo}) - ${inst.direccion || 'Sin dirección'}`);
        });
        return institutions;
    },

    // Obtener todos los fiscales
    getAllFiscals: async () => {
        console.log(picocolors.cyan('\n👥 Consultando todos los fiscales...'));
        const fiscals = await query('SELECT * FROM fiscales ORDER BY nombre, apellido');
        console.log(picocolors.green(`✅ Encontrados ${fiscals.length} fiscales`));
        fiscals.forEach(fiscal => {
            console.log(`   • ${fiscal.nombre} ${fiscal.apellido} (Doc: ${fiscal.documento || 'N/A'})`);
        });
        return fiscals;
    },

    // Obtener relaciones zona-institución
    getZoneInstitutions: async () => {
        console.log(picocolors.cyan('\n🔗 Consultando relaciones zona-institución...'));
        const relations = await query(`
            SELECT 
                z.numero_zona,
                z.nombre as zona_nombre,
                i.nombre as institucion_nombre,
                i.tipo as institucion_tipo,
                zi.fecha_asignacion
            FROM zona_instituciones zi
            INNER JOIN zonas z ON zi.zona_id = z.id
            INNER JOIN instituciones i ON zi.institucion_id = i.id
            WHERE zi.activa = TRUE
            ORDER BY z.numero_zona, i.nombre
        `);
        console.log(picocolors.green(`✅ Encontradas ${relations.length} relaciones activas`));
        relations.forEach(rel => {
            console.log(`   Zona ${rel.numero_zona}: ${rel.institucion_nombre} (${rel.institucion_tipo})`);
        });
        return relations;
    },

    // Obtener resumen por zona
    getZoneSummary: async () => {
        console.log(picocolors.cyan('\n📊 Resumen por zona...'));
        const summary = await query(`
            SELECT 
                z.numero_zona,
                z.nombre as zona_nombre,
                COUNT(DISTINCT zi.institucion_id) as total_instituciones,
                COUNT(DISTINCT fz.fiscal_id) as total_fiscales,
                z.activa
            FROM zonas z
            LEFT JOIN zona_instituciones zi ON z.id = zi.zona_id AND zi.activa = TRUE
            LEFT JOIN fiscal_zonas fz ON z.id = fz.zona_id AND fz.activa = TRUE
            GROUP BY z.id, z.numero_zona, z.nombre, z.activa
            ORDER BY z.numero_zona
        `);
        
        console.log(picocolors.green(`✅ Resumen de ${summary.length} zonas:`));
        summary.forEach(zone => {
            const status = zone.activa ? '🟢' : '🔴';
            console.log(`   ${status} Zona ${zone.numero_zona}: ${zone.total_instituciones} instituciones, ${zone.total_fiscales} fiscales`);
        });
        return summary;
    },

    // Consultar estructura de tablas
    getTableStructure: async () => {
        console.log(picocolors.cyan('\n🔍 Verificando estructura de tablas...'));
        const tables = ['zonas', 'instituciones', 'fiscales', 'zona_instituciones', 'fiscal_zonas'];
        
        for (const table of tables) {
            try {
                const structure = await query(`DESCRIBE ${table}`);
                const count = await query(`SELECT COUNT(*) as total FROM ${table}`);
                console.log(picocolors.yellow(`\n📋 Tabla: ${table}`));
                console.log(picocolors.green(`   📊 Registros: ${count[0].total}`));
                console.log('   📝 Columnas:');
                structure.forEach(col => {
                    const key = col.Key ? ` [${col.Key}]` : '';
                    console.log(`      - ${col.Field}: ${col.Type}${key}`);
                });
            } catch (error) {
                console.log(picocolors.red(`   ❌ Error consultando tabla ${table}: ${error.message}`));
            }
        }
    },

    // Probar consultas específicas del sistema
    getSystemQueries: async () => {
        console.log(picocolors.cyan('\n🎯 Probando consultas del sistema...'));
        
        // 1. Zonas activas para el formulario
        const activeZones = await query('SELECT numero_zona, nombre FROM zonas WHERE activa = TRUE ORDER BY numero_zona');
        console.log(picocolors.green(`✅ Zonas activas para formulario: ${activeZones.length}`));

        // 2. Instituciones por zona
        const zonesWithInstitutions = await query(`
            SELECT 
                z.numero_zona, 
                z.nombre as zona_nombre,
                GROUP_CONCAT(i.nombre SEPARATOR ', ') as instituciones
            FROM zonas z
            LEFT JOIN zona_instituciones zi ON z.id = zi.zona_id AND zi.activa = TRUE
            LEFT JOIN instituciones i ON zi.institucion_id = i.id AND i.activa = TRUE
            GROUP BY z.id
            HAVING COUNT(i.id) > 0
            ORDER BY z.numero_zona
        `);
        console.log(picocolors.green(`✅ Zonas con instituciones: ${zonesWithInstitutions.length}`));
        
        // 3. Verificar integridad de datos
        const orphanInstitutions = await query(`
            SELECT COUNT(*) as total 
            FROM instituciones i 
            WHERE NOT EXISTS (
                SELECT 1 FROM zona_instituciones zi 
                WHERE zi.institucion_id = i.id AND zi.activa = TRUE
            ) AND i.activa = TRUE
        `);
        console.log(picocolors.green(`✅ Instituciones sin zona asignada: ${orphanInstitutions[0].total}`));

        return {
            activeZones,
            zonesWithInstitutions,
            orphanInstitutions: orphanInstitutions[0].total
        };
    }
};

// Función principal de pruebas
async function runTests() {
    console.log(picocolors.blue('\n🚀 INICIANDO PRUEBAS DE CONSULTAS DE BASE DE DATOS'));
    console.log(picocolors.blue('================================================\n'));

    try {
        // 1. Probar conexión
        const connected = await testConnection();
        if (!connected) {
            throw new Error('No se pudo conectar a la base de datos');
        }

        // 2. Ejecutar todas las pruebas
        await testQueries.getTableStructure();
        await testQueries.getAllZones();
        await testQueries.getAllInstitutions();
        await testQueries.getAllFiscals();
        await testQueries.getZoneInstitutions();
        await testQueries.getZoneSummary();
        await testQueries.getSystemQueries();

        console.log(picocolors.green('\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!'));
        console.log(picocolors.blue('================================================\n'));

    } catch (error) {
        console.error(picocolors.red('\n❌ ERROR EN LAS PRUEBAS:'), error.message);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await closeConnection();
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    runTests();
}

module.exports = {
    testQueries,
    runTests
};
