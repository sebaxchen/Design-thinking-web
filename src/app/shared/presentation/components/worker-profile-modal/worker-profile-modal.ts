import { Component, Inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskStore } from '../../../../learning/application/task.store';
import { inject } from '@angular/core';
import { Task } from '../../../../learning/domain/model/task.entity';
import { AchievementService } from '../../../../learning/application/achievement.service';
import { AchievementTrackerService } from '../../../../learning/application/achievement-tracker.service';
import { Achievement } from '../../../../learning/domain/model/achievement.entity';

export interface WorkerProfileData {
  member: {
    id: string;
    name: string;
    position: string;
    joinDate?: Date;
  };
}

@Component({
  selector: 'app-worker-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="user-profile">
          <div class="avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div class="user-info">
            <h1>{{ member.name }}</h1>
            <p>{{ member.position }}</p>
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>Activo</span>
            </div>
          </div>
        </div>
        <button mat-icon-button (click)="closeModal()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Stats Section -->
        <div class="stats-section">
          <h2>Estadísticas de Productividad</h2>
          <div class="stats-grid">
            <div class="stat-card completed">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ completedTasksCount() }}</span>
                <span class="stat-label">Completadas</span>
              </div>
            </div>
            <div class="stat-card in-progress">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ inProgressTasksCount() }}</span>
                <span class="stat-label">En Progreso</span>
              </div>
            </div>
            <div class="stat-card pending">
              <div class="stat-icon">
                <mat-icon>pending</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ notStartedTasksCount() }}</span>
                <span class="stat-label">Pendientes</span>
              </div>
            </div>
            <div class="stat-card efficiency">
              <div class="stat-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ completionRate() }}%</span>
                <span class="stat-label">Eficiencia</span>
              </div>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-header">
              <span>Progreso General</span>
              <span>{{ completionRate() }}%</span>
            </div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="completionRate()"
              class="progress-bar">
            </mat-progress-bar>
          </div>
        </div>

        <!-- Achievements -->
        <div class="achievements-section">
          <div class="section-header">
            <h2>Logros</h2>
            <span class="achievement-count">{{ userAchievements.length }}</span>
          </div>
          <div class="achievements-list" *ngIf="userAchievements.length > 0; else noAchievements">
            <div 
              *ngFor="let achievement of userAchievements" 
              class="achievement-item"
              [matTooltip]="achievement.description">
              <div class="achievement-icon">
                <mat-icon>{{ achievement.icon }}</mat-icon>
              </div>
              <div class="achievement-details">
                <h3>{{ achievement.title }}</h3>
                <p>{{ achievement.description }}</p>
                <span class="achievement-date">{{ achievement.earnedAt | date:'short' }}</span>
              </div>
            </div>
          </div>
          <ng-template #noAchievements>
            <div class="empty-state">
              <mat-icon>emoji_events</mat-icon>
              <h3>No hay logros aún</h3>
              <p>Completa tareas para desbloquear logros</p>
            </div>
          </ng-template>
        </div>

        <!-- Recent Tasks -->
        <div class="tasks-section">
          <div class="section-header">
            <h2>Tareas Recientes</h2>
          </div>
          <div class="tasks-list" *ngIf="recentTasks().length > 0; else noTasks">
            <div *ngFor="let task of recentTasks()" class="task-item">
              <div class="task-header">
                <h3>{{ task.title }}</h3>
                <mat-chip [class]="'status-' + task.status">
                  {{ getStatusLabel(task.status) }}
                </mat-chip>
              </div>
              <p class="task-description">{{ task.description }}</p>
              <div class="task-footer">
                <span class="task-priority priority-{{ task.priority }}">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span class="task-date">{{ task.createdAt | date:'short' }}</span>
              </div>
            </div>
          </div>
          <ng-template #noTasks>
            <div class="empty-state">
              <mat-icon>assignment</mat-icon>
              <h3>No hay tareas asignadas</h3>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid #e1e5e9;
      position: relative;
    }

    .modal-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #667eea;
    }

    .modal-header {
      background: #f8f9fa;
      color: #2c3e50;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      border-bottom: 1px solid #e1e5e9;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      background: transparent;
      padding: 0;
    }

    .avatar {
      width: 56px;
      height: 56px;
      background: #667eea;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      border: none;
    }

    .user-info h1 {
      margin: 0 0 4px 0;
      font-size: 22px;
      font-weight: 600;
      color: #2c3e50;
      text-shadow: none;
      letter-spacing: 0;
    }

    .user-info p {
      margin: 0 0 8px 0;
      color: #6c757d;
      font-size: 14px;
      font-weight: 400;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #e8f5e8;
      color: #2e7d32;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid #c8e6c9;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #4caf50;
      border-radius: 50%;
    }

    .close-button {
      color: #6c757d;
      background: transparent;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      border: none;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: #fee;
      color: #f44336;
    }

    .modal-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }

    .stats-section {
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e1e5e9;
      position: relative;
      overflow: hidden;
    }

    .stats-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #667eea;
    }

    .stats-section h2 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s ease;
      border: 1px solid #e1e5e9;
    }

    .stat-card:hover {
      background: #ffffff;
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
    }

    .stat-card.completed .stat-icon { 
      background: #4caf50;
    }
    .stat-card.in-progress .stat-icon { 
      background: #ff9800;
    }
    .stat-card.pending .stat-icon { 
      background: #9e9e9e;
    }
    .stat-card.efficiency .stat-icon { 
      background: #667eea;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-label {
      font-size: 11px;
      color: #6c757d;
      font-weight: 500;
    }

    .progress-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2c3e50;
      font-size: 12px;
    }

    .progress-bar {
      height: 6px;
      border-radius: 3px;
    }

    .achievements-section,
    .tasks-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e1e5e9;
      position: relative;
      overflow: hidden;
    }

    .achievements-section::before,
    .tasks-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #667eea;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .section-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
      text-shadow: none;
      letter-spacing: 0;
    }

    .achievement-count {
      background: #667eea;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      border: none;
    }

    .achievements-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .achievement-item {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid #e1e5e9;
      min-height: 120px;
      justify-content: center;
    }

    .achievement-item:hover {
      background: #ffffff;
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .achievement-icon {
      width: 40px;
      height: 40px;
      background: #667eea;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .achievement-item:hover .achievement-icon {
      transform: scale(1.05);
    }

    .achievement-details {
      flex: 1;
      width: 100%;
    }

    .achievement-details h3 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1.2;
    }

    .achievement-details p {
      margin: 0 0 4px 0;
      font-size: 11px;
      color: #6c757d;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .achievement-date {
      font-size: 10px;
      color: #6c757d;
      font-weight: 500;
      background: #e8f5e8;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-block;
    }

    .tasks-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
    }

    .task-item {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 16px;
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid #e1e5e9;
      position: relative;
    }

    .task-item:hover {
      background: #ffffff;
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .task-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #2c3e50;
      flex: 1;
      line-height: 1.3;
    }

    .task-description {
      margin: 0 0 12px 0;
      font-size: 13px;
      color: #6c757d;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #95a5a6;
    }

    .task-priority {
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .task-priority.priority-high {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    .task-priority.priority-medium {
      background: #fff8e1;
      color: #e65100;
      border: 1px solid #ffecb3;
    }

    .task-priority.priority-low {
      background: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .task-date {
      font-weight: 500;
      color: #6c757d;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #6c757d;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #adb5bd;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #495057;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
      color: #6c757d;
    }

    .status-completed {
      background: #e8f5e8 !important;
      color: #2e7d32 !important;
      border: 1px solid #c8e6c9 !important;
    }

    .status-in-progress {
      background: #fff8e1 !important;
      color: #f57c00 !important;
      border: 1px solid #ffecb3 !important;
    }

    .status-not-started {
      background: #f5f5f5 !important;
      color: #6c757d !important;
      border: 1px solid #e0e0e0 !important;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .achievements-list {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(6, 1fr);
      }
    }

    @media (max-width: 768px) {
      .achievements-list {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(6, 1fr);
        gap: 12px;
      }
      
      .achievement-item {
        padding: 10px;
        min-height: 100px;
      }
      
      .achievement-icon {
        width: 32px;
        height: 32px;
        font-size: 16px;
      }
      
      .achievement-details h3 {
        font-size: 13px;
      }
      
      .achievement-details p {
        font-size: 10px;
      }
    }

    @media (max-width: 480px) {
      .achievements-list {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        gap: 8px;
      }
      
      .achievement-item {
        padding: 8px;
        gap: 6px;
        min-height: 80px;
      }
      
      .achievement-icon {
        width: 28px;
        height: 28px;
        font-size: 14px;
      }
      
      .achievement-details h3 {
        font-size: 12px;
      }
      
      .achievement-details p {
        font-size: 9px;
      }
    }
  `]
})
export class WorkerProfileModal {
  dialogRef = inject(MatDialogRef<WorkerProfileModal>);
  taskStore: TaskStore = inject(TaskStore);
  achievementService: AchievementService = inject(AchievementService);
  achievementTracker: AchievementTrackerService = inject(AchievementTrackerService);
  
  member: any;
  userAchievements: Achievement[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: WorkerProfileData) {
    this.member = data.member;
    this.loadUserAchievements();
    this.checkForNewAchievements();
  }

  // Computed properties for stats
  completedTasksCount = computed(() => {
    const tasks = this.taskStore.getTasksByAssignee(this.member.name);
    return tasks.filter(task => task.status === 'completed').length;
  });

  inProgressTasksCount = computed(() => {
    const tasks = this.taskStore.getTasksByAssignee(this.member.name);
    return tasks.filter(task => task.status === 'in-progress').length;
  });

  notStartedTasksCount = computed(() => {
    const tasks = this.taskStore.getTasksByAssignee(this.member.name);
    return tasks.filter(task => task.status === 'not-started').length;
  });

  completionRate = computed(() => {
    const tasks = this.taskStore.getTasksByAssignee(this.member.name);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  });

  recentTasks = computed(() => {
    return this.taskStore.getTasksByAssignee(this.member.name)
      .slice(0, 5)
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  loadUserAchievements() {
    if (!this.member || !this.member.id) {
      this.userAchievements = [];
      return;
    }
    
    this.userAchievements = this.achievementService.getUserAchievements(this.member.id);
  }

  checkForNewAchievements() {
    if (!this.member || !this.member.name) {
      return;
    }

    // Calcular estadísticas reales del usuario
    const userTasks = this.taskStore.getTasksByAssignee(this.member.name);
    const completedTasks = userTasks.filter(task => task.status === 'completed').length;
    const joinDate = this.member.joinDate || new Date();
    const daysInTeam = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    // Verificar y otorgar logros basados en condiciones reales
    this.checkAndAwardRealAchievements(completedTasks, daysInTeam);
    
    // Recargar logros después de verificar
    this.loadUserAchievements();
  }

  private checkAndAwardRealAchievements(completedTasks: number, daysInTeam: number) {
    const currentAchievements = this.achievementService['achievementsSubject'].value;
    const userAchievements = currentAchievements.filter(a => a.userId === this.member.id);
    const newAchievements: Achievement[] = [];

    // Verificar logro de primera tarea
    if (completedTasks >= 1 && !userAchievements.some(a => a.type === 'first-task')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'first-task',
        title: 'Primer Paso',
        description: 'Completaste tu primera tarea',
        icon: 'star',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logro de 3 tareas
    if (completedTasks >= 3 && !userAchievements.some(a => a.type === 'three-tasks')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'three-tasks',
        title: 'Comenzando',
        description: 'Completaste 3 tareas',
        icon: 'play_arrow',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logro de 5 tareas
    if (completedTasks >= 5 && !userAchievements.some(a => a.type === 'five-tasks')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'five-tasks',
        title: 'En Marcha',
        description: 'Completaste 5 tareas',
        icon: 'trending_up',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logro de 10 tareas
    if (completedTasks >= 10 && !userAchievements.some(a => a.type === 'ten-tasks')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'ten-tasks',
        title: 'Productivo',
        description: 'Completaste 10 tareas',
        icon: 'emoji_events',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logro de 15 tareas
    if (completedTasks >= 15 && !userAchievements.some(a => a.type === 'fifteen-tasks')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'fifteen-tasks',
        title: 'Avanzado',
        description: 'Completaste 15 tareas',
        icon: 'rocket_launch',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logro de 20 tareas
    if (completedTasks >= 20 && !userAchievements.some(a => a.type === 'twenty-tasks')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'twenty-tasks',
        title: 'Experto',
        description: 'Completaste 20 tareas',
        icon: 'military_tech',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logro de 50 tareas
    if (completedTasks >= 50 && !userAchievements.some(a => a.type === 'fifty-tasks')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'fifty-tasks',
        title: 'Maestro',
        description: 'Completaste 50 tareas',
        icon: 'diamond',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Verificar logros de tiempo en el equipo
    if (daysInTeam >= 30 && !userAchievements.some(a => a.type === 'team-member-1-month')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'team-member-1-month',
        title: 'Nuevo en el Equipo',
        description: 'Llevas 1 mes en el equipo',
        icon: 'group_add',
        earnedAt: new Date(),
        isNew: false
      });
    }

    if (daysInTeam >= 90 && !userAchievements.some(a => a.type === 'team-member-3-months')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'team-member-3-months',
        title: 'Miembro Establecido',
        description: 'Llevas 3 meses en el equipo',
        icon: 'group',
        earnedAt: new Date(),
        isNew: false
      });
    }

    if (daysInTeam >= 180 && !userAchievements.some(a => a.type === 'team-member-6-months')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'team-member-6-months',
        title: 'Veterano',
        description: 'Llevas 6 meses en el equipo',
        icon: 'verified_user',
        earnedAt: new Date(),
        isNew: false
      });
    }

    if (daysInTeam >= 365 && !userAchievements.some(a => a.type === 'team-member-1-year')) {
      newAchievements.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        userId: this.member.id,
        type: 'team-member-1-year',
        title: 'Líder del Equipo',
        description: 'Llevas 1 año en el equipo',
        icon: 'workspace_premium',
        earnedAt: new Date(),
        isNew: false
      });
    }

    // Logros de productividad
    const totalTasks = this.taskStore.getTasksByAssignee(this.member.name).length;
    if (totalTasks > 0) {
      const completionRate = (completedTasks / totalTasks) * 100;
      
      if (completionRate >= 80 && !userAchievements.some(a => a.type === 'high-efficiency')) {
        newAchievements.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2),
          userId: this.member.id,
          type: 'high-efficiency',
          title: 'Alta Eficiencia',
          description: 'Tienes más del 80% de tareas completadas',
          icon: 'speed',
          earnedAt: new Date(),
          isNew: false
        });
      }
    }

    // Guardar nuevos logros si los hay
    if (newAchievements.length > 0) {
      const updatedAchievements = [...currentAchievements, ...newAchievements];
      this.achievementService['saveAchievements'](updatedAchievements);
    }
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'completed': 'Completada',
      'in-progress': 'En Progreso',
      'not-started': 'No Iniciada'
    };
    return statusLabels[status.toLowerCase()] || status;
  }

  getPriorityLabel(priority: string): string {
    const priorityLabels: { [key: string]: string } = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return priorityLabels[priority.toLowerCase()] || priority;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
