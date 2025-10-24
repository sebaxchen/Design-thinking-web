# Learning Center - Angular Task Management App

Una aplicación moderna de gestión de tareas construida con Angular 18, que incluye un sistema completo de asignación de tareas, seguimiento de progreso y visualización de estadísticas del equipo.

## 🚀 Características Principales

### 📋 Gestión de Tareas
- **Crear tareas** con título, descripción, prioridad y categoría
- **Sistema de estados**: Sin iniciar, En progreso, Terminado
- **Asignación de tareas** a miembros del equipo
- **Prioridades**: Baja, Media, Alta
- **Categorías personalizables**

### 👥 Gestión de Equipo
- **Vista de estadísticas** del equipo en la sección "Categorías"
- **Sistema de semáforo** para carga de trabajo:
  - 🟢 Verde: < 5 tareas
  - 🟡 Amarillo: 5-9 tareas  
  - 🔴 Rojo: 10+ tareas
- **Tarjetas de miembros** con avatares y estadísticas

### 📊 Visualización de Datos
- **Vista Home**: Grid de tareas con tarjetas compactas
- **Vista About**: Tres columnas por estado de tarea
- **Vista Categorías**: Estadísticas del equipo
- **Modal mejorado** con layout de dos columnas

### 🎨 Diseño Moderno
- **Header personalizado** con información del usuario
- **Footer estilizado** con enlaces de navegación
- **Modal responsivo** con scroll funcional
- **Animaciones suaves** y transiciones
- **Tema personalizado** con gradientes

## 🛠️ Tecnologías Utilizadas

- **Angular 18** - Framework principal
- **Angular Material** - Componentes UI
- **Angular Signals** - Gestión de estado
- **TypeScript** - Lenguaje de programación
- **SCSS** - Estilos personalizados
- **RxJS** - Programación reactiva

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── learning/                    # Módulo de aprendizaje
│   │   ├── application/            # Lógica de negocio
│   │   │   ├── learning.store.ts   # Store de categorías
│   │   │   └── task.store.ts       # Store de tareas
│   │   ├── domain/                 # Entidades de dominio
│   │   │   └── model/
│   │   │       ├── category.entity.ts
│   │   │       └── task.entity.ts
│   │   ├── infrastructure/         # APIs y servicios
│   │   └── presentation/           # Vistas y componentes
│   │       └── views/
│   │           ├── category-list/  # Vista de equipo
│   │           └── learning.routes.ts
│   └── shared/                     # Componentes compartidos
│       ├── application/
│       │   └── user.service.ts     # Servicio de usuario
│       ├── infrastructure/         # APIs base
│       └── presentation/
│           ├── components/         # Componentes reutilizables
│           │   ├── header/
│           │   ├── footer-content/
│           │   ├── layout/
│           │   ├── status-selector/
│           │   └── assignee-selector/
│           └── views/              # Vistas principales
│               ├── home/           # Página principal
│               ├── about/          # Vista de tareas por estado
│               ├── task-list/      # Gestión de tareas
│               └── page-not-found/
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm 9+

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/sebaxchen/Design-thinking-web.git
cd Design-thinking-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar el servidor de desarrollo**
```bash
npm start
```

4. **Abrir en el navegador**
```
http://localhost:4200
```

## 📱 Funcionalidades Detalladas

### Modal de Creación de Tareas
- **Layout de dos columnas** para mejor organización
- **Asignación como primera opción** para priorizar la asignación
- **Botones integrados** en la columna derecha
- **Scroll funcional** para contenido extenso
- **Validación en tiempo real**

### Sistema de Estados
- **Sin iniciar**: Tareas nuevas sin comenzar
- **En progreso**: Tareas actualmente en desarrollo
- **Terminado**: Tareas completadas

### Gestión de Equipo
- **Vista de estadísticas** con métricas por miembro
- **Sistema de carga de trabajo** con indicadores visuales
- **Avatares personalizados** para cada miembro
- **Porcentaje de completado** por persona

## 🎯 Características Técnicas

### Arquitectura
- **Domain-Driven Design** con separación clara de responsabilidades
- **Standalone Components** para mejor rendimiento
- **Signals** para gestión reactiva del estado
- **Inyección de dependencias** bien estructurada

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** para diferentes tamaños de pantalla
- **Grid system** adaptable
- **Modal responsivo** que se adapta al contenido

### Accesibilidad
- **ARIA labels** en componentes interactivos
- **Navegación por teclado** completa
- **Contraste de colores** optimizado
- **Focus management** en modales

## 🔧 Configuración Adicional

### Variables de Entorno
El proyecto incluye archivos de configuración para diferentes entornos:
- `environment.ts` - Configuración de producción
- `environment.development.ts` - Configuración de desarrollo

### Temas Personalizados
- Archivo `custom-theme.scss` para personalización de Angular Material
- Variables CSS personalizadas para colores y tipografías
- Gradientes y sombras personalizadas

## 📈 Próximas Mejoras

- [ ] Sistema de notificaciones
- [ ] Filtros avanzados de tareas
- [ ] Exportación de reportes
- [ ] Integración con calendarios
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Sebastian Chen**
- GitHub: [@sebaxchen](https://github.com/sebaxchen)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!