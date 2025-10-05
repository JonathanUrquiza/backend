# ✅ NUEVA FUNCIONALIDAD: ASIGNAR ROL O CREAR FISCAL

## 🎯 OBJETIVO

Permitir al super_admin en el endpoint `/admin/create-fiscal` tener dos opciones:
1. **Asignar rol** a un fiscal existente (cambiar su tipo)
2. **Crear nuevo** fiscal con el tipo seleccionado

---

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### 1. Selector de Modo

Al entrar a cualquiera de estas rutas:
- `/admin/create-fiscal` (Fiscal Regular)
- `/admin/create-fiscal-general` (Fiscal General)
- `/admin/create-fiscal-zona` (Fiscal de Zona)

El admin verá dos opciones:

#### 🔄 Modo "Asignar Rol"
- Buscar un fiscal existente por email
- Ver sus datos actuales (nombre, email, tipo, zona)
- Asignar el nuevo rol con un clic

#### ➕ Modo "Crear Nuevo"
- Formulario completo para crear un fiscal desde cero
- Todos los campos necesarios (nombre, email, password, zona, etc.)
- Crear el fiscal con el tipo seleccionado

---

## 📋 ENDPOINTS NUEVOS

### 1. `GET /admin/search-fiscal`
**Descripción**: Buscar un fiscal por email

**Query Parameters**:
```
email: string (requerido)
```

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "fiscal": {
    "id": 47,
    "nombre": "Jonathan javier urquiza",
    "email": "jurquiza86@hotmail.com",
    "tipo": "fiscal_zona",
    "zona": 15,
    "institucion": "Escuela 123"
  }
}
```

**Respuesta Error** (404):
```json
{
  "success": false,
  "message": "No se encontró ningún fiscal con ese email"
}
```

---

### 2. `POST /admin/assign-fiscal-role`
**Descripción**: Asignar un nuevo rol a un fiscal existente

**Body** (JSON):
```json
{
  "fiscalId": 47,
  "nuevoTipo": "fiscal_general"
}
```

**Tipos válidos**:
- `"fiscal"` - Fiscal Regular
- `"fiscal_general"` - Fiscal General
- `"fiscal_zona"` - Fiscal de Zona

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Rol actualizado exitosamente. Jonathan javier urquiza ahora es fiscal general",
  "redirect": "/admin/fiscales"
}
```

**Respuesta Error** (400):
```json
{
  "success": false,
  "message": "Tipo de fiscal inválido"
}
```

---

## 🎨 INTERFAZ DE USUARIO

### Selector de Modo

```
┌─────────────────────────────────────────────────────┐
│  [🔄 Asignar Rol]    [➕ Crear Nuevo]               │
│   (activo)             (inactivo)                    │
└─────────────────────────────────────────────────────┘
```

### Modo "Asignar Rol"

```
┌─────────────────────────────────────────────────────┐
│  🔍 Buscar Fiscal Existente                         │
│                                                      │
│  [email@ejemplo.com        ] [Buscar]               │
│                                                      │
│  ✅ Fiscal Encontrado                               │
│  Nombre: Jonathan javier urquiza                    │
│  Email: jurquiza86@hotmail.com                      │
│  Tipo Actual: fiscal_zona                           │
│  Zona: 15                                           │
│                                                      │
│  [✅ Asignar como Fiscal General]                   │
└─────────────────────────────────────────────────────┘
```

### Modo "Crear Nuevo"

```
┌─────────────────────────────────────────────────────┐
│  Nombre Completo *                                  │
│  [_____________________________________]             │
│                                                      │
│  Email *              Contraseña *                  │
│  [_______________]    [_______________]             │
│                                                      │
│  Teléfono             Zona                          │
│  [_______________]    [Seleccionar...]              │
│                                                      │
│  Dirección                                          │
│  [_____________________________________]             │
│                                                      │
│  Institución                                        │
│  [_____________________________________]             │
│                                                      │
│  [✅ Crear Fiscal General] [❌ Cancelar]           │
└─────────────────────────────────────────────────────┘
```

---

## 💻 CÓDIGO IMPLEMENTADO

### Archivos Modificados

1. **`backend/src/view/admin/create-fiscal.ejs`**
   - ✅ Agregado selector de modo
   - ✅ Agregada sección de búsqueda
   - ✅ Agregado JavaScript para manejar ambos modos
   - ✅ Estilos CSS para la nueva interfaz

2. **`backend/src/controller/adminController.js`**
   - ✅ Nueva función: `searchFiscal()`
   - ✅ Nueva función: `assignFiscalRole()`
   - ✅ Exportadas las nuevas funciones

