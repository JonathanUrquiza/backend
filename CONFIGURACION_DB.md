# Configuración de Base de Datos

Para que la aplicación funcione correctamente, necesitas crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Base de Datos SQLite
DB_NAME=funkotest_elecciones.db
DB_PATH=./database

# Otras configuraciones
NODE_ENV=development
PORT=3000
SESSION_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
```

## Pasos para configurar:

1. Crea un archivo llamado `.env` en la raíz del proyecto
2. Copia el contenido de arriba (SQLite es mucho más simple que MySQL!)
3. Ejecuta `npm run db:status` para probar la conexión
4. La base de datos SQLite se creará automáticamente en la carpeta `database/`

## Scripts disponibles:

- `npm run db:status` - Probar conexión a la base de datos
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Ejecutar seeds
- `npm run db:fresh` - Reiniciar base de datos con migraciones y seeds
- `node src/database/test-connection.js` - Prueba detallada de conexión
