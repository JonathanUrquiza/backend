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
        console.log('═══════════════════════════════════════════════════════');
        console.log('🔐 VERIFICACIÓN DE TODAS LAS CREDENCIALES');
        console.log('═══════════════════════════════════════════════════════\n');

        // Credenciales a verificar
        const credenciales = [
            {
                tipo: 'ADMIN',
                tabla: 'administradores',
                email: 'jourquiza86@hotmail.com',
                password: 'admin123',
                url: '/admin/login'
            },
            {
                tipo: 'ADMIN',
                tabla: 'administradores',
                email: 'admin@sistema.com',
                password: 'admin123',
                url: '/admin/login'
            },
            {
                tipo: 'FISCAL ZONA',
                tabla: 'fiscal',
                email: 'fiscal.zona5@sistema.com',
                password: 'zona123',
                url: '/fiscal-zona/login'
            },
            {
                tipo: 'FISCAL ZONA',
                tabla: 'fiscal',
                email: 'jurquiza86@hotmail.com',
                password: 'zona123',
                url: '/fiscal-zona/login'
            },
            {
                tipo: 'FISCAL REGULAR',
                tabla: 'fiscal',
                email: 'jonathan.javier.urquiza@fiscales.com',
                password: 'fiscal123',
                url: '/login'
            }
        ];

        let allOk = true;

        for (const cred of credenciales) {
            console.log(`\n🔍 Verificando: ${cred.email}`);
            console.log(`   Tipo: ${cred.tipo}`);
            console.log(`   URL: http://localhost:3000${cred.url}`);
            
            const [rows] = await connection.execute(
                `SELECT * FROM ${cred.tabla} WHERE email = ?`,
                [cred.email]
            );

            if (rows.length === 0) {
                console.log(`   ❌ Usuario NO encontrado en tabla ${cred.tabla}`);
                allOk = false;
                continue;
            }

            const user = rows[0];
            const match = await bcrypt.compare(cred.password, user.password);
            
            if (match) {
                console.log(`   ✅ Password correcta: ${cred.password}`);
                
                // Verificar campos adicionales
                if (cred.tabla === 'administradores') {
                    console.log(`   ✅ Activo: ${user.activo === 1 ? 'Sí' : 'No'}`);
                    console.log(`   ✅ Rol: ${user.rol}`);
                } else {
                    console.log(`   ✅ Tipo: ${user.tipo || 'N/A'}`);
                    console.log(`   ✅ Zona: ${user.zona || 'N/A'}`);
                }
            } else {
                console.log(`   ❌ Password INCORRECTA (esperada: ${cred.password})`);
                allOk = false;
            }
        }

        console.log('\n═══════════════════════════════════════════════════════');
        if (allOk) {
            console.log('✅ TODAS LAS CREDENCIALES SON VÁLIDAS');
        } else {
            console.log('⚠️ ALGUNAS CREDENCIALES TIENEN PROBLEMAS');
        }
        console.log('═══════════════════════════════════════════════════════\n');

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
