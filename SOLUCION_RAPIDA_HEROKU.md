# ⚡ Solución Rápida - Error H10 Heroku

## 🔴 El Problema
Tu app crasheó en Heroku con error H10 porque:
1. Faltaba el archivo `Procfile`
2. El comando `--env-file` no es compatible con Heroku
3. Faltaban las variables de entorno configuradas

## ✅ Lo que se Corrigió

### Archivos Creados:
- ✅ `Procfile` - Le dice a Heroku cómo iniciar la app
- ✅ `env.example` - Template de variables de entorno
- ✅ `heroku-config.ps1` - Script para configurar variables en Heroku

### Archivos Modificados:
- ✅ `package.json` - Script `start` sin `--env-file` + agregado `dotenv`
- ✅ `src/index.js` - Agregado `dotenv` condicional
- ✅ `src/config/database.js` - Agregado `dotenv` condicional

---

## 🚀 Pasos para Solucionar AHORA

### 1️⃣ Instalar dotenv localmente
```bash
cd backend
npm install
```

### 2️⃣ Configurar Variables de Entorno en Heroku

**Opción A - Manual (Recomendado):**
```bash
# Configurar base de datos
heroku config:set DB_HOST=mysql-funkotest.alwaysdata.net --app fiscal-app-5f5ed7032cb8
heroku config:set DB_USER=funkotest --app fiscal-app-5f5ed7032cb8
heroku config:set DB_PASSWORD=TU_PASSWORD_REAL --app fiscal-app-5f5ed7032cb8
heroku config:set DB_NAME=funkotest_fiscalizar --app fiscal-app-5f5ed7032cb8
heroku config:set DB_PORT=3306 --app fiscal-app-5f5ed7032cb8

# Configurar sesión (IMPORTANTE: cambiar por una clave segura)
heroku config:set SESSION_SECRET=tu_clave_secreta_muy_larga_y_segura --app fiscal-app-5f5ed7032cb8

# Configurar entorno
heroku config:set NODE_ENV=production --app fiscal-app-5f5ed7032cb8
```

**Opción B - Con Script (PowerShell):**
```powershell
# Primero edita heroku-config.ps1 y cambia TU_PASSWORD_AQUI
# Luego ejecuta:
.\heroku-config.ps1
```

### 3️⃣ Verificar Variables
```bash
heroku config --app fiscal-app-5f5ed7032cb8
```

Debes ver algo como:
```
DB_HOST:        mysql-funkotest.alwaysdata.net
DB_NAME:        funkotest_fiscalizar
DB_PASSWORD:    ********
DB_PORT:        3306
DB_USER:        funkotest
NODE_ENV:       production
SESSION_SECRET: ********
```

### 4️⃣ Deploy a Heroku
```bash
cd backend

# Si es la primera vez, inicializa git:
git init

# Agregar remote de Heroku
heroku git:remote -a fiscal-app-5f5ed7032cb8

# Agregar archivos
git add .

# Commit
git commit -m "Fix: Add Procfile and dotenv for Heroku compatibility"

# Push a Heroku
git push heroku master
# O si estás en otra rama:
git push heroku main:master
```

### 5️⃣ Verificar Logs
```bash
heroku logs --tail --app fiscal-app-5f5ed7032cb8
```

Debes ver:
```
✅ Servidor funcionando en puerto XXXXX
🌐 http://localhost:XXXXX
```

### 6️⃣ Abrir la App
```bash
heroku open --app fiscal-app-5f5ed7032cb8
```

O visita: https://fiscal-app-5f5ed7032cb8.herokuapp.com

---

## 🔍 Si Algo Sale Mal

### Ver el error exacto:
```bash
heroku logs --tail --app fiscal-app-5f5ed7032cb8 | grep -i error
```

### Reiniciar la app:
```bash
heroku restart --app fiscal-app-5f5ed7032cb8
```

### Probar conexión a base de datos:
```bash
heroku run node -e "require('./src/config/database').testConnection()" --app fiscal-app-5f5ed7032cb8
```

### Ver estado:
```bash
heroku ps --app fiscal-app-5f5ed7032cb8
```

---

## ⚠️ IMPORTANTE - Variables Críticas

### Debes configurar OBLIGATORIAMENTE:

1. **DB_PASSWORD** - La contraseña real de tu base de datos
2. **SESSION_SECRET** - Una clave larga y aleatoria para sesiones

**Generar SESSION_SECRET seguro:**
```bash
# En Node.js:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O manualmente:
# Usa una cadena larga y aleatoria de al menos 32 caracteres
```

---

## 📊 Checklist

- [ ] npm install ejecutado en backend
- [ ] Variables de entorno configuradas en Heroku
- [ ] DB_PASSWORD con la contraseña real (no TU_PASSWORD_AQUI)
- [ ] SESSION_SECRET con una clave segura (no la default)
- [ ] Git commit con los nuevos archivos
- [ ] Git push a heroku
- [ ] Verificar logs sin errores
- [ ] App funcionando en https://fiscal-app-5f5ed7032cb8.herokuapp.com

---

## 🎯 Resultado Esperado

Después de seguir estos pasos, tu app debería:
- ✅ Iniciar sin error H10
- ✅ Conectar a la base de datos
- ✅ Mostrar la página de inicio
- ✅ Permitir login en todos los endpoints

---

**¿Necesitas ayuda?** Revisa `HEROKU_DEPLOYMENT.md` para documentación completa.

