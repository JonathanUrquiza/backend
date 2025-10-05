# 🚀 Guía de Migración a MySQL en AlwaysData

Esta guía te ayudará a migrar tu proyecto desde SQLite local a MySQL en AlwaysData.

---

## 📋 Paso 1: Crear Base de Datos en AlwaysData

1. **Inicia sesión en AlwaysData**: https://admin.alwaysdata.com
2. **Ve a "Databases" (Bases de datos)** en el menú lateral
3. **Haz clic en "Add a database"**
4. Completa el formulario:
   - **Type**: MySQL
   - **Name**: `tunombre_elecciones` (reemplaza "tunombre" con tu usuario)
   - **User**: Se creará automáticamente o usa uno existente
   - **Password**: Anota bien este password

5. **Anota los datos de conexión**:
   ```
   Host: mysql-tunombre.alwaysdata.net
   Port: 3306
   Database: tunombre_elecciones
   User: tunombre
   Password: [el que configuraste]
   ```

---

## 🔧 Paso 2: Configurar Variables de Entorno

1. **Crea un archivo `.env`** en la raíz del proyecto (si no existe)

2. **Copia esta configuración** (reemplaza con tus datos de AlwaysData):

```env
# =============================================================================
# CONFIGURACIÓN DE BASE DE DATOS - MYSQL EN ALWAYSDATA
# =============================================================================
DB_TYPE=mysql

# Datos de conexión de AlwaysData
DB_HOST=mysql-tunombre.alwaysdata.net
DB_PORT=3306
DB_NAME=tunombre_elecciones
DB_USER=tunombre
DB_PASSWORD=tu_password_aqui

# =============================================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =============================================================================
NODE_ENV=production
PORT=3000

# =============================================================================
# SEGURIDAD
# =============================================================================
SESSION_SECRET=genera_una_clave_aleatoria_muy_larga_aqui
JWT_SECRET=genera_otra_clave_aleatoria_diferente_aqui
```

**⚠️ IMPORTANTE**: 
- NO subas el archivo `.env` a Git (ya está en `.gitignore`)
- Guarda una copia segura de tus credenciales

---

## 📤 Paso 3: Exportar Datos desde SQLite

### Opción A: Usar Sequelize (Recomendado)

El proyecto ya tiene `mysql2` instalado, solo necesitas:

```bash
# 1. Verifica que tu .env esté configurado con SQLite primero
DB_TYPE=sqlite
DATABASE_PATH=./elecciones.db

# 2. Exporta tus datos (puedes crear un script personalizado)
npm run db:test
```

### Opción B: Exportar manualmente

Si tienes pocos datos, puedes usar herramientas como:
- **DB Browser for SQLite**: https://sqlitebrowser.org/
- Exportar a SQL y luego importar a MySQL

---

## 🚀 Paso 4: Configurar MySQL y Sincronizar

1. **Cambia tu `.env` a MySQL**:
```env
DB_TYPE=mysql
```

2. **Prueba la conexión**:
```bash
npm run db:status
```

Deberías ver:
```
✅ Conexión a MySQL exitosa con Sequelize
📊 Base de datos: tunombre_elecciones en mysql-tunombre.alwaysdata.net
```

3. **Sincroniza los modelos** (esto creará las tablas):
```bash
npm run db:fresh
```

⚠️ **CUIDADO**: `db:fresh` eliminará y recreará todas las tablas. Si ya tienes datos en MySQL, usa migraciones en su lugar.

---

## 🔄 Paso 5: Importar Datos (si es necesario)

Si exportaste datos de SQLite, ahora impórtalos a MySQL:

### Usando phpMyAdmin en AlwaysData:
1. Ve a **Databases > phpMyAdmin**
2. Selecciona tu base de datos
3. Haz clic en **Import**
4. Sube tu archivo SQL

### Usando línea de comandos:
```bash
mysql -h mysql-tunombre.alwaysdata.net -u tunombre -p tunombre_elecciones < datos_exportados.sql
```

---

## ✅ Paso 6: Verificar Funcionamiento

1. **Inicia el servidor**:
```bash
npm start
```

2. **Verifica los logs**:
```
🔗 Configurando MySQL en: mysql-tunombre.alwaysdata.net:3306/tunombre_elecciones
✅ Conexión a MySQL exitosa con Sequelize
```

3. **Prueba la aplicación**:
   - Abre tu navegador en `http://localhost:3000`
   - Intenta registrar un usuario
   - Verifica que los datos se guarden

---

## 🔍 Solución de Problemas

### Error: "Access denied for user"
- Verifica que el usuario y password en `.env` sean correctos
- Asegúrate de que el usuario tenga permisos sobre la base de datos

### Error: "Can't connect to MySQL server"
- Verifica el `DB_HOST` (debe ser `mysql-tunombre.alwaysdata.net`)
- Verifica que el puerto sea `3306`
- Comprueba que tu IP no esté bloqueada (AlwaysData permite todas por defecto)

### Error: "Unknown database"
- Verifica que el nombre de la base de datos en `DB_NAME` exista en AlwaysData
- Debe coincidir exactamente con el nombre que creaste

### Las tablas no se crean
```bash
# Fuerza la sincronización
npm run db:fresh
```

---

## 📊 Diferencias entre SQLite y MySQL

| Característica | SQLite | MySQL |
|----------------|--------|--------|
| Ubicación | Archivo local | Servidor remoto |
| Concurrencia | Limitada | Alta |
| Tamaño máximo | ~140 TB | Prácticamente ilimitado |
| Backups | Copiar archivo `.db` | Usar `mysqldump` o phpMyAdmin |
| Velocidad lectura | Muy rápida | Rápida (depende de red) |
| Velocidad escritura | Rápida | Media (depende de red) |

---

## 🔐 Seguridad en Producción

Cuando despliegues a producción:

1. **Cambia NODE_ENV a production**:
```env
NODE_ENV=production
```

2. **Deshabilita logging de SQL**:
   - El archivo `database.js` ya lo hace automáticamente en producción

3. **Usa SSL** (si AlwaysData lo soporta):
```javascript
dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
}
```

---

## 🔄 Volver a SQLite (desarrollo local)

Si quieres volver a trabajar con SQLite localmente:

```env
DB_TYPE=sqlite
DATABASE_PATH=./elecciones.db
```

Reinicia el servidor y listo.

---

## 📞 Soporte

- **Documentación AlwaysData**: https://help.alwaysdata.com/en/databases/
- **Documentación Sequelize**: https://sequelize.org/docs/v6/

---

¡Listo! Tu aplicación ahora está conectada a MySQL en la nube 🎉