3. **`backend/src/routes/adminRouter.js`**
   - ✅ Nueva ruta: `GET /admin/search-fiscal`
   - ✅ Nueva ruta: `POST /admin/assign-fiscal-role`
   - ✅ Importadas las nuevas funciones

---

## 🔒 SEGURIDAD

### Permisos Requeridos
- ✅ Autenticación: `requireAdminAuth`
- ✅ Rol: `requireAdminRole(['super_admin', 'admin'])`

### Validaciones
- ✅ Email requerido para búsqueda
- ✅ Fiscal ID y nuevo tipo requeridos para asignación
- ✅ Tipos válidos verificados: `fiscal`, `fiscal_general`, `fiscal_zona`
- ✅ Verificación de existencia del fiscal antes de asignar rol

---

## 📝 LOGS

### Al asignar rol:
```
✅ Admin Jonathan Urquiza cambió el rol de Jonathan javier urquiza:
   De: fiscal_zona → A: fiscal_general
```

---

## 🧪 PRUEBAS

### Caso 1: Asignar Rol Exitoso
1. Ir a `/admin/create-fiscal-general`
2. Seleccionar modo "Asignar Rol"
3. Buscar: `jurquiza86@hotmail.com`
4. Clic en "Asignar como Fiscal General"
5. **Resultado**: Fiscal actualizado, redirige a `/admin/fiscales`

### Caso 2: Fiscal No Encontrado
1. Ir a `/admin/create-fiscal`
2. Seleccionar modo "Asignar Rol"
3. Buscar: `noexiste@email.com`
4. **Resultado**: Error "No se encontró ningún fiscal con ese email"

### Caso 3: Crear Nuevo Fiscal
1. Ir a `/admin/create-fiscal-zona`
2. Seleccionar modo "Crear Nuevo"
3. Completar formulario
4. Clic en "Crear Fiscal de Zona"
5. **Resultado**: Fiscal creado, redirige a `/admin/fiscales`

---

## 🎯 FLUJO DE TRABAJO

### Asignar Rol
```
1. Admin entra a /admin/create-fiscal-general
2. Modo "Asignar Rol" está activo por defecto
3. Admin ingresa email del fiscal
4. Clic en "Buscar"
5. Sistema busca fiscal en BD
6. Si existe, muestra datos del fiscal
7. Admin clic en "Asignar como Fiscal General"
8. Sistema actualiza el campo "tipo" en la BD
9. Redirige a /admin/fiscales
10. Admin ve la lista actualizada
```

### Crear Nuevo
```
1. Admin entra a /admin/create-fiscal
2. Clic en modo "Crear Nuevo"
3. Formulario se muestra
4. Admin completa los campos
5. Clic en "Crear Fiscal Regular"
6. Sistema valida datos
7. Sistema hashea la contraseña
8. Sistema crea el registro en BD
9. Redirige a /admin/fiscales
10. Admin ve el nuevo fiscal en la lista
```

---

## 🚀 VENTAJAS

1. ✅ **Flexibilidad**: Dos modos en una sola página
2. ✅ **Eficiencia**: No necesitas crear un fiscal para luego cambiar su rol
3. ✅ **UX Mejorada**: Interfaz clara con selector visual
4. ✅ **Validación**: Búsqueda previa antes de asignar
5. ✅ **Logs**: Registro de cambios de roles
6. ✅ **Seguridad**: Permisos y validaciones en cada endpoint

---

## 📚 PRÓXIMOS PASOS

Para probar la funcionalidad:

1. **Iniciar el servidor**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Login como admin**:
   ```
   URL: http://localhost:3000/admin/login
   Email: admin@sistema.com
   Password: admin123
   ```

3. **Probar "Asignar Rol"**:
   - Ir a: http://localhost:3000/admin/create-fiscal-general
   - Buscar: `jurquiza86@hotmail.com`
   - Asignar rol

4. **Probar "Crear Nuevo"**:
   - Ir a: http://localhost:3000/admin/create-fiscal
   - Cambiar a modo "Crear Nuevo"
   - Completar formulario
   - Crear fiscal

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Modificar vista con selector de modo
- [x] Agregar sección de búsqueda
- [x] Agregar JavaScript para manejar modos
- [x] Crear endpoint `searchFiscal`
- [x] Crear endpoint `assignFiscalRole`
- [x] Agregar rutas en router
- [x] Exportar funciones
- [x] Agregar estilos CSS
- [x] Validaciones de seguridad
- [ ] Probar funcionalidad completa

---

**¿Listo para probar?** 🚀
