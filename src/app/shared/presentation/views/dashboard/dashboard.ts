import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TaskStore } from '../../../../learning/application/task.store';
import { TeamService } from '../../../application/team.service';
import { AchievementService } from '../../../../learning/application/achievement.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatProgressBar,
    MatChipsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private taskStore = inject(TaskStore);
  private teamService = inject(TeamService);
  private achievementService = inject(AchievementService);

  ngOnInit(): void {
    // Initialize with sample data if no tasks exist
    if (this.taskStore.taskCount() === 0) {
      this.taskStore.initializeSampleData();
    }
  }

  // Estadísticas generales
  readonly totalTasks = computed(() => this.taskStore.taskCount());
  readonly completedTasks = computed(() => this.taskStore.completedCount());
  readonly inProgressTasks = computed(() => this.taskStore.inProgressCount());
  readonly notStartedTasks = computed(() => this.taskStore.notStartedCount());
  
  // Porcentajes
  readonly completionRate = computed(() => {
    const total = this.totalTasks();
    return total > 0 ? Math.round((this.completedTasks() / total) * 100) : 0;
  });

  readonly inProgressRate = computed(() => {
    const total = this.totalTasks();
    return total > 0 ? Math.round((this.inProgressTasks() / total) * 100) : 0;
  });

  readonly notStartedRate = computed(() => {
    const total = this.totalTasks();
    return total > 0 ? Math.round((this.notStartedTasks() / total) * 100) : 0;
  });

  // Estadísticas por prioridad
  readonly highPriorityTasks = computed(() => 
    this.taskStore.allTasks().filter(task => task.priority === 'high').length
  );

  readonly mediumPriorityTasks = computed(() => 
    this.taskStore.allTasks().filter(task => task.priority === 'medium').length
  );

  readonly lowPriorityTasks = computed(() => 
    this.taskStore.allTasks().filter(task => task.priority === 'low').length
  );

  // Estadísticas del equipo
  readonly teamMembers = computed(() => this.teamService.allMembers());
  readonly totalTeamMembers = computed(() => this.teamMembers().length);

  // Tareas recientes
  readonly recentTasks = computed(() => 
    this.taskStore.allTasks().slice(0, 5)
  );

  // Productividad del equipo
  readonly teamProductivity = computed(() => {
    const members = this.teamMembers();
    console.log('Team members:', members);
    if (members.length === 0) return [];

    const productivity = members.map(member => {
      const memberTasks = this.taskStore.getTasksByAssignee(member.name);
      console.log(`Tasks for ${member.name}:`, memberTasks);
      const completed = memberTasks.filter(task => task.status === 'completed').length;
      const total = memberTasks.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        name: member.name,
        avatar: member.avatar,
        totalTasks: total,
        completedTasks: completed,
        completionRate: completionRate,
        inProgress: memberTasks.filter(task => task.status === 'in-progress').length,
        notStarted: memberTasks.filter(task => task.status === 'not-started').length
      };
    }).sort((a, b) => b.completionRate - a.completionRate);
    
    console.log('Team productivity:', productivity);
    return productivity;
  });

  // Logros recientes
  readonly recentAchievements = computed(() => {
    const allAchievements = this.achievementService['achievementsSubject'].value;
    return allAchievements
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
      .slice(0, 5);
  });


  // Métricas de tiempo
  readonly todayTasks = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.taskStore.allTasks().filter(task => 
      task.createdAt >= today
    ).length;
  });

  readonly thisWeekTasks = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.taskStore.allTasks().filter(task => 
      task.createdAt >= weekAgo
    ).length;
  });

  // Función para obtener el color de prioridad
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  // Función para obtener el icono de prioridad
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }

  // Función para obtener el color de estado
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'in-progress': return 'accent';
      case 'not-started': return 'warn';
      default: return 'primary';
    }
  }

  // Función para obtener el icono de estado
  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'in-progress': return 'schedule';
      case 'not-started': return 'play_circle_outline';
      default: return 'help';
    }
  }

  // Función para obtener el texto de estado
  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En Progreso';
      case 'not-started': return 'Sin Iniciar';
      default: return 'Desconocido';
    }
  }

  // Función para obtener el texto de prioridad
  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  }
}
