// Script para establecer contraseñas simples para pruebas
const bcrypt = require('bcrypt');
const { sequelize } = require('./src/config/database');
const { Fiscal, Administrador } = require('./src/model/index');

// Contraseñas simples por tipo de usuario
const PASSWORDS = {
    admin: 'admin123',
    super_admin: 'admin123',
    fiscal: 'fiscal123',
    fiscal_general: 'general123',
    fiscal_zona: 'zona123'
};

async function setSimplePasswords() {
    console.log('🔧 Estableciendo contraseñas simples para pruebas...\n');
    
    try {
        // Verificar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a BD establecida\n');
        
        let updated = 0;
        
        // ============================================================
        // ADMINISTRADORES
        // ============================================================
        console.log('═══════════════════════════════════════════════════════');
        console.log('👨‍💼 ACTUALIZANDO ADMINISTRADORES');
        console.log('═══════════════════════════════════════════════════════\n');
        
        const admins = await Administrador.findAll();
        
        for (const admin of admins) {
            const password = PASSWORDS[admin.rol] || PASSWORDS.admin;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await admin.update({
                password: hashedPassword
            });
            
            console.log(`✅ ${admin.nombre}`);
            console.log(`   📧 Email: ${admin.email}`);
            console.log(`   🎭 Rol: ${admin.rol}`);
            console.log(`   🔑 Password: ${password}`);
            console.log('');
            
            updated++;
        }
        
        // ============================================================
        // FISCALES
        // ============================================================
        console.log('═══════════════════════════════════════════════════════');
        console.log('👥 ACTUALIZANDO FISCALES');
        console.log('═══════════════════════════════════════════════════════\n');
        
        const fiscales = await Fiscal.findAll();
        
        for (const fiscal of fiscales) {
            const tipo = fiscal.tipo || 'fiscal';
            const password = PASSWORDS[tipo] || PASSWORDS.fiscal;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await fiscal.update({
                password: hashedPassword,
                're-password': hashedPassword
            });
            
            console.log(`✅ ${fiscal.nombre}`);
            console.log(`   📧 Email: ${fiscal.email}`);
            console.log(`   📋 Tipo: ${tipo}`);
            console.log(`   🔑 Password: ${password}`);
            console.log('');
            
            updated++;
        }
        
        // ============================================================
        // RESUMEN
        // ============================================================
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📊 RESUMEN DE CONTRASEÑAS ESTABLECIDAS');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`✅ Total de usuarios actualizados: ${updated}`);
        console.log('');
        console.log('🔑 CONTRASEÑAS POR TIPO:');
        console.log(`   👨‍💼 Administradores: ${PASSWORDS.admin}`);
        console.log(`   ⭐ Fiscal General: ${PASSWORDS.fiscal_general}`);
        console.log(`   🏛️  Fiscal de Zona: ${PASSWORDS.fiscal_zona}`);
        console.log(`   👤 Fiscal Regular: ${PASSWORDS.fiscal}`);
        console.log('═══════════════════════════════════════════════════════\n');
        
        console.log('✅ ¡Listo! Ahora puedes hacer login con estas contraseñas simples.\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setSimplePasswords();
