# 🚀 Deployment en Heroku - Guía Completa

## 📋 Problema Detectado y Solución

### Error H10 - App Crashed
**Causa:** El error H10 ocurre cuando la aplicación no puede iniciarse correctamente en Heroku.

**Principales causas corregidas:**
1. ✅ **Procfile faltante** - Heroku necesita saber cómo iniciar tu app
2. ✅ **--env-file no compatible** - Heroku no soporta este flag de Node.js
3. ✅ **Variables de entorno** - Deben configurarse en el dashboard de Heroku
4. ✅ **Puerto dinámico** - Heroku asigna el puerto automáticamente

---

## 📦 Archivos Creados/Modificados

### 1. `Procfile` (NUEVO)
```
web: node src/index.js
```
- Define cómo Heroku debe iniciar tu aplicación
- **Importante:** Sin extensión `.txt`, debe llamarse exactamente `Procfile`

### 2. `package.json` (MODIFICADO)
```json
{
  "scripts": {
    "start": "node src/index.js",  // Sin --env-file para Heroku
    "dev": "node --env-file .env --watch src/index.js"  // Para desarrollo local
  },
  "dependencies": {
    "dotenv": "^16.4.5"  // Agregado para compatibilidad
  }
}
```

### 3. `src/index.js` (MODIFICADO)
```javascript
// Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const port = process.env.PORT || 3000;  // Ya estaba correcto
```

### 4. `src/config/database.js` (MODIFICADO)
```javascript
// Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
```

### 5. `env.example` (NUEVO)
Template de las variables de entorno necesarias.

---

## 🔧 Configuración en Heroku

### Paso 1: Instalar Heroku CLI
```bash
# Si no lo tienes instalado
# Windows: Descargar de https://devcenter.heroku.com/articles/heroku-cli
```

### Paso 2: Login en Heroku
```bash
heroku login
```

### Paso 3: Crear la aplicación (si no existe)
```bash
cd backend
heroku create fiscal-app  # O el nombre que prefieras
```

### Paso 4: Configurar Variables de Entorno
```bash
# Variables de Base de Datos MySQL (REQUERIDAS)
heroku config:set DB_HOST=tu-host-mysql.com
heroku config:set DB_USER=tu_usuario
heroku config:set DB_PASSWORD=tu_password
heroku config:set DB_NAME=elecciones_completo
heroku config:set DB_PORT=3306

# Variables de Sesión (REQUERIDAS)
heroku config:set SESSION_SECRET=tu_clave_secreta_muy_segura_y_larga_aqui

# Variables de Entorno (REQUERIDAS)
heroku config:set NODE_ENV=production

# Verificar que se configuraron correctamente
heroku config
```

### Paso 5: Agregar MySQL Add-on (Opción 1 - Recomendada)
```bash
# ClearDB MySQL (Free tier disponible)
heroku addons:create cleardb:ignite

# Obtener la URL de conexión
heroku config:get CLEARDB_DATABASE_URL

# La URL será algo como: mysql://usuario:password@host/database?reconnect=true
# Debes parsearlo y configurar las variables individuales
```

### Paso 6: MySQL Externo (Opción 2)
Si ya tienes una base de datos MySQL externa (como AlwaysData):
```bash
heroku config:set DB_HOST=mysql-funkotest.alwaysdata.net
heroku config:set DB_USER=funkotest
heroku config:set DB_PASSWORD=tu_password
heroku config:set DB_NAME=funkotest_fiscalizar
heroku config:set DB_PORT=3306
```

### Paso 7: Deploy
```bash
# Asegúrate de estar en el directorio backend
cd backend

# Inicializar git si no lo has hecho
git init

# Agregar remote de Heroku
heroku git:remote -a fiscal-app-5f5ed7032cb8

# Agregar archivos
git add .

# Commit
git commit -m "Fix Heroku deployment - Add Procfile and environment config"

# Push a Heroku
git push heroku master
# O si estás en una rama diferente:
git push heroku main:master
```

---

## 🔍 Debugging en Heroku

### Ver logs en tiempo real
```bash
heroku logs --tail
```

### Ver logs de errores
```bash
heroku logs --tail | grep "error"
```

### Ver estado de la app
```bash
heroku ps
```

### Reiniciar la app
```bash
heroku restart
```

### Acceder a la consola de Node.js
```bash
heroku run node
```

### Ejecutar comandos en el dyno
```bash
# Probar conexión a BD
heroku run node src/database/test-connection.js

# Migrar base de datos
heroku run npm run db:migrate

# Seedear base de datos
heroku run npm run db:seed
```

