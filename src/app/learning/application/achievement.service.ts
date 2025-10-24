import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Achievement, 
  AchievementType, 
  AchievementDefinition, 
  UserStats, 
  CreateAchievementRequest 
} from '../domain/model/achievement.entity';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private achievementsSubject = new BehaviorSubject<Achievement[]>([]);
  public achievements$ = this.achievementsSubject.asObservable();

  private achievementDefinitions: AchievementDefinition[] = [
    {
      type: 'first-task',
      title: 'Primer Paso',
      description: 'Completaste tu primera tarea',
      icon: 'star',
      condition: (stats) => stats.completedTasks >= 1,
      priority: 1
    },
    {
      type: 'five-tasks',
      title: 'En Marcha',
      description: 'Completaste 5 tareas',
      icon: 'trending_up',
      condition: (stats) => stats.completedTasks >= 5,
      priority: 2
    },
    {
      type: 'ten-tasks',
      title: 'Productivo',
      description: 'Completaste 10 tareas',
      icon: 'emoji_events',
      condition: (stats) => stats.completedTasks >= 10,
      priority: 3
    },
    {
      type: 'twenty-tasks',
      title: 'Experto',
      description: 'Completaste 20 tareas',
      icon: 'military_tech',
      condition: (stats) => stats.completedTasks >= 20,
      priority: 4
    },
    {
      type: 'team-member-1-month',
      title: 'Nuevo en el Equipo',
      description: 'Llevas 1 mes en el equipo',
      icon: 'group_add',
      condition: (stats) => stats.daysInTeam >= 30,
      priority: 5
    },
    {
      type: 'team-member-3-months',
      title: 'Miembro Establecido',
      description: 'Llevas 3 meses en el equipo',
      icon: 'group',
      condition: (stats) => stats.daysInTeam >= 90,
      priority: 6
    },
    {
      type: 'team-member-6-months',
      title: 'Veterano',
      description: 'Llevas 6 meses en el equipo',
      icon: 'verified_user',
      condition: (stats) => stats.daysInTeam >= 180,
      priority: 7
    },
    {
      type: 'team-member-1-year',
      title: 'Líder del Equipo',
      description: 'Llevas 1 año en el equipo',
      icon: 'workspace_premium',
      condition: (stats) => stats.daysInTeam >= 365,
      priority: 8
    }
  ];

  constructor() {
    this.loadAchievements();
    this.createSampleAchievements();
  }

  private loadAchievements(): void {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      const achievements = JSON.parse(savedAchievements).map((achievement: any) => ({
        ...achievement,
        earnedAt: new Date(achievement.earnedAt)
      }));
      this.achievementsSubject.next(achievements);
    }
  }

  private saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    this.achievementsSubject.next(achievements);
  }

  checkAndAwardAchievements(userId: string, userStats: UserStats): Achievement[] {
    const currentAchievements = this.achievementsSubject.value;
    const userAchievements = currentAchievements.filter(a => a.userId === userId);
    const newAchievements: Achievement[] = [];

    for (const definition of this.achievementDefinitions) {
      // Verificar si el usuario ya tiene este logro
      const hasAchievement = userAchievements.some(a => a.type === definition.type);
      
      if (!hasAchievement && definition.condition(userStats)) {
        const newAchievement: Achievement = {
          id: this.generateId(),
          userId,
          type: definition.type,
          title: definition.title,
          description: definition.description,
          icon: definition.icon,
          earnedAt: new Date(),
          isNew: true
        };
        
        newAchievements.push(newAchievement);
      }
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...currentAchievements, ...newAchievements];
      this.saveAchievements(updatedAchievements);
    }

    return newAchievements;
  }

  getUserAchievements(userId: string): Achievement[] {
    return this.achievementsSubject.value
      .filter(a => a.userId === userId)
      .sort((a, b) => {
        const aDef = this.achievementDefinitions.find(d => d.type === a.type);
        const bDef = this.achievementDefinitions.find(d => d.type === b.type);
        return (aDef?.priority || 0) - (bDef?.priority || 0);
      });
  }

  markAchievementAsSeen(achievementId: string): void {
    const achievements = this.achievementsSubject.value;
    const updatedAchievements = achievements.map(a => 
      a.id === achievementId ? { ...a, isNew: false } : a
    );
    this.saveAchievements(updatedAchievements);
  }

  getNewAchievements(userId: string): Achievement[] {
    return this.getUserAchievements(userId).filter(a => a.isNew);
  }

  getAchievementDefinition(type: AchievementType): AchievementDefinition | undefined {
    return this.achievementDefinitions.find(d => d.type === type);
  }

  getAllAchievementDefinitions(): AchievementDefinition[] {
    return [...this.achievementDefinitions];
  }

  // Método para forzar la creación de logros de ejemplo
  forceCreateSampleAchievements(): void {
    localStorage.removeItem('achievements');
    this.achievementsSubject.next([]);
    this.createSampleAchievements();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private createSampleAchievements(): void {
    // Crear logros de ejemplo para TODOS los miembros existentes
    const existingAchievements = this.achievementsSubject.value;
    
    if (existingAchievements.length === 0) {
      const sampleAchievements: Achievement[] = [
        // Martín García (ID: 1)
        {
          id: this.generateId(),
          userId: '1',
          type: 'first-task',
          title: 'Primer Paso',
          description: 'Completaste tu primera tarea',
          icon: 'star',
          earnedAt: new Date('2024-01-15'),
          isNew: false
        },
        {
          id: this.generateId(),
          userId: '1',
          type: 'team-member-1-month',
          title: 'Nuevo en el Equipo',
          description: 'Llevas 1 mes en el equipo',
          icon: 'group_add',
          earnedAt: new Date('2024-02-01'),
          isNew: false
        },
        // Ana López (ID: 2)
        {
          id: this.generateId(),
          userId: '2',
          type: 'first-task',
          title: 'Primer Paso',
          description: 'Completaste tu primera tarea',
          icon: 'star',
          earnedAt: new Date('2024-02-20'),
          isNew: false
        },
        // Carlos Ruiz (ID: 3)
        {
          id: this.generateId(),
          userId: '3',
          type: 'first-task',
          title: 'Primer Paso',
          description: 'Completaste tu primera tarea',
          icon: 'star',
          earnedAt: new Date('2024-03-15'),
          isNew: false
        },
        // María Fernández (ID: 4) - Manager con más tiempo
        {
          id: this.generateId(),
          userId: '4',
          type: 'team-member-1-year',
          title: 'Líder del Equipo',
          description: 'Llevas 1 año en el equipo',
          icon: 'workspace_premium',
          earnedAt: new Date('2024-01-01'),
          isNew: false
        },
        {
          id: this.generateId(),
          userId: '4',
          type: 'ten-tasks',
          title: 'Productivo',
          description: 'Completaste 10 tareas',
          icon: 'emoji_events',
          earnedAt: new Date('2024-01-20'),
          isNew: false
        },
        // David Sánchez (ID: 5)
        {
          id: this.generateId(),
          userId: '5',
          type: 'first-task',
          title: 'Primer Paso',
          description: 'Completaste tu primera tarea',
          icon: 'star',
          earnedAt: new Date('2024-04-10'),
          isNew: false
        }
      ];

      this.saveAchievements(sampleAchievements);
    }
  }

  // Método para calcular estadísticas del usuario
  calculateUserStats(
    userId: string, 
    tasks: any[], 
    joinDate: Date
  ): UserStats {
    const userTasks = tasks.filter(task => task.assignee === userId);
    const completedTasks = userTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = userTasks.filter(task => task.status === 'in-progress').length;
    const notStartedTasks = userTasks.filter(task => task.status === 'not-started').length;
    const totalTasks = userTasks.length;
    
    const now = new Date();
    const daysInTeam = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      joinDate,
      daysInTeam
    };
  }
}
