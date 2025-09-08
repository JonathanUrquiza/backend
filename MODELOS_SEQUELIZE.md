# 📋 Guía de Modelos Sequelize

## 🎯 Modelos Disponibles

Tu sistema de fiscalización ahora cuenta con **6 modelos Sequelize** completamente funcionales:

### 🗺️ **Zona**
- Representa las zonas electorales
- Campos: `id`, `nombre`, `poblacion`, `numero_zona`

### 🏢 **Institucion** 
- Centros de votación
- Campos: `id`, `nombre`

### 👥 **Fiscal**
- Fiscales individuales con toda su información
- Campos: `id`, `nombre`, `email`, `cel_num`, `direccion`, `zona`, `institucion`, `password`, `re_password`

### 👑 **FiscalGeneral**
- Fiscales generales que supervisan
- Campos: `id`, `fiscal_nombre`, `institucion`, `cant_fiscales`

### 📍 **FiscalZona**
- Relación entre fiscales y zonas
- Campos: `id`, `nombre`, `zona`

### 🔐 **Sesion**
- Gestión de sesiones de login/logout
- Campos: `id`, `fiscal_id`, `token`, `expira_en`, `activa`, `creada_en`

---

## 💡 Ejemplos de Uso

### **Importar modelos:**
```javascript
const { Zona, Institucion, Fiscal, FiscalGeneral, Sesion } = require('./src/model/index');
```

### **Consultar fiscales con relaciones:**
```javascript
const fiscales = await Fiscal.findAll({
    include: [
        { model: Zona, as: 'zonaInfo' },
        { model: Institucion, as: 'institucionInfo' }
    ]
});
```

### **Buscar fiscal por email:**
```javascript
const fiscal = await Fiscal.findOne({
    where: { email: 'ejemplo@fiscales.com' }
});
```

### **Crear nueva sesión:**
```javascript
const sesion = await Sesion.create({
    fiscal_id: fiscal.id,
    token: 'token_generado',
    expira_en: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 horas
});
```

### **Verificar sesión válida:**
```javascript
const sesion = await Sesion.findOne({
    where: { token: 'token_usuario' }
});

if (sesion && sesion.esValida()) {
    // Sesión válida
}
```

### **Obtener fiscales por zona:**
```javascript
const fiscalesZona5 = await Fiscal.findAll({
    where: { zona: 5 }
});
```

### **Limpiar sesiones expiradas:**
```javascript
await Sesion.limpiarExpiradas();
```

---

## ✅ Estado Actual

- **44 fiscales** cargados de la Zona 5
- **8 instituciones** de Villa Crespo 
- **1 zona** configurada (Zona 5)
- **1 fiscal general** coordinador
- **Sistema de sesiones** listo para autenticación

---

## 🚀 Listo para Producción

Los modelos están completamente configurados y probados. Puedes comenzar a usarlos en tus controladores, servicios y rutas inmediatamente.
