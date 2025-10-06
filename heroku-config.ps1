# Script PowerShell para configurar variables de entorno en Heroku

Write-Host "🚀 Configurando variables de entorno en Heroku..." -ForegroundColor Green
Write-Host ""

# Nombre de tu app en Heroku
$APP_NAME = "fiscal-app-5f5ed7032cb8"

# Variables de Base de Datos
Write-Host "📦 Configurando variables de base de datos..." -ForegroundColor Cyan
heroku config:set DB_HOST=mysql-funkotest.alwaysdata.net --app $APP_NAME
heroku config:set DB_USER=funkotest --app $APP_NAME
heroku config:set DB_PASSWORD=TU_PASSWORD_AQUI --app $APP_NAME
heroku config:set DB_NAME=funkotest_fiscalizar --app $APP_NAME
heroku config:set DB_PORT=3306 --app $APP_NAME

# Variables de Sesión
Write-Host "🔐 Configurando variables de sesión..." -ForegroundColor Cyan
heroku config:set SESSION_SECRET=clave_secreta_muy_segura_para_produccion_cambiar_esto --app $APP_NAME

# Variables de Entorno
Write-Host "⚙️ Configurando variables de entorno..." -ForegroundColor Cyan
heroku config:set NODE_ENV=production --app $APP_NAME

Write-Host ""
Write-Host "✅ Variables configuradas. Verificando..." -ForegroundColor Green
Write-Host ""
heroku config --app $APP_NAME

Write-Host ""
Write-Host "🎉 Configuración completa!" -ForegroundColor Green
Write-Host "Ahora puedes hacer deploy con: git push heroku master" -ForegroundColor Yellow

