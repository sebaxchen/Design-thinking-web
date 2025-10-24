import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskStore } from '../../../../learning/application/task.store';

export interface WorkerProfileData {
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    completionRate: number;
  };
}

@Component({
  selector: 'app-worker-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButton
  ],
  template: `
    <div class="profile-modal">
      <h1>Perfil de {{ member.name }}</h1>
      <p>Rol: {{ member.role }}</p>
      <p>Email: {{ member.email }}</p>
      <p>Total de notas: {{ stats.total }}</p>
      <p>Completadas: {{ stats.completed }}</p>
      <button mat-button (click)="onClose()">Cerrar</button>
    </div>
  `,
  styles: [`
    .profile-modal {
      padding: 20px;
      background: white;
      border-radius: 8px;
      max-width: 500px;
      width: 100%;
    }
    
    .profile-modal h1 {
      color: #333;
      margin-bottom: 16px;
    }
    
    .profile-modal p {
      margin: 8px 0;
      color: #666;
    }
  `]
})
export class WorkerProfileModal {
  dialogRef = inject(MatDialogRef<WorkerProfileModal>);
  taskStore: TaskStore = inject(TaskStore);
  
  member: any;
  stats: any;
  recentTasks: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: WorkerProfileData) {
    this.member = data.member;
    this.stats = data.stats;
    this.loadRecentTasks();
  }

  loadRecentTasks() {
    this.recentTasks = this.taskStore.getTasksByAssignee(this.member.name)
      .slice(0, 5) // Solo las 5 más recientes
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getStatusClass(): string {
    if (this.stats.total === 0) return 'available';
    if (this.stats.inProgress > 0) return 'busy';
    return 'active';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  onClose() {
    this.dialogRef.close();
  }
}
