# 📋 COMPORTAMIENTO DE ENDPOINTS CREATE-FISCAL

## 🎯 TRES ENDPOINTS PRINCIPALES

1. `http://localhost:3000/admin/create-fiscal` → Crear/Asignar **Fiscal Regular**
2. `http://localhost:3000/admin/create-fiscal-general` → Crear/Asignar **Fiscal General**
3. `http://localhost:3000/admin/create-fiscal-zona` → Crear/Asignar **Fiscal de Zona**

---

## 🔄 FLUJO COMPLETO DE CADA ENDPOINT

### 📍 PUNTO DE INICIO: `backend/src/index.js`

```javascript
// Línea ~40-50 en src/index.js
const adminRouter = require('./routes/adminRouter');

// Línea ~350-360
app.use('/admin', adminRouter);
```

**¿Qué hace?**
- Registra todas las rutas que empiezan con `/admin`
- Redirige a `adminRouter` para manejar las subrutas

---

### 📍 PASO 1: ROUTER → `backend/src/routes/adminRouter.js`

```javascript
// Líneas 1-19: Importaciones
const express = require('express');
const router = express.Router();
const { 
    showCreateFiscal,           // ← Función para /create-fiscal
    showCreateFiscalGeneral,    // ← Función para /create-fiscal-general
    showCreateFiscalZona,       // ← Función para /create-fiscal-zona
    searchFiscal,               // ← Función para buscar fiscal
    assignFiscalRole,           // ← Función para asignar rol
    processCreateFiscal,        // ← Función para crear fiscal
    requireAdminAuth,           // ← Middleware de autenticación
    requireAdminRole            // ← Middleware de permisos
} = require('../controller/adminController');

// Líneas 47-53: Definición de rutas
router.get('/create-fiscal', 
    requireAdminAuth, 
    requireAdminRole(['super_admin', 'admin']), 
    showCreateFiscal
);

router.get('/create-fiscal-general', 
    requireAdminAuth, 
    requireAdminRole(['super_admin', 'admin']), 
    showCreateFiscalGeneral
);

router.get('/create-fiscal-zona', 
    requireAdminAuth, 
    requireAdminRole(['super_admin', 'admin']), 
    showCreateFiscalZona
);

// Líneas 51-53: Rutas para búsqueda y asignación
router.get('/search-fiscal', 
    requireAdminAuth, 
    requireAdminRole(['super_admin', 'admin']), 
    searchFiscal
);

router.post('/assign-fiscal-role', 
    requireAdminAuth, 
    requireAdminRole(['super_admin', 'admin']), 
    assignFiscalRole
);

router.post('/create-fiscal', 
    requireAdminAuth, 
    requireAdminRole(['super_admin', 'admin']), 
    processCreateFiscal
);
```

**¿Qué hace?**
- Define las rutas GET para mostrar los formularios
- Define las rutas GET/POST para búsqueda y asignación
- Aplica middlewares de seguridad antes de ejecutar las funciones

---

### 📍 PASO 2: MIDDLEWARES DE SEGURIDAD

#### 1. `requireAdminAuth` (Línea ~175 en adminController.js)

```javascript
const requireAdminAuth = (req, res, next) => {
    if (!req.session.adminId) {
        // Si NO hay sesión de admin
        return res.redirect('/admin/login');
    }
    // Si hay sesión, continúa
    next();
};
```

**¿Qué verifica?**
- ✅ Si existe `req.session.adminId`
- ❌ Si no existe → Redirige a `/admin/login`

#### 2. `requireAdminRole(['super_admin', 'admin'])` (Línea ~185)

```javascript
const requireAdminRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.session.adminRol)) {
            // Si el rol NO está permitido
            return res.status(403).send('Acceso denegado');
        }
        // Si el rol está permitido, continúa
        next();
    };
};
```

**¿Qué verifica?**
- ✅ Si `req.session.adminRol` está en `['super_admin', 'admin']`
- ❌ Si no está → Error 403 "Acceso denegado"

---

### 📍 PASO 3: CONTROLADOR → `backend/src/controller/adminController.js`

## 🔵 ENDPOINT 1: `/admin/create-fiscal`

### Función: `showCreateFiscal` (Línea ~236)

