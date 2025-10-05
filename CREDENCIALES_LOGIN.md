# 🔐 CREDENCIALES DE LOGIN - SISTEMA DE FISCALIZACIÓN

## 📊 Resumen de Usuarios en Base de Datos

### 👨‍💼 ADMINISTRADORES (Tabla: `administradores`)
Total: **2 administradores**

| ID | Email | Contraseña | URL de Login |
|----|-------|-----------|--------------|
| 0 | jourquiza86@hotmail.com | `admin123` | http://localhost:3000/admin/login |
| 1 | admin@sistema.com | `admin123` | http://localhost:3000/admin/login |

**Columnas de la tabla:**
- `id`, `nombre`, `email`, `password`, `rol`, `activo`, `ultimo_acceso`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`

---

### 👥 FISCALES (Tabla: `fiscal`)

#### 🌟 FISCAL GENERAL
| ID | Email | Contraseña | Tipo | URL de Login |
|----|-------|-----------|------|--------------|
| 48 | fiscal.general@sistema.com | `general123` | fiscal_general | http://localhost:3000/fiscal-general/login |

#### 🏛️ FISCAL DE ZONA
| ID | Email | Contraseña | Tipo | URL de Login |
|----|-------|-----------|------|--------------|
| 1 | fiscal.zona5@sistema.com | `zona123` | fiscal_zona | http://localhost:3000/fiscal-zona/login |

#### 👤 FISCALES REGULARES (primeros 10 de muchos)
| ID | Email | Contraseña | URL de Login |
|----|-------|-----------|--------------|
| 2 | cristian.javier.garcia@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 3 | gabriel.umansky@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 4 | juan.ignacio.valdez.rabal@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 5 | eli.n.umansky@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 6 | gonzalo.ernesto.viniegra@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 7 | jonathan.javier.urquiza@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 8 | santiago.lamas@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 9 | maria.del.valle.ferrazza@fiscales.com | `fiscal123` | http://localhost:3000/login |
| 10 | sofia.maria.tripodi@fiscales.com | `fiscal123` | http://localhost:3000/login |

**Columnas de la tabla:**
- `id`, `nombre`, `email`, `cel-num`, `direccion`, `zona`, `institucion`, `password`, `re-password`, `tipo`, `fiscal_general_asignado`, `institucion_id`

---

## 🔑 CONTRASEÑAS CONFIGURADAS

Todas las contraseñas fueron configuradas con el script `set-simple-passwords.js`:

- **Administradores**: `admin123` (hasheadas con bcrypt)
- **Fiscal General**: `general123` (hasheadas con bcrypt)
- **Fiscal de Zona**: `zona123` (hasheadas con bcrypt)
- **Fiscales Regulares**: `fiscal123` (hasheadas con bcrypt)

---

## 🎯 PRUEBAS RÁPIDAS

### 1. Login de Administrador
```
URL: http://localhost:3000/admin/login
Email: jourquiza86@hotmail.com
Password: admin123
Redirección: /admin/dashboard
```

### 2. Login de Fiscal General
```
URL: http://localhost:3000/fiscal-general/login
Email: fiscal.general@sistema.com
Password: general123
Redirección: /fiscal-general/dashboard
```

### 3. Login de Fiscal de Zona
```
URL: http://localhost:3000/fiscal-zona/login
Email: fiscal.zona5@sistema.com
Password: zona123
Redirección: /fiscal-zona/dashboard
```

### 4. Login de Fiscal Regular
```
URL: http://localhost:3000/login
Email: jonathan.javier.urquiza@fiscales.com
Password: fiscal123
Redirección: /
```

---

## ⚙️ CONTROLADORES Y LÓGICA

### Admin Login (`adminController.js`)
- Busca en tabla `administradores`
- Verifica password con bcrypt
- Guarda en sesión: `req.session.adminId`, `req.session.adminEmail`
- Middleware de protección: `requireAdminAuth`

### Fiscal General Login (`fiscalGeneralController.js`)
- Busca en tabla `fiscal` con `tipo = 'fiscal_general'`
- Verifica password con bcrypt
- Guarda en sesión: `req.session.fiscalGeneralId`, `req.session.fiscalGeneralEmail`
- Middleware de protección: `requireFiscalGeneralAuth`

### Fiscal Zona Login (`fiscalZonaController.js`)
- Busca en tabla `fiscal` con `tipo = 'fiscal_zona'`
- Verifica password con bcrypt
- Guarda en sesión: `req.session.fiscalZonaId`, `req.session.fiscalZonaEmail`
- Middleware de protección: `requireFiscalZonaAuth`

### Fiscal Regular Login (`authController.js`)
- Busca en tabla `fiscal` (sin filtro de tipo o con tipo diferente)
- Verifica password con bcrypt
- Guarda en sesión: `req.session.fiscalId`, `req.session.fiscalEmail`
- Redirección: `/`

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

Si un login falla, verificar:

1. **Email correcto**: Debe coincidir exactamente con el de la base de datos
2. **Password correcta**: Según el tipo de usuario (ver tabla arriba)
3. **Tipo de usuario**: El campo `tipo` en la tabla `fiscal` debe ser correcto
4. **Password hasheada**: Debe estar hasheada con bcrypt (verificar con script)
5. **Sesión**: Verificar que `express-session` esté configurado correctamente
6. **Logs del servidor**: Revisar los `console.log` en los controladores

---

## 📝 NOTAS IMPORTANTES

- ⚠️ Las contraseñas en la base de datos están **hasheadas con bcrypt**
- ⚠️ El campo `tipo` en la tabla `fiscal` distingue entre fiscal_general, fiscal_zona y fiscales regulares
- ⚠️ La tabla `administradores` NO tiene campo `tipo`, solo `rol`
- ⚠️ Todos los logins usan `bcrypt.compare()` para verificar contraseñas
- ⚠️ Las sesiones se guardan con `req.session.save()` antes de enviar la respuesta

---

**Última actualización**: Script ejecutado con `check-table-structure.js`
