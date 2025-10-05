const bcrypt = require('bcrypt');

(async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔐 DEMOSTRACIÓN: CÓMO FUNCIONA BCRYPT');
    console.log('═══════════════════════════════════════════════════════\n');

    // 1. Password original
    const passwordOriginal = 'admin123';
    console.log('1️⃣ PASSWORD ORIGINAL (texto plano):');
    console.log(`   "${passwordOriginal}"`);
    console.log(`   Longitud: ${passwordOriginal.length} caracteres\n`);

    // 2. Generar hash
    console.log('2️⃣ GENERANDO HASH CON BCRYPT...');
    const hash1 = await bcrypt.hash(passwordOriginal, 10);
    console.log(`   Hash generado:`);
    console.log(`   "${hash1}"`);
    console.log(`   Longitud: ${hash1.length} caracteres\n`);

    // 3. Generar otro hash de la misma password
    console.log('3️⃣ GENERANDO OTRO HASH DE LA MISMA PASSWORD...');
    const hash2 = await bcrypt.hash(passwordOriginal, 10);
    console.log(`   Hash generado:`);
    console.log(`   "${hash2}"`);
    console.log(`   ⚠️ NOTA: Los hashes son DIFERENTES aunque la password es la misma\n`);

    // 4. Comparar password con hash
    console.log('4️⃣ VERIFICANDO PASSWORD CON bcrypt.compare()...');
    const match1 = await bcrypt.compare('admin123', hash1);
    console.log(`   bcrypt.compare('admin123', hash1) = ${match1} ✅`);
    
    const match2 = await bcrypt.compare('admin123', hash2);
    console.log(`   bcrypt.compare('admin123', hash2) = ${match2} ✅`);
    
    const match3 = await bcrypt.compare('wrongpassword', hash1);
    console.log(`   bcrypt.compare('wrongpassword', hash1) = ${match3} ❌\n`);

    // 5. Ventajas de seguridad
    console.log('═══════════════════════════════════════════════════════');
    console.log('🛡️ VENTAJAS DE SEGURIDAD:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ 1. La password real NUNCA se guarda en la BD');
    console.log('✅ 2. Si alguien roba la BD, NO puede ver las passwords');
    console.log('✅ 3. Cada hash es único (incluye "salt" aleatorio)');
    console.log('✅ 4. Es imposible revertir el hash a la password original');
    console.log('✅ 5. bcrypt es lento a propósito (dificulta ataques de fuerza bruta)');
    console.log('═══════════════════════════════════════════════════════\n');

    // 6. Ejemplo con password real de la BD
    console.log('6️⃣ EJEMPLO CON TU BASE DE DATOS:');
    console.log('   En la BD tienes algo como:');
    console.log('   "$2b$10$rKqQ8vF7yxQPz..."');
    console.log('   ');
    console.log('   Cuando el usuario ingresa "admin123":');
    console.log('   bcrypt.compare("admin123", "$2b$10$rKqQ8vF7...") = true ✅');
    console.log('   ');
    console.log('   Si ingresa "admin124":');
    console.log('   bcrypt.compare("admin124", "$2b$10$rKqQ8vF7...") = false ❌\n');

})();
