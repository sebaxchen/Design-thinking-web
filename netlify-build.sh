#!/bin/bash

# Script de build específico para Netlify
echo "🚀 Iniciando build en Netlify..."

# Verificar versión de Node.js
echo "📋 Versión de Node.js:"
node --version

# Verificar versión de npm
echo "📋 Versión de npm:"
npm --version

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Verificar que Angular CLI esté disponible
echo "🔍 Verificando Angular CLI..."
npx ng version

# Build de producción
echo "🔨 Ejecutando build de producción..."
npx ng build --configuration production

# Verificar que el build fue exitoso
if [ -d "dist/learning-center/browser" ]; then
    echo "✅ Build exitoso!"
    echo "📁 Directorio de build: dist/learning-center/browser"
    echo "📊 Contenido del directorio:"
    ls -la dist/learning-center/browser/
else
    echo "❌ Error en el build - directorio no encontrado"
    exit 1
fi

echo "🎉 Build completado exitosamente!"
