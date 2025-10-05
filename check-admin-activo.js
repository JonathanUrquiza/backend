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

        // Verificar ambos admins
        console.log('=== VERIFICANDO ADMINISTRADORES ===\n');
        
        const [admins] = await connection.execute(
            'SELECT id, email, nombre, rol, activo FROM administradores ORDER BY id'
        );
        
        admins.forEach(admin => {
            console.log(`ID: ${admin.id}`);
            console.log(`Email: ${admin.email}`);
            console.log(`Nombre: ${admin.nombre}`);
            console.log(`Rol: ${admin.rol}`);
            console.log(`Activo: ${admin.activo} ${admin.activo === 1 ? '✅' : '❌'}`);
            console.log('---');
        });

        // Si jourquiza86@hotmail.com no está activo, activarlo
        const [jourquiza] = await connection.execute(
            'SELECT id, email, activo FROM administradores WHERE email = ?',
            ['jourquiza86@hotmail.com']
        );

        if (jourquiza.length > 0 && jourquiza[0].activo !== 1) {
            console.log('\n⚠️ jourquiza86@hotmail.com NO está activo, activando...');
            await connection.execute(
                'UPDATE administradores SET activo = 1 WHERE email = ?',
                ['jourquiza86@hotmail.com']
            );
            console.log('✅ Usuario activado correctamente');
        } else if (jourquiza.length > 0) {
            console.log('\n✅ jourquiza86@hotmail.com ya está activo');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
