const { Administrador, Fiscal, sequelize } = require('./src/model/index');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos exitosa\n');

        console.log('=== ADMINISTRADORES ===');
        const admins = await Administrador.findAll({ 
            attributes: ['id', 'email', 'tipo_admin'],
            order: [['id', 'ASC']]
        });
        admins.forEach(a => {
            console.log(`ID: ${a.id} | Email: ${a.email} | Tipo: ${a.tipo_admin}`);
        });
        console.log(`Total: ${admins.length} administradores\n`);

        console.log('=== FISCALES ===');
        const fiscales = await Fiscal.findAll({ 
            attributes: ['id', 'email', 'tipo_fiscal'],
            order: [['id', 'ASC']]
        });
        fiscales.forEach(f => {
            console.log(`ID: ${f.id} | Email: ${f.email} | Tipo: ${f.tipo_fiscal}`);
        });
        console.log(`Total: ${fiscales.length} fiscales\n`);

        console.log('=== CONTRASEÑAS CONFIGURADAS ===');
        console.log('Admin: admin123');
        console.log('Fiscal General: general123');
        console.log('Fiscal Zona: zona123');
        console.log('Fiscal Regular: fiscal123');

        await sequelize.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
