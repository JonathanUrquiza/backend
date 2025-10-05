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

        // Corregir password de fiscal.zona5@sistema.com
        console.log('=== CORRIGIENDO: fiscal.zona5@sistema.com ===');
        const newPassword = 'zona123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const [result] = await connection.execute(
            'UPDATE fiscal SET password = ? WHERE email = ?',
            [hashedPassword, 'fiscal.zona5@sistema.com']
        );
        
        if (result.affectedRows > 0) {
            console.log(`✅ Password actualizada para fiscal.zona5@sistema.com`);
            console.log(`   Nueva password: zona123`);
            
            // Verificar
            const [check] = await connection.execute(
                'SELECT email, password FROM fiscal WHERE email = ?',
                ['fiscal.zona5@sistema.com']
            );
            const match = await bcrypt.compare(newPassword, check[0].password);
            console.log(`   Verificación: ${match ? '✅ OK' : '❌ FALLÓ'}`);
        } else {
            console.log('❌ No se pudo actualizar');
        }

        console.log('\n=== RESUMEN DE CREDENCIALES CORREGIDAS ===');
        console.log('Email: fiscal.zona5@sistema.com');
        console.log('Password: zona123');
        console.log('URL: http://localhost:3000/fiscal-zona/login');

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
