@echo off
echo 🚀 Iniciando build de producción...

REM Limpiar builds anteriores
echo 🧹 Limpiando builds anteriores...
if exist dist rmdir /s /q dist

REM Instalar dependencias
echo 📦 Instalando dependencias...
npm ci

REM Build de producción
echo 🔨 Ejecutando build de producción...
npm run build:prod

REM Verificar que el build fue exitoso
if exist "dist\learning-center\browser" (
    echo ✅ Build exitoso!
    echo 📁 Directorio de build: dist\learning-center\browser
    echo 📊 Tamaño del build:
    dir "dist\learning-center\browser" /s
) else (
    echo ❌ Error en el build
    exit /b 1
)

echo 🎉 Build completado exitosamente!
pause
