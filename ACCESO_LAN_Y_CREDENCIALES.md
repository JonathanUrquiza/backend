# 🌐 Acceso en LAN y Credenciales de Prueba

## 📡 Direcciones IP para Acceso en LAN

El servidor está corriendo en el puerto **3000** (configurado en `src/index.js`).

### Opciones de acceso:

1. **Localhost (solo en tu PC):**
   - `http://localhost:3000`

2. **Red LAN (desde otros dispositivos en tu red local):**
   - `http://192.168.0.200:3000`
   - `http://192.168.0.5:3000`

> **Nota:** Tienes dos adaptadores de red activos. Usa la IP que corresponda a tu red principal (probablemente `192.168.0.200`).

### Para acceder desde otros dispositivos:

1. Asegúrate de que el firewall de Windows permita conexiones en el puerto 3000
2. Los dispositivos deben estar en la misma red local
3. Usa cualquiera de las URLs anteriores desde el navegador del dispositivo

---

## 🔑 Credenciales de Prueba

Todas las contraseñas están hasheadas con bcrypt en la base de datos por seguridad.

### 1. Super Admin / Admin

**Super Admin (jourquiza86@hotmail.com):**
- **Email:** `jourquiza86@hotmail.com`
- **Password:** `admin123`
- **Rol:** Super Admin
- **Acceso:** http://localhost:3000/admin/login
- **Estado:** ✅ Credencial válida - Funciona OK

**Admin del sistema (admin@sistema.com):**
- **Email:** `admin@sistema.com`
- **Password:** `admin123`
- **Rol:** Admin
- **Acceso:** http://localhost:3000/admin/login
- **Estado:** ✅ Credencial válida - Funciona OK

---

### 2. Fiscales de Zona

**Fiscal Zona 05 (jurquiza86@hotmail.com):**
- **Email:** `jurquiza86@hotmail.com`
- **Password:** `zona123`
- **Tipo:** Fiscal de Zona
- **Zona:** 05
- **Acceso:** http://localhost:3000/fiscal-zona/login
- **Estado:** ✅ Credencial válida - Funciona OK

**Fiscal Zona 05 (fiscal.zona5@sistema.com):**
- **Email:** `fiscal.zona5@sistema.com`
- **Password:** `zona123`
- **Tipo:** Fiscal de Zona
- **Zona:** 05
- **Acceso:** http://localhost:3000/fiscal-zona/login
- **Estado:** ✅ Credencial válida - Funciona OK

---

### 3. Fiscales Regulares

**Fiscal Regular (jonathan.javier.urquiza@fiscales.com):**
- **Email:** `jonathan.javier.urquiza@fiscales.com`
- **Password:** `fiscal123`
- **Tipo:** Fiscal Regular
- **Zona:** 05
- **Acceso:** http://localhost:3000/login
- **Estado:** ✅ Credencial válida - Funciona OK

---

## 🔐 Información de Seguridad

### Bcrypt Hashing
Todas las contraseñas están hasheadas con bcrypt (factor de coste 10) por razones de seguridad:

```javascript
// Ejemplo de hash
'admin123' → '$2b$10$...' (60 caracteres)
'zona123'  → '$2b$10$...' (60 caracteres)
'fiscal123' → '$2b$10$...' (60 caracteres)
```

### ¿Por qué usar hashing?
- ✅ Nunca almacenamos contraseñas en texto plano
- ✅ Incluso si alguien accede a la base de datos, no puede ver las contraseñas
- ✅ bcrypt es resistente a ataques de fuerza bruta
- ✅ Cada hash es único incluso con la misma contraseña (salt aleatorio)

---

## 🧪 Endpoints de Prueba

### Login Forms:
1. **Admin:** http://localhost:3000/admin/login
2. **Fiscal Regular:** http://localhost:3000/login
3. **Fiscal General:** http://localhost:3000/fiscal-general/login
4. **Fiscal de Zona:** http://localhost:3000/fiscal-zona/login

### Dashboards (después del login):
1. **Admin Dashboard:** http://localhost:3000/admin/dashboard
2. **Fiscal Dashboard:** http://localhost:3000/fiscal/dashboard
3. **Fiscal General Dashboard:** http://localhost:3000/fiscal-general/dashboard
4. **Fiscal de Zona Dashboard:** http://localhost:3000/fiscal-zona/dashboard

### Admin - Crear Fiscales:
1. **Crear/Asignar Fiscal:** http://localhost:3000/admin/create-fiscal
2. **Crear Fiscal General:** http://localhost:3000/admin/create-fiscal-general
3. **Crear Fiscal de Zona:** http://localhost:3000/admin/create-fiscal-zona

---

## 🔥 Firewall de Windows

Si no puedes acceder desde otros dispositivos, ejecuta estos comandos en PowerShell como Administrador:

```powershell
# Permitir puerto 3000 TCP (entrante)
New-NetFirewallRule -DisplayName "Node.js App Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Verificar que la regla se creó
Get-NetFirewallRule -DisplayName "Node.js App Port 3000"
```

---

## 📱 Prueba desde Celular/Tablet

1. Conecta tu celular a la misma red WiFi que tu PC
2. Abre el navegador del celular
3. Ingresa: `http://192.168.0.200:3000`
4. Usa cualquiera de las credenciales de arriba para hacer login

---

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor en modo desarrollo (con --watch)
npm run dev

# Iniciar servidor en modo producción
npm run start

# Ver estado de la base de datos
npm run db:status
```

---

**Última actualización:** 2025-10-06

