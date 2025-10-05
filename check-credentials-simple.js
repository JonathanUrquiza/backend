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

        console.log('✅ Conexión a la base de datos exitosa\n');

        // Consultar administradores
        console.log('=== ADMINISTRADORES ===');
        const [admins] = await connection.execute(
            'SELECT * FROM administradores ORDER BY id LIMIT 5'
        );
        admins.forEach(a => {
            console.log(`ID: ${a.id} | Email: ${a.email}`);
        });
        console.log(`Total: ${admins.length} administradores\n`);

        // Consultar fiscales
        console.log('=== FISCALES ===');
        const [fiscales] = await connection.execute(
            'SELECT * FROM fiscal ORDER BY id LIMIT 10'
        );
        fiscales.forEach(f => {
            console.log(`ID: ${f.id} | Email: ${f.email} | Tipo: ${f.tipo_fiscal || 'N/A'}`);
        });
        console.log(`Total: ${fiscales.length} fiscales (mostrando primeros 10)\n`);

        console.log('=== CONTRASEÑAS CONFIGURADAS (según set-simple-passwords.js) ===');
        console.log('Admin: admin123');
        console.log('Fiscal General: general123');
        console.log('Fiscal Zona: zona123');
        console.log('Fiscal Regular: fiscal123');

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