```javascript
const showCreateFiscal = (req, res) => {
    res.render("admin/create-fiscal", {
        view: {
            title: "Crear Fiscal Regular - Admin",
            description: "Crear nuevo fiscal regular",
            keywords: "admin, crear, fiscal, regular",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        },
        tipoFiscal: 'fiscal'  // ← IMPORTANTE: Define el tipo
    });
};
```

**¿Qué hace?**
1. Renderiza la vista `admin/create-fiscal.ejs`
2. Pasa datos de contexto:
   - `view`: Metadatos de la página
   - `admin`: Datos del admin logueado
   - `tipoFiscal: 'fiscal'` ← **Esto define que es Fiscal Regular**

---

## 🟡 ENDPOINT 2: `/admin/create-fiscal-general`

### Función: `showCreateFiscalGeneral` (Línea ~254)

```javascript
const showCreateFiscalGeneral = (req, res) => {
    res.render("admin/create-fiscal", {
        view: {
            title: "Crear Fiscal General - Admin",
            description: "Crear nuevo fiscal general",
            keywords: "admin, crear, fiscal, general",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        },
        tipoFiscal: 'fiscal_general'  // ← IMPORTANTE: Define el tipo
    });
};
```

**¿Qué hace?**
1. Renderiza la **MISMA vista** `admin/create-fiscal.ejs`
2. Pero con `tipoFiscal: 'fiscal_general'` ← **Esto define que es Fiscal General**

---

## 🟣 ENDPOINT 3: `/admin/create-fiscal-zona`

### Función: `showCreateFiscalZona` (Línea ~272)

```javascript
const showCreateFiscalZona = (req, res) => {
    res.render("admin/create-fiscal", {
        view: {
            title: "Crear Fiscal de Zona - Admin",
            description: "Crear nuevo fiscal de zona",
            keywords: "admin, crear, fiscal, zona",
            author: "Sistema Monolito",
            year: new Date().getFullYear()
        },
        admin: {
            nombre: req.session.adminNombre,
            rol: req.session.adminRol
        },
        tipoFiscal: 'fiscal_zona'  // ← IMPORTANTE: Define el tipo
    });
};
```

**¿Qué hace?**
1. Renderiza la **MISMA vista** `admin/create-fiscal.ejs`
2. Pero con `tipoFiscal: 'fiscal_zona'` ← **Esto define que es Fiscal de Zona**

---

### 📍 PASO 4: VISTA → `backend/src/view/admin/create-fiscal.ejs`

La vista usa el parámetro `tipoFiscal` para adaptar el contenido:

```ejs
<!-- Línea 306-309: Título dinámico -->
<%= tipoFiscal === 'fiscal' ? 'Crear Fiscal Regular' : 
    tipoFiscal === 'fiscal_general' ? 'Crear Fiscal General' : 
    'Crear Fiscal de Zona' %>

<!-- Línea 320-326: Icono y título del formulario -->
<% if (tipoFiscal === 'fiscal') { %>
    👤 Crear Nuevo Fiscal Regular
<% } else if (tipoFiscal === 'fiscal_general') { %>
    🏆 Crear Nuevo Fiscal General
<% } else { %>
    🌟 Crear Nuevo Fiscal de Zona
<% } %>

<!-- Línea 471-477: Texto del info box -->
<% if (tipoFiscal === 'fiscal') { %>
    <strong>Fiscal Regular:</strong> Puede subir fotos, ver datos...
<% } else if (tipoFiscal === 'fiscal_general') { %>
    <strong>Fiscal General:</strong> Tiene permisos administrativos...
<% } else { %>
    <strong>Fiscal de Zona:</strong> Puede gestionar fiscales...
<% } %>

<!-- Línea 526: Input hidden con el tipo -->
<input type="hidden" name="tipo" value="<%= tipoFiscal %>">

<!-- Línea 516-518: Botón de asignar rol -->
✅ Asignar como <%= tipoFiscal === 'fiscal' ? 'Fiscal Regular' : 
                     tipoFiscal === 'fiscal_general' ? 'Fiscal General' : 
                     'Fiscal de Zona' %>

<!-- Línea 738: JavaScript - Envío al asignar rol -->
nuevoTipo: '<%= tipoFiscal %>'
```