---

## 🗄️ Base de Datos - Importante

### Opción A: ClearDB (MySQL en Heroku)
1. **Free Tier:** 5MB de almacenamiento
2. **Limitaciones:** Conexiones limitadas
3. **Setup automático:** Heroku configura la URL automáticamente

### Opción B: MySQL Externo (AlwaysData, AWS RDS, etc.)
1. **Más control:** Tu propia base de datos
2. **Sin límites de Heroku:** Depende de tu proveedor
3. **Configuración manual:** Debes configurar las variables

### Migrar la Base de Datos a Heroku
```bash
# 1. Exportar tu base de datos local
mysqldump -u root -p elecciones_completo > dump.sql

# 2. Importar a la base de datos de Heroku
# Si usas ClearDB:
heroku config:get CLEARDB_DATABASE_URL
# Copiar la URL y usarla para importar:
mysql -h host -u usuario -p database < dump.sql

# 3. Verificar la importación
heroku run npm run db:status
```

---

## ⚠️ Errores Comunes y Soluciones

### Error H10 - App crashed
**Causas:**
- Variables de entorno no configuradas
- Error en el Procfile
- Base de datos no accesible
- Puerto incorrecto

**Solución:**
```bash
# Verificar logs
heroku logs --tail

# Verificar variables de entorno
heroku config

# Reiniciar
heroku restart
```

### Error H14 - No web processes running
**Causa:** El Procfile no está bien configurado o no existe

**Solución:**
```bash
# Verificar que el Procfile existe y está correcto
cat Procfile

# Debe contener exactamente:
web: node src/index.js
```

### Error de Conexión a Base de Datos
**Solución:**
```bash
# Verificar variables de DB
heroku config | grep DB

# Probar conexión
heroku run node -e "require('./src/config/database').testConnection().then(() => console.log('OK'))"
```

### Error R10 - Boot timeout
**Causa:** La app tarda más de 60 segundos en iniciarse

**Solución:**
- Optimizar conexión a base de datos
- Remover inicializaciones pesadas
- Verificar que el puerto se bindea correctamente

---

## 📊 Monitoreo

### Métricas de Heroku
```bash
# Ver métricas
heroku metrics

# Ver uso de recursos
heroku ps -a fiscal-app-5f5ed7032cb8
```

### Logs Estructurados
Los logs de tu aplicación aparecerán en:
```bash
heroku logs --tail --source app
```

---

## 🚦 Checklist Pre-Deploy

- [ ] Procfile creado correctamente
- [ ] package.json tiene script `start` sin `--env-file`
- [ ] dotenv agregado a dependencies
- [ ] Variables de entorno configuradas en Heroku
- [ ] Base de datos MySQL accesible desde internet
- [ ] SESSION_SECRET configurado
- [ ] NODE_ENV=production configurado
- [ ] Puerto usando `process.env.PORT`
- [ ] Git inicializado en directorio backend
- [ ] Remote de Heroku configurado
- [ ] Código commiteado

---

## 🔐 Seguridad

### Variables Sensibles
**NUNCA** subas estos archivos al repositorio:
- `.env` (ya está en .gitignore)
- Credenciales de base de datos
- SESSION_SECRET

### Configuración de Sesión en Producción
En `src/index.js`, asegúrate de que en producción uses:
```javascript
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: 'fiscalizacion.sid',
    cookie: {
        secure: true,  // true en producción (HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    }
}));
```

---

## 🌐 URLs de tu Aplicación

Después del deploy exitoso:
- **App:** https://fiscal-app-5f5ed7032cb8.herokuapp.com
- **Admin:** https://fiscal-app-5f5ed7032cb8.herokuapp.com/admin/login
- **Fiscal:** https://fiscal-app-5f5ed7032cb8.herokuapp.com/login
- **Fiscal General:** https://fiscal-app-5f5ed7032cb8.herokuapp.com/fiscal-general/login
- **Fiscal Zona:** https://fiscal-app-5f5ed7032cb8.herokuapp.com/fiscal-zona/login

---

## 📞 Siguiente Paso

1. **Configurar las variables de entorno** (ver Paso 4)
2. **Instalar dotenv localmente:**
   ```bash
   cd backend
   npm install
   ```
3. **Deploy nuevamente:**
   ```bash
   git add .
   git commit -m "Add dotenv and fix Heroku compatibility"
   git push heroku master
   ```
4. **Verificar logs:**
   ```bash
   heroku logs --tail
   ```

---

**Última actualización:** 2025-10-06
**Estado:** ✅ Configuración corregida y lista para deploy

