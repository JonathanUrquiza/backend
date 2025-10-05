const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

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

        // Verificar jourquiza86@hotmail.com
        console.log('=== VERIFICANDO: jourquiza86@hotmail.com ===');
        const [admin1] = await connection.execute(
            'SELECT * FROM administradores WHERE email = ?',
            ['jourquiza86@hotmail.com']
        );
        if (admin1.length > 0) {
            const user = admin1[0];
            console.log(`✅ Usuario encontrado en tabla: administradores`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Nombre: ${user.nombre}`);
            console.log(`   Rol: ${user.rol}`);
            console.log(`   Activo: ${user.activo}`);
            
            // Verificar password
            const testPassword = 'admin123';
            const match = await bcrypt.compare(testPassword, user.password);
            console.log(`   Password 'admin123': ${match ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
        } else {
            console.log('❌ Usuario NO encontrado');
        }

        // Verificar fiscal.zona5@sistema.com
        console.log('\n=== VERIFICANDO: fiscal.zona5@sistema.com ===');
        const [fiscal1] = await connection.execute(
            'SELECT * FROM fiscal WHERE email = ?',
            ['fiscal.zona5@sistema.com']
        );
        if (fiscal1.length > 0) {
            const user = fiscal1[0];
            console.log(`✅ Usuario encontrado en tabla: fiscal`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Nombre: ${user.nombre}`);
            console.log(`   Tipo: ${user.tipo || 'NULL'}`);
            console.log(`   Zona: ${user.zona}`);
            
            // Verificar password
            const testPassword = 'zona123';
            const match = await bcrypt.compare(testPassword, user.password);
            console.log(`   Password 'zona123': ${match ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
            
            // Mostrar hash actual
            console.log(`   Hash actual (primeros 20 chars): ${user.password.substring(0, 20)}...`);
        } else {
            console.log('❌ Usuario NO encontrado');
        }

        // Verificar jurquiza86@hotmail.com (el que funciona)
        console.log('\n=== VERIFICANDO: jurquiza86@hotmail.com (para comparar) ===');
        const [fiscal2] = await connection.execute(
            'SELECT * FROM fiscal WHERE email = ?',
            ['jurquiza86@hotmail.com']
        );
        if (fiscal2.length > 0) {
            const user = fiscal2[0];
            console.log(`✅ Usuario encontrado en tabla: fiscal`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Nombre: ${user.nombre}`);
            console.log(`   Tipo: ${user.tipo || 'NULL'}`);
            console.log(`   Zona: ${user.zona}`);
            
            // Verificar password
            const testPassword = 'zona123';
            const match = await bcrypt.compare(testPassword, user.password);
            console.log(`   Password 'zona123': ${match ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
        } else {
            console.log('❌ Usuario NO encontrado');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