**¿Qué hace la vista?**
1. Muestra el **selector de modo** (Asignar Rol / Crear Nuevo)
2. Adapta textos según `tipoFiscal`
3. Incluye el tipo en el formulario y las peticiones

---

## 🔄 FLUJO DE INTERACCIÓN DEL USUARIO

### MODO 1: Asignar Rol (Por defecto)

```
1. Usuario hace GET a /admin/create-fiscal-general
   ↓
2. Router → requireAdminAuth → requireAdminRole → showCreateFiscalGeneral
   ↓
3. Controlador renderiza create-fiscal.ejs con tipoFiscal='fiscal_general'
   ↓
4. Vista muestra selector de modo (Asignar Rol activo)
   ↓
5. Usuario ingresa email y clic en "Buscar"
   ↓
6. JavaScript hace GET a /admin/search-fiscal?email=xxx
   ↓
7. Controlador (searchFiscal) busca en BD y retorna datos
   ↓
8. JavaScript muestra datos del fiscal encontrado
   ↓
9. Usuario clic en "Asignar como Fiscal General"
   ↓
10. JavaScript hace POST a /admin/assign-fiscal-role
    Body: { fiscalId: 47, nuevoTipo: 'fiscal_general' }
   ↓
11. Controlador (assignFiscalRole) actualiza el tipo en BD
   ↓
12. Retorna { success: true, redirect: '/admin/fiscales' }
   ↓
13. JavaScript redirige a /admin/fiscales
```

### MODO 2: Crear Nuevo

```
1. Usuario hace GET a /admin/create-fiscal
   ↓
2. Router → requireAdminAuth → requireAdminRole → showCreateFiscal
   ↓
3. Controlador renderiza create-fiscal.ejs con tipoFiscal='fiscal'
   ↓
4. Vista muestra selector de modo
   ↓
5. Usuario clic en "Crear Nuevo"
   ↓
6. JavaScript muestra el formulario
   ↓
7. Usuario completa campos y clic en "Crear Fiscal Regular"
   ↓
8. JavaScript hace POST a /admin/create-fiscal
    FormData: { tipo: 'fiscal', nombre: 'Juan', email: 'juan@...' }
   ↓
9. Controlador (processCreateFiscal) valida datos
   ↓
10. Hashea password con bcrypt
   ↓
11. Crea registro en tabla 'fiscal'
   ↓
12. Retorna { success: true, redirect: '/admin/fiscales' }
   ↓
13. JavaScript redirige a /admin/fiscales
```

---

## 📊 ESTRUCTURA DE ARCHIVOS

```
backend/
├── src/
│   ├── index.js                          ← Punto de entrada
│   │   └── app.use('/admin', adminRouter)
│   │
│   ├── routes/
│   │   └── adminRouter.js                ← Define las rutas
│   │       ├── GET  /create-fiscal       → showCreateFiscal
│   │       ├── GET  /create-fiscal-general → showCreateFiscalGeneral
│   │       ├── GET  /create-fiscal-zona  → showCreateFiscalZona
│   │       ├── GET  /search-fiscal       → searchFiscal
│   │       ├── POST /assign-fiscal-role  → assignFiscalRole
│   │       └── POST /create-fiscal       → processCreateFiscal
│   │
│   ├── controller/
│   │   └── adminController.js            ← Lógica de negocio
│   │       ├── showCreateFiscal()        (línea ~236)
│   │       ├── showCreateFiscalGeneral() (línea ~254)
│   │       ├── showCreateFiscalZona()    (línea ~272)
│   │       ├── searchFiscal()            (línea ~290)
│   │       ├── assignFiscalRole()        (línea ~335)
│   │       └── processCreateFiscal()     (línea ~388)
│   │
│   ├── view/
│   │   └── admin/
│   │       └── create-fiscal.ejs         ← Vista única para los 3 tipos
│   │           ├── Selector de modo
│   │           ├── Sección de búsqueda
│   │           ├── Formulario de creación
│   │           └── JavaScript para manejar todo
│   │
│   └── model/
│       └── index.js                      ← Modelos Sequelize
│           └── Fiscal                    ← Tabla 'fiscal'
```

---

## 🔑 DIFERENCIAS CLAVE ENTRE LOS 3 ENDPOINTS

