import { Injectable, inject, effect } from '@angular/core';
import { TaskStore } from './task.store';
import { AchievementService } from './achievement.service';
import { TeamService } from '../../shared/application/team.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementTrackerService {
  private taskStore = inject(TaskStore);
  private achievementService = inject(AchievementService);
  private teamService = inject(TeamService);

  constructor() {
    // Usar effect para reaccionar a cambios en las tareas
    effect(() => {
      // Acceder al signal para que el effect se ejecute cuando cambie
      const tasks = this.taskStore.allTasks();
      this.checkAllUsersAchievements();
    });

    // También reaccionar a cambios en los miembros del equipo
    effect(() => {
      const members = this.teamService.allMembers();
      this.checkAllUsersAchievements();
    });
  }

  private checkAllUsersAchievements() {
    const tasks = this.taskStore.allTasks();
    const members = this.teamService.allMembers();
    
    members.forEach(member => {
      const userTasks = tasks.filter(task => task.assignee === member.name);
      const joinDate = member.joinDate || new Date();
      
      const userStats = this.achievementService.calculateUserStats(
        member.id,
        userTasks,
        joinDate
      );

      const newAchievements = this.achievementService.checkAndAwardAchievements(
        member.id,
        userStats
      );

      // Los logros se otorgan automáticamente sin notificaciones
    });
  }

  private getUniqueUsers(tasks: any[]): string[] {
    const users = new Set<string>();
    tasks.forEach(task => {
      if (task.assignee) {
        users.add(task.assignee);
      }
    });
    return Array.from(users);
  }

  private getUserJoinDate(userId: string): Date {
    // Por ahora retornamos una fecha por defecto
    // En una implementación real, esto vendría de un servicio de usuarios
    return new Date('2024-01-01');
  }


  // Método público para verificar logros de un usuario específico
  checkUserAchievements(userId: string, joinDate: Date) {
    const tasks = this.taskStore.allTasks();
    const userTasks = tasks.filter(task => task.assignee === userId);
    
    const userStats = this.achievementService.calculateUserStats(
      userId,
      userTasks,
      joinDate
    );

    return this.achievementService.checkAndAwardAchievements(userId, userStats);
  }

  // Método para verificar logros de un miembro específico por nombre
  checkMemberAchievements(memberName: string) {
    const member = this.teamService.getMemberByName(memberName);
    if (!member) return [];

    const tasks = this.taskStore.allTasks();
    const userTasks = tasks.filter(task => task.assignee === memberName);
    const joinDate = member.joinDate || new Date();
    
    const userStats = this.achievementService.calculateUserStats(
      member.id,
      userTasks,
      joinDate
    );

    return this.achievementService.checkAndAwardAchievements(member.id, userStats);
  }
}
