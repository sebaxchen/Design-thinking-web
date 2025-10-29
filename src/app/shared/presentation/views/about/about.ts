import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TaskStore } from '../../../../learning/application/task.store';
import { Task, TaskStatus } from '../../../../learning/domain/model/task.entity';
import { StatusSelector } from '../../components/status-selector/status-selector';
import { AssigneeSelector } from '../../components/assignee-selector/assignee-selector';
import { ConfirmDeleteTaskModal } from '../../components/confirm-delete-task-modal/confirm-delete-task-modal';
import { TeamService } from '../../../application/team.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    StatusSelector,
    AssigneeSelector
  ],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  constructor(public taskStore: TaskStore) {}
  
  private dialog = inject(MatDialog);
  private teamService = inject(TeamService);

  updateStatus(id: string, status: TaskStatus): void {
    this.taskStore.updateStatus(id, status);
  }

  deleteTask(id: string): void {
    const task = this.taskStore.getTaskById(id);
    if (!task) return;

    const dialogRef = this.dialog.open(ConfirmDeleteTaskModal, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container',
      data: { taskTitle: task.title }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.taskStore.deleteTask(id);
      }
    });
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }

  getTaskStatusSignal(status: TaskStatus) {
    return signal(status);
  }

  getDisabledSignal() {
    return signal(false);
  }

  updateAssignee(id: string, assignee: string): void {
    this.taskStore.updateTask({ id, assignee });
  }

  getTaskAssigneeSignal(taskId: string) {
    const task = this.taskStore.getTaskById(taskId);
    return signal(task?.assignee || '');
  }

  getAssignedTasksCount(): number {
    return this.taskStore.allTasks().filter(task => task.assignee && task.assignee.trim() !== '').length;
  }

  getTotalTasks(): number {
    return this.taskStore.allTasks().length;
  }

  getHighPriorityCount(): number {
    return this.taskStore.allTasks().filter(task => task.priority === 'high').length;
  }

  getTeamMembersCount(): number {
    // This would need to be injected from a team service
    return 5; // Placeholder for now
  }

  getCompletionRate(): number {
    const total = this.getTotalTasks();
    if (total === 0) return 0;
    return Math.round((this.taskStore.completedCount() / total) * 100);
  }

  getProgressPercentage(type: string): number {
    const total = this.getTotalTasks();
    if (total === 0) return 0;
    
    switch (type) {
      case 'not-started':
        return (this.taskStore.notStartedCount() / total) * 100;
      case 'in-progress':
        return (this.taskStore.inProgressCount() / total) * 100;
      case 'completed':
        return (this.taskStore.completedCount() / total) * 100;
      case 'assigned':
        return (this.getAssignedTasksCount() / total) * 100;
      default:
        return 0;
    }
  }

  // Función para obtener el color único del miembro
  getMemberColor(memberName: string): string {
    return this.teamService.getMemberColor(memberName);
  }
}
