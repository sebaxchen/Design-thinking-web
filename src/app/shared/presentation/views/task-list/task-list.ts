import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialog } from '@angular/material/dialog';
import { TaskStore } from '../../../../learning/application/task.store';
import { Task, CreateTaskRequest, TaskStatus } from '../../../../learning/domain/model/task.entity';
import { StatusSelector } from '../../components/status-selector/status-selector';
import { AssigneeSelector } from '../../components/assignee-selector/assignee-selector';
import { MultiAssigneeSelector } from '../../components/multi-assignee-selector/multi-assignee-selector';
import { ConfirmDeleteTaskModal } from '../../components/confirm-delete-task-modal/confirm-delete-task-modal';
import { LottieAnimationComponent } from '../../components/lottie-animation/lottie-animation.component';
import { GroupsService } from '../../../application/groups.service';

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
    MultiAssigneeSelector,
    LottieAnimationComponent,
    MatCheckboxModule
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
    assignee: '',
    assignees: []
  });

  newTaskStatusSignal = signal<TaskStatus>('not-started');
  newTaskAssigneeSignal = signal<string>('');
  newTaskAssigneesSignal = signal<string[]>([]);
  selectedGroup = signal<string>('');
  disabledSignal = signal(false);
  enabledSignal = signal(false);

  private groupsService = inject(GroupsService);

  constructor(
    public taskStore: TaskStore
  ) {}

  private dialog = inject(MatDialog);
  
  get groups() {
    return this.groupsService.getAllGroups();
  }

  getTaskGroup(taskId: string): any | null {
    const allGroups = this.groups();
    for (const group of allGroups) {
      const taskExists = group.tasks?.some(t => t.id === taskId);
      if (taskExists) {
        return group;
      }
    }
    return null;
  }
  
  updateSelectedGroup(groupName: string): void {
    if (!groupName || groupName === '') {
      this.selectedGroup.set('');
      this.newTaskAssigneesSignal.set([]);
      this.newTask.update(task => ({ ...task, assignees: [] }));
      return;
    }

    this.selectedGroup.set(groupName);
    // Find the group and add its members to assignees
    const group = this.groups().find(g => g.name === groupName);
    if (group) {
      const memberNames = group.members.map(m => m.name);
      this.newTaskAssigneesSignal.set(memberNames);
      this.newTask.update(task => ({ ...task, assignees: memberNames }));
    }
  }
  
  removeMemberFromAssignees(memberName: string): void {
    const currentAssignees = this.newTaskAssigneesSignal();
    const filtered = currentAssignees.filter(m => m !== memberName);
    this.newTaskAssigneesSignal.set(filtered);
    this.newTask.update(task => ({ ...task, assignees: filtered }));
  }

  clearGroupSelection(): void {
    this.selectedGroup.set('');
    this.newTaskAssigneesSignal.set([]);
    this.newTask.update(task => ({ ...task, assignees: [] }));
  }

  openAddDialog(): void {
    this.isAddDialogOpen.set(true);
  }

  closeAddDialog(): void {
    this.isAddDialogOpen.set(false);
    this.resetNewTask();
  }

  addTask(): void {
    if (this.newTask().title.trim()) {
      const task = this.taskStore.addTask(this.newTask());
      
      // If a group was selected, add the task to that group
      const selectedGroupName = this.selectedGroup();
      if (selectedGroupName) {
        const group = this.groups().find(g => g.name === selectedGroupName);
        if (group) {
          const taskData = {
            id: task.id,
            title: task.title,
            priority: task.priority,
            createdAt: task.createdAt
          };
          
          // Update the group with the new task
          const updatedTasks = [...group.tasks, taskData];
          this.groupsService.updateGroup(group.id!, { tasks: updatedTasks });
        }
      }
      
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

  updateNewTaskAssignees(assignees: string[]): void {
    this.newTask.update(task => ({ ...task, assignees }));
    this.newTaskAssigneesSignal.set(assignees);
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
      assignee: '',
      assignees: []
    });
    this.newTaskStatusSignal.set('not-started');
    this.newTaskAssigneeSignal.set('');
    this.newTaskAssigneesSignal.set([]);
  }

  isFormValid(): boolean {
    const task = this.newTask();
    return !!(task.title && task.title.trim().length > 0);
  }
}
