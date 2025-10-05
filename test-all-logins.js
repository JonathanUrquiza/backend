// Script para probar todos los endpoints de login y verificar la BD
const pc = require('picocolors');
const { sequelize, Sequelize } = require('./src/config/database');
const { Fiscal, Administrador } = require('./src/model/index');

async function testAllEndpoints() {
    try {
        console.log(pc.blue('═══════════════════════════════════════════════════════'));
        console.log(pc.blue('🔍 PRUEBA COMPLETA DE ENDPOINTS Y BASE DE DATOS'));
        console.log(pc.blue('═══════════════════════════════════════════════════════\n'));

        // ========================================
        // 1. VERIFICAR CONEXIÓN A ALWAYSDATA
        // ========================================
        console.log(pc.cyan('📡 1. VERIFICANDO CONEXIÓN A ALWAYSDATA'));
        console.log(pc.cyan('─'.repeat(55)));
        
        const [results] = await sequelize.query('SELECT DATABASE() as db, VERSION() as version');
        console.log(pc.green(`✅ Base de datos activa: ${results[0].db}`));
        console.log(pc.green(`✅ Versión MySQL: ${results[0].version}`));
        console.log('');

        // ========================================
        // 2. VERIFICAR TABLAS EXISTENTES
        // ========================================
        console.log(pc.cyan('📋 2. VERIFICANDO TABLAS EN LA BASE DE DATOS'));
        console.log(pc.cyan('─'.repeat(55)));
        
        const [tables] = await sequelize.query('SHOW TABLES');
        console.log(pc.white(`Tablas encontradas: ${tables.length}`));
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(pc.white(`  ✓ ${tableName}`));
        });
        console.log('');

        // ========================================
        // 3. ESTADÍSTICAS DE FISCALES
        // ========================================
        console.log(pc.cyan('📊 3. ESTADÍSTICAS DE FISCALES'));
        console.log(pc.cyan('─'.repeat(55)));
        
        const totalFiscales = await Fiscal.count();
        const fiscalesRegulares = await Fiscal.count({ where: { tipo: 'fiscal' } });
        const fiscalesGenerales = await Fiscal.count({ where: { tipo: 'fiscal_general' } });
        const fiscalesZona = await Fiscal.count({ where: { tipo: 'fiscal_zona' } });
        const fiscalesConPassword = await Fiscal.count({ 
            where: { password: { [Sequelize.Op.ne]: null } } 
        });
        
        console.log(pc.white(`Total de fiscales:              ${totalFiscales}`));
        console.log(pc.white(`  ├─ Fiscales (regulares):      ${fiscalesRegulares}`));
        console.log(pc.white(`  ├─ Fiscales Generales:        ${fiscalesGenerales}`));
        console.log(pc.white(`  └─ Fiscales de Zona:          ${fiscalesZona}`));
        console.log(pc.white(`\nFiscales con contraseña:        ${fiscalesConPassword} de ${totalFiscales}`));
        console.log('');

        // ========================================
        // 4. ESTADÍSTICAS DE ADMINISTRADORES
        // ========================================
        console.log(pc.cyan('👔 4. ESTADÍSTICAS DE ADMINISTRADORES'));
        console.log(pc.cyan('─'.repeat(55)));
        
        const totalAdmins = await Administrador.count();
        const adminsActivos = await Administrador.count({ where: { activo: true } });
        
        console.log(pc.white(`Total de administradores:       ${totalAdmins}`));
        console.log(pc.white(`Administradores activos:        ${adminsActivos}`));
        console.log('');

        // ========================================
        // 5. ENDPOINT: /login (Fiscales Regulares)
        // ========================================
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        console.log(pc.magenta('🔐 5. ENDPOINT: /login (FISCALES REGULARES)'));
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        
        const fiscalRegularConPassword = await Fiscal.findOne({
            where: { 
                tipo: 'fiscal',
                password: { [Sequelize.Op.ne]: null }
            }
        });
        
        if (fiscalRegularConPassword) {
            console.log(pc.green('✅ Encontrado fiscal regular con contraseña'));
            console.log(pc.white(`   ID: ${fiscalRegularConPassword.id}`));
            console.log(pc.white(`   Nombre: ${fiscalRegularConPassword.nombre}`));
            console.log(pc.white(`   Email: ${fiscalRegularConPassword.email}`));
            console.log(pc.white(`   Zona: ${fiscalRegularConPassword.zona}`));
            console.log(pc.yellow(`   URL: http://localhost:3000/login`));
        } else {
            console.log(pc.red('❌ No hay fiscales regulares con contraseña configurada'));
        }
        console.log('');

        // ========================================
        // 6. ENDPOINT: /fiscal-general/login
        // ========================================
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        console.log(pc.magenta('🔐 6. ENDPOINT: /fiscal-general/login'));
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        
        const fiscalesGeneralesAll = await Fiscal.findAll({
            where: { tipo: 'fiscal_general' }
        });
        
        console.log(pc.white(`Fiscales generales en BD: ${fiscalesGeneralesAll.length}`));
        fiscalesGeneralesAll.forEach((fg, index) => {
            const hasPassword = fg.password ? '✅' : '❌';
            console.log(pc.white(`  ${index + 1}. ${fg.nombre}`));
            console.log(pc.white(`     Email: ${fg.email}`));
            console.log(pc.white(`     Password: ${hasPassword}`));
            console.log(pc.white(`     Zona: ${fg.zona}`));
        });
        console.log(pc.yellow(`   URL: http://localhost:3000/fiscal-general/login`));
        console.log('');

        // ========================================
        // 7. ENDPOINT: /fiscal-zona/login
        // ========================================
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        console.log(pc.magenta('🔐 7. ENDPOINT: /fiscal-zona/login'));
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        
        const fiscalesZonaAll = await Fiscal.findAll({
            where: { tipo: 'fiscal_zona' }
        });
        
        console.log(pc.white(`Fiscales de zona en BD: ${fiscalesZonaAll.length}`));
        fiscalesZonaAll.forEach((fz, index) => {
            const hasPassword = fz.password ? '✅' : '❌';
            console.log(pc.white(`  ${index + 1}. ${fz.nombre}`));
            console.log(pc.white(`     Email: ${fz.email}`));
            console.log(pc.white(`     Password: ${hasPassword}`));
            console.log(pc.white(`     Zona: ${fz.zona}`));
        });
        console.log(pc.yellow(`   URL: http://localhost:3000/fiscal-zona/login`));
        console.log('');

        // ========================================
        // 8. ENDPOINT: /admin/login
        // ========================================
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        console.log(pc.magenta('🔐 8. ENDPOINT: /admin/login'));
        console.log(pc.magenta('═══════════════════════════════════════════════════════'));
        
        const administradores = await Administrador.findAll({
            where: { activo: true }
        });
        
        console.log(pc.white(`Administradores activos: ${administradores.length}`));
        administradores.forEach((admin, index) => {
            console.log(pc.white(`  ${index + 1}. ${admin.nombre}`));
            console.log(pc.white(`     Email: ${admin.email}`));
            console.log(pc.white(`     Rol: ${admin.rol}`));
            console.log(pc.white(`     Último acceso: ${admin.ultimo_acceso || 'Nunca'}`));
        });
        console.log(pc.yellow(`   URL: http://localhost:3000/admin/login`));
        console.log('');

        // ========================================
        // 9. JERARQUÍA Y RESUMEN
        // ========================================
        console.log(pc.blue('═══════════════════════════════════════════════════════'));
        console.log(pc.blue('📊 9. JERARQUÍA Y RESUMEN'));
        console.log(pc.blue('═══════════════════════════════════════════════════════'));
        console.log(pc.white('Jerarquía (de mayor a menor autoridad):'));
        console.log(pc.white(`  1️⃣  Administrador (super_admin)`));
        console.log(pc.white(`  2️⃣  Fiscal de Zona`));
        console.log(pc.white(`  3️⃣  Fiscal General`));
        console.log(pc.white(`  4️⃣  Fiscal (regular)`));
        console.log('');

        console.log(pc.cyan('Resumen de usuarios con acceso:'));
        console.log(pc.cyan(`  ✅ Administradores:       ${adminsActivos}`));
        console.log(pc.cyan(`  ✅ Fiscales de Zona:      ${fiscalesZona} (${fiscalesZonaAll.filter(f => f.password).length} con password)`));
        console.log(pc.cyan(`  ✅ Fiscales Generales:    ${fiscalesGenerales} (${fiscalesGeneralesAll.filter(f => f.password).length} con password)`));
        console.log(pc.cyan(`  ✅ Fiscales Regulares:    ${fiscalesRegulares} (${fiscalRegularConPassword ? '1+' : '0'} con password)`));
        console.log('');

        // ========================================
        // 10. VERIFICAR TABLA INSTITUCIONES
        // ========================================
        console.log(pc.cyan('🏢 10. VERIFICANDO TABLA INSTITUCIONES'));
        console.log(pc.cyan('─'.repeat(55)));
        
        const [instituciones] = await sequelize.query('SELECT COUNT(*) as total FROM instituciones');
        console.log(pc.green(`✅ Instituciones en BD: ${instituciones[0].total}`));
        console.log('');

        // ========================================
        // 11. VERIFICAR TABLA AUDITORIA
        // ========================================
        console.log(pc.cyan('📝 11. VERIFICANDO TABLA AUDITORIA'));
        console.log(pc.cyan('─'.repeat(55)));
        
        try {
            const [auditoria] = await sequelize.query('SELECT COUNT(*) as total FROM auditoria');
            console.log(pc.green(`✅ Registros de auditoría: ${auditoria[0].total}`));
        } catch (error) {
            console.log(pc.yellow(`⚠️  Tabla auditoria no existe o no es accesible`));
        }
        console.log('');

        console.log(pc.green('═══════════════════════════════════════════════════════'));
        console.log(pc.green('✅ VERIFICACIÓN COMPLETA FINALIZADA'));
        console.log(pc.green('═══════════════════════════════════════════════════════'));

    } catch (error) {
        console.error(pc.red('═══════════════════════════════════════════════════════'));
        console.error(pc.red('❌ ERROR EN LA VERIFICACIÓN'));
        console.error(pc.red('═══════════════════════════════════════════════════════'));
        console.error(pc.red(`Mensaje: ${error.message}`));
        console.error(pc.gray(error.stack));
    } finally {
        await sequelize.close();
        console.log(pc.yellow('\n🔌 Conexión cerrada\n'));
    }
}

testAllEndpoints();

