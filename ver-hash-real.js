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

        console.log('═══════════════════════════════════════════════════════');
        console.log('🔐 HASHES REALES DE TU BASE DE DATOS');
        console.log('═══════════════════════════════════════════════════════\n');

        // Ver hash de admin@sistema.com
        console.log('📧 Usuario: admin@sistema.com');
        const [admin] = await connection.execute(
            'SELECT email, password FROM administradores WHERE email = ?',
            ['admin@sistema.com']
        );
        
        if (admin.length > 0) {
            const hashReal = admin[0].password;
            console.log(`🔑 Password que el usuario ingresa: "admin123"`);
            console.log(`🔐 Hash guardado en la BD:`);
            console.log(`   ${hashReal}`);
            console.log(`   Longitud: ${hashReal.length} caracteres\n`);
            
            // Probar la comparación
            console.log('🧪 PRUEBA DE VERIFICACIÓN:');
            const test1 = await bcrypt.compare('admin123', hashReal);
            console.log(`   bcrypt.compare('admin123', hash) = ${test1} ${test1 ? '✅' : '❌'}`);
            
            const test2 = await bcrypt.compare('admin124', hashReal);
            console.log(`   bcrypt.compare('admin124', hash) = ${test2} ${test2 ? '✅' : '❌'}`);
            
            const test3 = await bcrypt.compare('wrongpass', hashReal);
            console.log(`   bcrypt.compare('wrongpass', hash) = ${test3} ${test3 ? '✅' : '❌'}\n`);
        }

        // Ver hash de fiscal.zona5@sistema.com
        console.log('═══════════════════════════════════════════════════════\n');
        console.log('📧 Usuario: fiscal.zona5@sistema.com');
        const [fiscal] = await connection.execute(
            'SELECT email, password FROM fiscal WHERE email = ?',
            ['fiscal.zona5@sistema.com']
        );
        
        if (fiscal.length > 0) {
            const hashReal = fiscal[0].password;
            console.log(`🔑 Password que el usuario ingresa: "zona123"`);
            console.log(`🔐 Hash guardado en la BD:`);
            console.log(`   ${hashReal}`);
            console.log(`   Longitud: ${hashReal.length} caracteres\n`);
            
            // Probar la comparación
            console.log('🧪 PRUEBA DE VERIFICACIÓN:');
            const test1 = await bcrypt.compare('zona123', hashReal);
            console.log(`   bcrypt.compare('zona123', hash) = ${test1} ${test1 ? '✅' : '❌'}`);
            
            const test2 = await bcrypt.compare('fiscal123', hashReal);
            console.log(`   bcrypt.compare('fiscal123', hash) = ${test2} ${test2 ? '✅' : '❌'}\n`);
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('📚 CONCLUSIÓN:');
        console.log('═══════════════════════════════════════════════════════');
        console.log('La password "admin123" NO se guarda en la BD.');
        console.log('Se guarda un HASH de 60 caracteres que empieza con "$2b$10$"');
        console.log('');
        console.log('Cuando el usuario hace login:');
        console.log('1. Ingresa "admin123"');
        console.log('2. El servidor lee el hash de la BD');
        console.log('3. bcrypt.compare() verifica si coinciden');
        console.log('4. Si coinciden → Login exitoso ✅');
        console.log('5. Si no coinciden → Credenciales incorrectas ❌');
        console.log('═══════════════════════════════════════════════════════\n');

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
