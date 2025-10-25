import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
// MatChip not available in this Angular Material version
import { MatDialogActions, MatDialogContent, MatDialog } from '@angular/material/dialog';
import { TaskStore } from '../../../../learning/application/task.store';
import { Task, CreateTaskRequest, TaskStatus } from '../../../../learning/domain/model/task.entity';
import { StatusSelector } from '../../components/status-selector/status-selector';
import { AssigneeSelector } from '../../components/assignee-selector/assignee-selector';
import { ConfirmDeleteTaskModal } from '../../components/confirm-delete-task-modal/confirm-delete-task-modal';
import { LottieAnimationComponent } from '../../components/lottie-animation/lottie-animation.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatInput,
    MatFormField,
    MatLabel,
    MatHint,
    MatSelect,
    MatOption,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatDialogContent,
    StatusSelector,
    AssigneeSelector,
    LottieAnimationComponent
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  isAddDialogOpen = signal(false);
  showSuccessAnimation = signal(false);
  newTask = signal<CreateTaskRequest>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'not-started',
    assignee: ''
  });

  newTaskStatusSignal = signal<TaskStatus>('not-started');
  newTaskAssigneeSignal = signal<string>('');
  disabledSignal = signal(false);
  enabledSignal = signal(false);

  constructor(
    public taskStore: TaskStore
  ) {}

  private dialog = inject(MatDialog);

  openAddDialog(): void {
    this.isAddDialogOpen.set(true);
  }

  closeAddDialog(): void {
    this.isAddDialogOpen.set(false);
    this.resetNewTask();
  }

  addTask(): void {
    if (this.newTask().title.trim()) {
      this.taskStore.addTask(this.newTask());
      this.closeAddDialog();
      this.showSuccessConfirmation();
    }
  }

  showSuccessConfirmation(): void {
    this.showSuccessAnimation.set(true);
    setTimeout(() => {
      this.showSuccessAnimation.set(false);
    }, 3000);
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

  updateStatus(id: string, status: TaskStatus): void {
    this.taskStore.updateStatus(id, status);
  }

  updateNewTaskStatus(status: TaskStatus): void {
    this.newTask.update(task => ({ ...task, status }));
    this.newTaskStatusSignal.set(status);
  }

  updateNewTaskAssignee(assignee: string): void {
    this.newTask.update(task => ({ ...task, assignee }));
    this.newTaskAssigneeSignal.set(assignee);
  }

  getTaskStatusSignal(taskId: string) {
    const task = this.taskStore.getTaskById(taskId);
    return signal(task?.status || 'not-started');
  }

  getTaskDisabledSignal(status: TaskStatus) {
    return signal(status === 'completed');
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'remove';
      case 'low': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }

  private resetNewTask(): void {
    this.newTask.set({
      title: '',
      description: '',
      priority: 'medium',
      status: 'not-started',
      assignee: ''
    });
    this.newTaskStatusSignal.set('not-started');
    this.newTaskAssigneeSignal.set('');
  }

  isFormValid(): boolean {
    const task = this.newTask();
    return !!(task.title && task.title.trim().length > 0);
  }
}
