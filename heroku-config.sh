#!/bin/bash
# Script para configurar variables de entorno en Heroku

echo "🚀 Configurando variables de entorno en Heroku..."
echo ""

# Nombre de tu app en Heroku
APP_NAME="fiscal-app-5f5ed7032cb8"

# Variables de Base de Datos
echo "📦 Configurando variables de base de datos..."
heroku config:set DB_HOST=mysql-funkotest.alwaysdata.net --app $APP_NAME
heroku config:set DB_USER=funkotest --app $APP_NAME
heroku config:set DB_PASSWORD=TU_PASSWORD_AQUI --app $APP_NAME
heroku config:set DB_NAME=funkotest_fiscalizar --app $APP_NAME
heroku config:set DB_PORT=3306 --app $APP_NAME

# Variables de Sesión
echo "🔐 Configurando variables de sesión..."
heroku config:set SESSION_SECRET=clave_secreta_muy_segura_para_produccion_cambiar_esto --app $APP_NAME

# Variables de Entorno
echo "⚙️ Configurando variables de entorno..."
heroku config:set NODE_ENV=production --app $APP_NAME

echo ""
echo "✅ Variables configuradas. Verificando..."
echo ""
heroku config --app $APP_NAME

echo ""
echo "🎉 Configuración completa!"
echo "Ahora puedes hacer deploy con: git push heroku master"