| Aspecto | create-fiscal | create-fiscal-general | create-fiscal-zona |
|---------|---------------|----------------------|-------------------|
| **URL** | `/admin/create-fiscal` | `/admin/create-fiscal-general` | `/admin/create-fiscal-zona` |
| **Función** | `showCreateFiscal` | `showCreateFiscalGeneral` | `showCreateFiscalZona` |
| **tipoFiscal** | `'fiscal'` | `'fiscal_general'` | `'fiscal_zona'` |
| **Vista** | `create-fiscal.ejs` | `create-fiscal.ejs` | `create-fiscal.ejs` |
| **Título** | "Crear Fiscal Regular" | "Crear Fiscal General" | "Crear Fiscal de Zona" |
| **Icono** | 👤 | 🏆 | 🌟 |
| **Valor en BD** | `tipo = 'fiscal'` | `tipo = 'fiscal_general'` | `tipo = 'fiscal_zona'` |

**IMPORTANTE**: Los 3 endpoints usan la **MISMA VISTA** pero con diferente parámetro `tipoFiscal`.

---

## 📝 ENDPOINTS AUXILIARES

### 1. `GET /admin/search-fiscal`

**Ubicación**: `adminController.js` línea ~290

```javascript
const searchFiscal = async (req, res) => {
    const { email } = req.query;
    
    const fiscal = await Fiscal.findOne({
        where: { email: email.trim().toLowerCase() }
    });
    
    if (!fiscal) {
        return res.status(404).json({
            success: false,
            message: 'No se encontró ningún fiscal con ese email'
        });
    }
    
    res.json({
        success: true,
        fiscal: { id, nombre, email, tipo, zona, institucion }
    });
};
```

**Llamado desde**: JavaScript en `create-fiscal.ejs` línea ~695

### 2. `POST /admin/assign-fiscal-role`

**Ubicación**: `adminController.js` línea ~335

```javascript
const assignFiscalRole = async (req, res) => {
    const { fiscalId, nuevoTipo } = req.body;
    
    const fiscal = await Fiscal.findByPk(fiscalId);
    await fiscal.update({ tipo: nuevoTipo });
    
    res.json({
        success: true,
        message: 'Rol actualizado exitosamente',
        redirect: '/admin/fiscales'
    });
};
```

**Llamado desde**: JavaScript en `create-fiscal.ejs` línea ~733

### 3. `POST /admin/create-fiscal`

**Ubicación**: `adminController.js` línea ~388

```javascript
const processCreateFiscal = async (req, res) => {
    const { tipo, nombre, email, password, ... } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newFiscal = await Fiscal.create({
        nombre, email, password: hashedPassword, tipo, ...
    });
    
    res.json({
        success: true,
        message: 'Fiscal creado exitosamente',
        redirect: '/admin/fiscales'
    });
};
```

**Llamado desde**: JavaScript en `create-fiscal.ejs` línea ~766

---

## 🎯 RESUMEN EJECUTIVO

### ¿Cómo funcionan los 3 endpoints?

1. **Misma vista, diferente tipo**:
   - Los 3 usan `create-fiscal.ejs`
   - Cada uno pasa un `tipoFiscal` diferente
   - La vista se adapta según el tipo

2. **Dos modos de operación**:
   - **Asignar Rol**: Busca fiscal existente y cambia su tipo
   - **Crear Nuevo**: Crea un fiscal desde cero

3. **Flujo de datos**:
   ```
   index.js → adminRouter.js → adminController.js → create-fiscal.ejs
                                      ↓
                                  Sequelize (BD)
   ```

4. **Seguridad**:
   - Autenticación: `requireAdminAuth`
   - Autorización: `requireAdminRole(['super_admin', 'admin'])`

---

## 🛠️ CONFIGURACIÓN NECESARIA

Para que funcionen correctamente, necesitas:

1. ✅ Sesión activa de admin (`req.session.adminId`)
2. ✅ Rol permitido (`super_admin` o `admin`)
3. ✅ Tabla `fiscal` en la base de datos
4. ✅ Modelo `Fiscal` configurado en Sequelize
5. ✅ Vista `create-fiscal.ejs` en `src/view/admin/`

---

**¿Necesitas más detalles de alguna parte específica?** 🚀
