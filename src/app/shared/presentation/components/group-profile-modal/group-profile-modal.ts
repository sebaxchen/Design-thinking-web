import { Component, Inject, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskStore } from '../../../../learning/application/task.store';
import { TeamService } from '../../../application/team.service';
import { Group, GroupsService } from '../../../application/groups.service';

@Component({
  selector: 'app-group-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <div class="modal-container" [style.--group-color]="getGroupColor()">
      <!-- Header -->
      <div class="modal-header">
        <div class="group-profile">
          <div class="avatar" [style.background-color]="getGroupColor()">
            <mat-icon>groups</mat-icon>
          </div>
          <div class="group-info">
            <h1>{{ group.name }}</h1>
            <p>{{ group.members.length }} miembro(s) • {{ group.tasks.length }} tarea(s)</p>
          </div>
        </div>
        <button mat-icon-button (click)="closeModal()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Group Stats Section -->
        <div class="stats-section">
          <h2>Estadísticas del Grupo</h2>
          <div class="stats-grid">
            <div class="stat-card total-tasks">
              <div class="stat-icon">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ group.tasks.length }}</span>
                <span class="stat-label">Total Tareas</span>
              </div>
            </div>
            <div class="stat-card completed">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ completedTasks() }}</span>
                <span class="stat-label">Completadas</span>
              </div>
            </div>
            <div class="stat-card in-progress">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ inProgressTasks() }}</span>
                <span class="stat-label">En Progreso</span>
              </div>
            </div>
            <div class="stat-card pending">
              <div class="stat-icon">
                <mat-icon>pending</mat-icon>
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ notStartedTasks() }}</span>
                <span class="stat-label">Pendientes</span>
              </div>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-header">
              <span>Progreso del Grupo</span>
              <span>{{ groupCompletionRate() }}%</span>
            </div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="groupCompletionRate()"
              class="progress-bar">
            </mat-progress-bar>
          </div>
        </div>

        <!-- Members Section -->
        <div class="members-section">
          <div class="section-header">
            <h2>Miembros del Grupo</h2>
            <span class="member-count">{{ group.members.length }}</span>
          </div>
          <div class="members-grid">
            <div *ngFor="let member of group.members" class="member-card">
              <div class="member-avatar" [style.--dynamic-color]="getMemberColor(member.name)" [style.background-color]="getMemberColor(member.name)">
                {{ getMemberInitials(member.name) }}
              </div>
              <div class="member-details">
                <h3>{{ member.name }}</h3>
                <div class="member-stats">
                  <div class="member-stat">
                    <span class="stat-value">{{ getMemberTasks(member.id) }}</span>
                    <span class="stat-name">Tareas</span>
                  </div>
                  <div class="member-stat">
                    <span class="stat-value">{{ getMemberCompletionRate(member.id) }}%</span>
                    <span class="stat-name">Eficiencia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks Section -->
        <div class="tasks-section">
          <div class="section-header">
            <h2>Tareas del Grupo</h2>
          </div>
          <div class="tasks-list" *ngIf="group.tasks.length > 0; else noTasks">
            <div *ngFor="let task of group.tasks" class="task-item">
              <div class="task-header">
                <h3>{{ task.title }}</h3>
                <mat-chip [class]="'status-' + getTaskStatus(task.id)">
                  {{ getStatusLabel(getTaskStatus(task.id)) }}
                </mat-chip>
              </div>
              <div class="task-footer">
                <span class="task-priority" [class]="'priority-' + task.priority">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <span class="task-date">{{ task.createdAt | date:'short' }}</span>
              </div>
            </div>
          </div>
          <ng-template #noTasks>
            <div class="empty-state">
              <mat-icon>assignment</mat-icon>
              <h3>No hay tareas asignadas al grupo</h3>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      width: 90vw;
      max-width: 1200px;
      height: 90vh;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      border: 1px solid #e1e5e9;
    }

    .modal-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--group-color, #1a1a1a);
    }

    .modal-header {
      background: #f8f9fa;
      color: #2c3e50;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e1e5e9;
    }

    .group-profile {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
    }

    .group-info h1 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
    }

    .group-info p {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    }

    .close-button {
      color: #6c757d;
      background: transparent;
      border-radius: 8px;
      width: 36px;
      height: 36px;
    }

    .close-button:hover {
      background: #fee;
      color: #f44336;
    }

    .modal-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .stats-section {
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e1e5e9;
    }

    .stats-section h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
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
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid #e1e5e9;
    }

    .stat-card:hover {
      background: #ffffff;
      border-color: #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }

    .stat-card.total-tasks .stat-icon { background: #1a1a1a; }
    .stat-card.completed .stat-icon { background: #4caf50; }
    .stat-card.in-progress .stat-icon { background: #ff9800; }
    .stat-card.pending .stat-icon { background: #9e9e9e; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-label {
      font-size: 12px;
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
      margin-bottom: 8px;
      font-weight: 600;
      color: #2c3e50;
      font-size: 14px;
    }

    .progress-bar {
      height: 8px;
      border-radius: 4px;
    }

    .members-section,
    .tasks-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e1e5e9;
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
    }

    .member-count {
      background: var(--group-color, #1a1a1a);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .member-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid #e1e5e9;
      transition: all 0.2s ease;
    }

    .member-card:hover {
      background: #ffffff;
      border-color: #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .member-avatar {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 16px;
      flex-shrink: 0;
    }

    .member-avatar[style*="background-color"] {
      background-color: inherit !important;
    }

    /* Asegurar que el color dinámico se aplique */
    .member-card .member-avatar {
      background-color: var(--dynamic-color) !important;
    }

    .member-details {
      flex: 1;
    }

    .member-details h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
    }

    .member-stats {
      display: flex;
      gap: 16px;
    }

    .member-stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-name {
      font-size: 11px;
      color: #6c757d;
      font-weight: 500;
    }

    .tasks-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
    }

    .task-item {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 16px;
      border: 1px solid #e1e5e9;
      transition: all 0.2s ease;
    }

    .task-item:hover {
      background: #ffffff;
      border-color: #1a1a1a;
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
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      flex: 1;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .task-priority {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
    }

    .task-priority.priority-high {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .task-priority.priority-medium {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .task-priority.priority-low {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .task-date {
      color: #6c757d;
      font-weight: 500;
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
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #495057;
    }

    mat-chip {
      font-size: 11px;
      font-weight: 500;
    }

    .status-completed {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-in-progress {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-not-started {
      background: #f5f5f5 !important;
      color: #6c757d !important;
    }

    @media (max-width: 768px) {
      .modal-container {
        width: 95vw;
        height: 90vh;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .members-grid,
      .tasks-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GroupProfileModal {
  group: Group;
  dialogRef = inject(MatDialogRef<GroupProfileModal>);
  taskStore: TaskStore = inject(TaskStore);
  teamService: TeamService = inject(TeamService);
  private groupsService = inject(GroupsService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { group: Group }) {
    this.group = data.group;
  }

  completedTasks = computed(() => 
    this.group.tasks.filter(t => this.getTaskStatus(t.id) === 'completed').length
  );

  inProgressTasks = computed(() => 
    this.group.tasks.filter(t => this.getTaskStatus(t.id) === 'in-progress').length
  );

  notStartedTasks = computed(() => 
    this.group.tasks.filter(t => this.getTaskStatus(t.id) === 'not-started').length
  );

  groupCompletionRate = computed(() => {
    if (this.group.tasks.length === 0) return 0;
    return Math.round((this.completedTasks() / this.group.tasks.length) * 100);
  });

  getTaskStatus(taskId: string): string {
    const task = this.taskStore.getTaskById(taskId);
    return task?.status || 'not-started';
  }

  getMemberTasks(memberId: string): number {
    return this.group.tasks.filter(t => {
      const task = this.taskStore.getTaskById(t.id);
      return task && task.assignees?.includes(this.getMemberName(memberId)) || false;
    }).length;
  }

  getMemberCompletionRate(memberId: string): number {
    const tasks = this.group.tasks.filter(t => {
      const task = this.taskStore.getTaskById(t.id);
      return task && task.assignees?.includes(this.getMemberName(memberId)) || false;
    });
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => this.getTaskStatus(t.id) === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }

  getMemberName(memberId: string): string {
    const member = this.teamService.getMemberById(memberId);
    return member?.name || '';
  }

  getMemberInitials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En Progreso';
      case 'not-started': return 'Pendiente';
      default: return 'Pendiente';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  // Método para obtener el color del grupo
  getGroupColor(): string {
    return this.groupsService.getGroupColor(this.group.name);
  }

  // Método para obtener el color de un miembro
  getMemberColor(memberName: string): string {
    return this.teamService.getMemberColor(memberName);
  }
}

