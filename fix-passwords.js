// Script para hashear contraseñas en texto plano en la base de datos
const bcrypt = require('bcrypt');
const { sequelize } = require('./src/config/database');
const { Fiscal, Administrador } = require('./src/model/index');

async function fixPasswords() {
    console.log('🔧 Iniciando corrección de contraseñas...\n');
    
    try {
        // Verificar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a BD establecida\n');
        
        // Buscar todos los fiscales
        const fiscales = await Fiscal.findAll();
        
        let fixed = 0;
        let alreadyHashed = 0;
        let noPassword = 0;
        
        for (const fiscal of fiscales) {
            if (!fiscal.password) {
                console.log(`⚠️  ${fiscal.nombre} (${fiscal.email}) - Sin contraseña`);
                noPassword++;
                continue;
            }
            
            // Verificar si ya está hasheada (bcrypt hashes empiezan con $2b$ o $2a$)
            if (fiscal.password.startsWith('$2b$') || fiscal.password.startsWith('$2a$')) {
                console.log(`✅ ${fiscal.nombre} (${fiscal.email}) - Ya hasheada`);
                alreadyHashed++;
                continue;
            }
            
            // Hashear la contraseña en texto plano
            console.log(`🔨 Hasheando contraseña para: ${fiscal.nombre} (${fiscal.email})`);
            console.log(`   Contraseña original: ${fiscal.password}`);
            
            const hashedPassword = await bcrypt.hash(fiscal.password, 10);
            
            await fiscal.update({
                password: hashedPassword,
                're-password': hashedPassword
            });
            
            console.log(`   ✅ Contraseña hasheada correctamente\n`);
            fixed++;
        }
        
        // Verificar administradores
        const admins = await Administrador.findAll();
        
        for (const admin of admins) {
            if (!admin.password) {
                console.log(`⚠️  Admin: ${admin.nombre} (${admin.email}) - Sin contraseña`);
                noPassword++;
                continue;
            }
            
            if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$')) {
                console.log(`✅ Admin: ${admin.nombre} (${admin.email}) - Ya hasheada`);
                alreadyHashed++;
                continue;
            }
            
            console.log(`🔨 Hasheando contraseña para admin: ${admin.nombre} (${admin.email})`);
            console.log(`   Contraseña original: ${admin.password}`);
            
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            
            await admin.update({
                password: hashedPassword
            });
            
            console.log(`   ✅ Contraseña hasheada correctamente\n`);
            fixed++;
        }
        
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📊 RESUMEN DE CORRECCIÓN DE CONTRASEÑAS');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`✅ Contraseñas corregidas: ${fixed}`);
        console.log(`✓  Ya hasheadas: ${alreadyHashed}`);
        console.log(`⚠️  Sin contraseña: ${noPassword}`);
        console.log(`📝 Total procesados: ${fixed + alreadyHashed + noPassword}`);
        console.log('═══════════════════════════════════════════════════════\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixPasswords();
