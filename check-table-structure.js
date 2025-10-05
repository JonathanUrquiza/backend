const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Conexión exitosa\n');

        // Estructura de administradores
        console.log('=== ESTRUCTURA TABLA: administradores ===');
        const [adminCols] = await connection.execute('DESCRIBE administradores');
        adminCols.forEach(col => {
            console.log(`- ${col.Field} (${col.Type}) ${col.Key ? '[' + col.Key + ']' : ''}`);
        });

        console.log('\n=== ESTRUCTURA TABLA: fiscal ===');
        const [fiscalCols] = await connection.execute('DESCRIBE fiscal');
        fiscalCols.forEach(col => {
            console.log(`- ${col.Field} (${col.Type}) ${col.Key ? '[' + col.Key + ']' : ''}`);
        });

        // Verificar si hay un fiscal general
        console.log('\n=== BUSCANDO FISCAL GENERAL ===');
        const [generals] = await connection.execute(
            "SELECT id, email, nombre, tipo FROM fiscal WHERE email LIKE '%general%' OR nombre LIKE '%general%' OR tipo = 'general' LIMIT 5"
        );
        if (generals.length > 0) {
            generals.forEach(g => {
                console.log(`ID: ${g.id} | Email: ${g.email} | Nombre: ${g.nombre} | Tipo: ${g.tipo || 'N/A'}`);
            });
        } else {
            console.log('❌ No se encontró ningún fiscal general');
        }

        // Verificar si hay un fiscal de zona
        console.log('\n=== BUSCANDO FISCAL DE ZONA ===');
        const [zonas] = await connection.execute(
            "SELECT id, email, nombre, tipo FROM fiscal WHERE email LIKE '%zona%' OR tipo = 'zona' LIMIT 5"
        );
        if (zonas.length > 0) {
            zonas.forEach(z => {
                console.log(`ID: ${z.id} | Email: ${z.email} | Nombre: ${z.nombre} | Tipo: ${z.tipo || 'N/A'}`);
            });
        } else {
            console.log('❌ No se encontró ningún fiscal de zona');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
