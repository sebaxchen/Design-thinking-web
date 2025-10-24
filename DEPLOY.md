# 🚀 Guía de Deploy para Netlify

## Configuración del Proyecto

Este proyecto está configurado para deploy automático en Netlify con las siguientes características:

### 📁 Archivos de Configuración

- **`netlify.toml`**: Configuración principal de Netlify
- **`_redirects`**: Redirecciones para SPA
- **`public/_headers`**: Headers de seguridad y caché

### 🔧 Scripts de Build

```bash
# Build de producción (recomendado para Netlify)
npm run build

# Build de desarrollo
npm run build:dev

# Preview del build de producción
npm run preview
```

### ⚙️ Configuración de Netlify

#### Opción 1: Deploy Automático desde GitHub
1. Conecta tu repositorio de GitHub a Netlify
2. Netlify detectará automáticamente la configuración del `netlify.toml`
3. El deploy se ejecutará automáticamente en cada push a la rama `main`

#### Opción 2: Deploy Manual
1. Ejecuta `npm run build` localmente
2. Sube la carpeta `dist/learning-center/browser` a Netlify

### 🌐 Variables de Entorno

Si necesitas configurar variables de entorno en Netlify:

1. Ve a **Site settings** > **Environment variables**
2. Agrega las variables necesarias:
   - `NODE_ENV`: `production`
   - `NODE_VERSION`: `18`

### 📊 Optimizaciones Incluidas

- ✅ **Compresión gzip** automática
- ✅ **Caché optimizado** para archivos estáticos
- ✅ **Headers de seguridad** configurados
- ✅ **Redirecciones SPA** para Angular Router
- ✅ **Build optimizado** para producción
- ✅ **Tree shaking** habilitado
- ✅ **Minificación** de CSS y JS

### 🔍 Troubleshooting

#### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` antes del build

#### Error: "Build failed"
- Revisa los logs de Netlify
- Verifica que el comando de build sea correcto
- Asegúrate de que la versión de Node.js sea compatible

#### Error: "Page not found" en rutas
- Verifica que el archivo `_redirects` esté en la raíz del proyecto
- Asegúrate de que las redirecciones estén configuradas correctamente

### 📱 Características del Deploy

- **URL**: Se generará automáticamente por Netlify
- **HTTPS**: Habilitado por defecto
- **CDN**: Distribución global automática
- **SSL**: Certificado automático
- **Custom Domain**: Configurable en Netlify

### 🎯 Próximos Pasos

1. **Conecta el repositorio** a Netlify
2. **Configura el dominio** personalizado (opcional)
3. **Configura variables de entorno** si es necesario
4. **Haz push** a la rama `main` para deploy automático

¡El proyecto está listo para deploy en Netlify! 🎉
