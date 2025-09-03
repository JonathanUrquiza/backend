# 🗳️ Sistema Monolítico de Fiscalización de Elecciones

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/usuario/monolito)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21+-blue.svg)](https://expressjs.com/)

## 📋 Descripción

Sistema integral de fiscalización de elecciones desarrollado como una aplicación monolítica. Esta aplicación está diseñada para gestionar y supervisar procesos electorales, proporcionando herramientas para el control de fiscales, presentismo y administración de datos electorales.

## 👨‍💻 Desarrollador

**Jonathan Javier Urquiza**
- Desarrollador Full Stack
- Especialista en sistemas electorales y aplicaciones gubernamentales

## ✨ Características Principales

- 🔐 **Sistema de autenticación** con JWT
- 👥 **Gestión de fiscales** y usuarios
- 📊 **Control de presentismo** y asistencia
- 📧 **Sistema de notificaciones** por email
- 📄 **Generación de reportes** en PDF
- 🖼️ **Procesamiento de imágenes** con Sharp
- 💾 **Base de datos MySQL** integrada
- 🎨 **Interfaz moderna** con Bootstrap 5
- 🌐 **API RESTful** completa

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Multer** - Manejo de archivos
- **PDFKit** - Generación de documentos PDF
- **Nodemailer** - Envío de correos electrónicos

### Frontend
- **EJS** - Motor de plantillas
- **Bootstrap 5** - Framework CSS
- **JavaScript** - Interactividad del cliente

### Herramientas de Desarrollo
- **Nodemon** - Desarrollo en tiempo real
- **TypeScript** - Tipado estático
- **Jest** - Testing
- **Picocolors** - Salida colorizada en consola

## 📋 Requisitos Previos

- **Node.js** v18.0 o superior
- **MySQL** v8.0 o superior
- **npm** v8.0 o superior

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/usuario/monolito.git
   cd monolito
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y configura las siguientes variables:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=fiscalizacion_db
   JWT_SECRET=tu_clave_secreta_jwt
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_email
   ```

4. **Configurar la base de datos**
   ```bash
   # Ejecutar scripts de migración (si están disponibles)
   npm run migrate
   ```

## 🎯 Uso

### Desarrollo
```bash
# Iniciar servidor de desarrollo con recarga automática
npm run dev

# Iniciar servidor de desarrollo con build
npm run dev:build
```

### Producción
```bash
# Iniciar servidor en producción
npm start
```

### Testing
```bash
# Ejecutar tests
npm test
```

## 📁 Estructura del Proyecto

```
monolito/
├── src/
│   ├── index.js          # Punto de entrada de la aplicación
│   ├── routes/           # Rutas de la API
│   ├── controllers/      # Controladores
│   ├── models/           # Modelos de datos
│   ├── middleware/       # Middleware personalizado
│   ├── views/            # Plantillas EJS
│   └── utils/            # Utilidades
├── public/               # Archivos estáticos
├── build/                # Archivos compilados
├── node_modules/         # Dependencias
├── package.json          # Configuración del proyecto
├── .env                  # Variables de entorno (no incluir en git)
├── .gitignore           # Archivos ignorados por git
└── README.md            # Este archivo
```

## 📚 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run dev:build` | Inicia el servidor desde build/ |
| `npm test` | Ejecuta las pruebas |

## 🔧 Configuración

### Puerto del Servidor
El servidor se ejecuta por defecto en el puerto `3000`. Puedes cambiarlo estableciendo la variable de entorno `PORT`:

```bash
export PORT=8080
npm start
```

### Acceso desde Red Local
Para acceder desde otras computadoras en la red local:

1. El servidor está configurado para aceptar conexiones desde cualquier IP
2. Asegúrate de que el firewall permita conexiones en el puerto configurado
3. Usa la IP local de tu máquina: `http://192.168.1.X:3000`

## 🚦 Estado del Proyecto

- ✅ Configuración básica del servidor
- ✅ Sistema de CORS configurado
- ✅ Integración con base de datos MySQL
- ✅ Sistema de autenticación JWT
- ⏳ Desarrollo de módulos de fiscalización
- ⏳ Implementación de reportes
- ⏳ Testing automatizado

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Jonathan Javier Urquiza**
- Email: [jonathan.urquiza@email.com](mailto:jonathan.urquiza@email.com)
- LinkedIn: [Jonathan Javier Urquiza](https://linkedin.com/in/jonathan-urquiza)
- GitHub: [@jonathanjurquiza](https://github.com/jonathanjurquiza)

---

*Desarrollado con ❤️ por Jonathan Javier Urquiza para la modernización de sistemas electorales.*
