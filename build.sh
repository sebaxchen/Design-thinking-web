#!/bin/bash

# Script de build para producción
echo "🚀 Iniciando build de producción..."

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf dist/

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Build de producción
echo "🔨 Ejecutando build de producción..."
npm run build:prod

# Verificar que el build fue exitoso
if [ -d "dist/learning-center/browser" ]; then
    echo "✅ Build exitoso!"
    echo "📁 Directorio de build: dist/learning-center/browser"
    echo "📊 Tamaño del build:"
    du -sh dist/learning-center/browser
else
    echo "❌ Error en el build"
    exit 1
fi

echo "🎉 Build completado exitosamente!"
