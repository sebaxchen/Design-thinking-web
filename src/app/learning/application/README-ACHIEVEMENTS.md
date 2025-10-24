# Sistema de Logros

Este sistema permite otorgar logros automáticamente a los usuarios basándose en su actividad y tiempo en el equipo.

## Características

### Tipos de Logros

1. **Logros por Tareas Completadas:**
   - 🌟 **Primer Paso**: Completar la primera tarea
   - 📈 **En Marcha**: Completar 5 tareas
   - 🏆 **Productivo**: Completar 10 tareas
   - 🎖️ **Experto**: Completar 20 tareas

2. **Logros por Tiempo en el Equipo:**
   - 👥 **Nuevo en el Equipo**: 1 mes en el equipo
   - 👨‍👩‍👧‍👦 **Miembro Establecido**: 3 meses en el equipo
   - ✅ **Veterano**: 6 meses en el equipo
   - 🏅 **Líder del Equipo**: 1 año en el equipo

## Uso

### 1. Servicio de Logros (`AchievementService`)

```typescript
// Inyectar el servicio
constructor(private achievementService: AchievementService) {}

// Verificar y otorgar logros
const userStats = this.achievementService.calculateUserStats(userId, tasks, joinDate);
const newAchievements = this.achievementService.checkAndAwardAchievements(userId, userStats);

// Obtener logros del usuario
const userAchievements = this.achievementService.getUserAchievements(userId);
```

### 2. Seguimiento Automático (`AchievementTrackerService`)

```typescript
// El servicio se ejecuta automáticamente cuando cambian las tareas
// También puedes verificar manualmente:
const newAchievements = this.achievementTracker.checkUserAchievements(userId, joinDate);
```

### 3. Modal de Perfil

El modal de perfil ahora incluye una sección de logros que muestra:
- Todos los logros del usuario
- Indicadores de logros nuevos
- Animaciones y efectos visuales
- Tooltips con descripciones

## Configuración

### Agregar Nuevos Tipos de Logros

1. Agregar el tipo en `achievement.entity.ts`:
```typescript
export type AchievementType = 
  | 'first-task' 
  | 'custom-achievement'; // Nuevo tipo
```

2. Agregar la definición en `achievement.service.ts`:
```typescript
{
  type: 'custom-achievement',
  title: 'Mi Logro Personalizado',
  description: 'Descripción del logro',
  icon: 'custom_icon',
  condition: (stats) => stats.completedTasks >= 50, // Condición
  priority: 9
}
```

### Personalizar Notificaciones

Las notificaciones se pueden personalizar modificando:
- `achievement-notification.component.ts` - Componente de notificación
- `achievement-tracker.service.ts` - Lógica de notificaciones
- `styles.css` - Estilos globales

## Almacenamiento

Los logros se almacenan en `localStorage` por simplicidad. En una aplicación de producción, deberían almacenarse en una base de datos.

## Animaciones

El sistema incluye varias animaciones:
- **Pulse**: Para logros nuevos
- **Bounce**: Para badges de "NUEVO"
- **SlideIn/SlideOut**: Para notificaciones
- **Hover effects**: Para interacciones

## Responsive Design

El sistema es completamente responsivo y se adapta a diferentes tamaños de pantalla.
