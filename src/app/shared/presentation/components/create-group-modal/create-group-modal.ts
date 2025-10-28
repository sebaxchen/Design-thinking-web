import { Component, Input, Output, EventEmitter, signal, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TeamService } from '../../../application/team.service';
import { TaskStore } from '../../../../learning/application/task.store';

interface GroupMember {
  id: string;
  name: string;
  selected: boolean;
}

interface GroupTask {
  id: string;
  title: string;
  priority: string;
  createdAt: Date;
  selected: boolean;
}

@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatInput,
    MatFormField,
    MatLabel,
    MatCheckboxModule
  ],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <mat-icon>group_add</mat-icon>
            </div>
            <div class="header-text">
              <h2 class="modal-title">{{ editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo' }}</h2>
              <p class="modal-subtitle">Organiza a tu equipo para trabajar mejor</p>
            </div>
          </div>
          <button mat-icon-button class="close-button" (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <!-- Group Name Section -->
          <div class="form-section">
            <div class="section-header">
              <mat-icon class="section-icon">label</mat-icon>
              <h3 class="section-title">Nombre del Grupo</h3>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del grupo</mat-label>
              <input matInput [(ngModel)]="groupName" placeholder="Ej: Equipo de Desarrollo">
            </mat-form-field>
          </div>

          <!-- Members Section -->
          <div class="form-section">
            <div class="section-header">
              <mat-icon class="section-icon">people</mat-icon>
              <h3 class="section-title">Miembros del Grupo</h3>
              <span class="section-limit">{{ getSelectedMembersCount() }}/6</span>
            </div>
            <div class="members-list" [class.at-limit]="getSelectedMembersCount() >= 6">
              @if (members().length === 0) {
                <p class="empty-message">No hay miembros disponibles</p>
              } @else {
                @for (member of members(); track member.id) {
                  <div class="member-item" [class.disabled]="!member.selected && getSelectedMembersCount() >= 6">
                    <mat-checkbox 
                      [(ngModel)]="member.selected"
                      [disabled]="!member.selected && getSelectedMembersCount() >= 6"
                      (change)="onMemberChange()">
                      <div class="member-info">
                        <div class="member-avatar">
                          {{ getInitials(member.name) }}
                        </div>
                        <span class="member-name">{{ member.name }}</span>
                      </div>
                    </mat-checkbox>
                  </div>
                }
              }
            </div>
            @if (getSelectedMembersCount() >= 6) {
              <p class="limit-message">⚠️ Máximo 6 miembros por grupo</p>
            }
          </div>

          <!-- Tasks Section -->
          <div class="form-section">
            <div class="section-header">
              <mat-icon class="section-icon">assignment</mat-icon>
              <h3 class="section-title">Tareas a Asignar</h3>
              <span class="section-limit">{{ getSelectedTasksCount() }}/10</span>
            </div>
            <div class="tasks-list" [class.at-limit]="getSelectedTasksCount() >= 10">
              @if (tasks().length === 0) {
                <p class="empty-message">No hay tareas disponibles</p>
              } @else {
                @for (task of tasks(); track task.id) {
                  <div class="task-item" [class.disabled]="!task.selected && getSelectedTasksCount() >= 10">
                    <mat-checkbox 
                      [(ngModel)]="task.selected"
                      [disabled]="!task.selected && getSelectedTasksCount() >= 10"
                      (change)="onTaskChange()">
                      <div class="task-info">
                        <span class="task-title-text">{{ task.title }}</span>
                        <div class="task-priority" [class]="'priority-' + task.priority">
                          {{ getPriorityText(task.priority) }}
                        </div>
                      </div>
                    </mat-checkbox>
                  </div>
                }
              }
            </div>
            @if (getSelectedTasksCount() >= 10) {
              <p class="limit-message">⚠️ Máximo 10 tareas por grupo</p>
            }
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions">
          <button mat-raised-button class="cancel-button" (click)="onClose()">
            Cancelar
          </button>
          <button 
            mat-raised-button 
            class="create-button" 
            (click)="onCreateGroup()"
            [disabled]="!isFormValid()">
            {{ editingGroup ? 'Guardar Cambios' : 'Crear Grupo' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f8f9fa;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .header-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .header-text {
      flex: 1;
    }

    .modal-title {
      margin: 0 0 4px 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .modal-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .close-button {
      color: #6c757d;
    }

    .close-button:hover {
      background: #f0f4ff;
    }

    .modal-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section:last-of-type {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .section-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .section-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      flex: 1;
    }

    .section-limit {
      font-size: 0.875rem;
      color: #6c757d;
      font-weight: 600;
      padding: 4px 12px;
      background: #f0f4ff;
      border-radius: 12px;
    }

    .full-width {
      width: 100%;
    }

    .members-list,
    .tasks-list {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 8px;
      max-height: 280px;
      overflow-y: auto;
    }

    .members-list.at-limit {
      border-color: #fbbf24;
      background: #fffbeb;
    }

    .tasks-list.at-limit {
      border-color: #fbbf24;
      background: #fffbeb;
    }

    .member-item,
    .task-item {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .member-item:last-child,
    .task-item:last-child {
      border-bottom: none;
    }

    .member-item:hover:not(.disabled),
    .task-item:hover:not(.disabled) {
      background: #f8f9fa;
    }

    .member-item.disabled,
    .task-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 36px;
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .member-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .task-info {
      margin-left: 36px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .task-title-text {
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .task-priority {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .priority-high {
      background: #fee2e2;
      color: #991b1b;
    }

    .priority-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .priority-low {
      background: #d1fae5;
      color: #065f46;
    }

    .limit-message {
      margin: 8px 0 0 0;
      padding: 8px 12px;
      background: #fef3c7;
      border-left: 3px solid #fbbf24;
      border-radius: 6px;
      font-size: 0.875rem;
      color: #92400e;
      font-weight: 500;
    }

    .empty-message {
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f8f9fa;
    }

    .cancel-button {
      background: #9ca3af;
      color: white;
    }

    .cancel-button:hover {
      background: #7f8c8d;
    }

    .create-button {
      background: #667eea;
      color: white;
    }

    .create-button:hover:not(:disabled) {
      background: #5568d3;
    }

    .create-button:disabled {
      background: #d1d5db;
      opacity: 0.6;
    }

    /* Custom scrollbar */
    .members-list::-webkit-scrollbar,
    .tasks-list::-webkit-scrollbar {
      width: 8px;
    }

    .members-list::-webkit-scrollbar-track,
    .tasks-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .members-list::-webkit-scrollbar-thumb,
    .tasks-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .members-list::-webkit-scrollbar-thumb:hover,
    .tasks-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class CreateGroupModal implements OnChanges {
  @Input() editingGroup: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<any>();

  groupName = '';
  members = signal<GroupMember[]>([]);
  tasks = signal<GroupTask[]>([]);

  private teamService = inject(TeamService);
  private taskStore = inject(TaskStore);

  constructor() {
    this.loadMembers();
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingGroup'] && this.editingGroup) {
      // Reload members and tasks to get the latest data
      this.loadMembers();
      this.loadTasks();
      
      this.groupName = this.editingGroup.name;
      
      // Mark selected members
      const memberNames = this.editingGroup.members.map((m: any) => m.name);
      this.members.update(members => 
        members.map(m => ({ ...m, selected: memberNames.includes(m.name) }))
      );
      
      // Mark selected tasks
      const taskIds = this.editingGroup.tasks.map((t: any) => t.id);
      this.tasks.update(tasks => 
        tasks.map(t => ({ ...t, selected: taskIds.includes(t.id) }))
      );
    } else if (!this.editingGroup) {
      // Reset form when not editing
      this.loadMembers();
      this.loadTasks();
      this.groupName = '';
      this.members.update(members => members.map(m => ({ ...m, selected: false })));
      this.tasks.update(tasks => tasks.map(t => ({ ...t, selected: false })));
    }
  }

  loadMembers(): void {
    const teamMembers = this.teamService.allMembers();
    this.members.set(teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      selected: false
    })));
  }

  loadTasks(): void {
    const allTasks = this.taskStore.allTasks();
    this.tasks.set(allTasks.map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      createdAt: task.createdAt,
      selected: false
    })));
  }

  getSelectedMembersCount(): number {
    return this.members().filter(m => m.selected).length;
  }

  getSelectedTasksCount(): number {
    return this.tasks().filter(t => t.selected).length;
  }

  onMemberChange(): void {
    const count = this.getSelectedMembersCount();
    if (count > 6) {
      // Prevent exceeding limit
      this.members.update(members => 
        members.map(m => ({ ...m, selected: m.selected && count <= 6 }))
      );
    }
  }

  onTaskChange(): void {
    const count = this.getSelectedTasksCount();
    if (count > 10) {
      // Prevent exceeding limit
      this.tasks.update(tasks => 
        tasks.map(t => ({ ...t, selected: t.selected && count <= 10 }))
      );
    }
  }

  isFormValid(): boolean {
    return this.groupName.trim() !== '' && 
           this.getSelectedMembersCount() > 0 &&
           this.getSelectedMembersCount() <= 6 &&
           this.getSelectedTasksCount() <= 10;
  }

  onCreateGroup(): void {
    const selectedMembers = this.members().filter(m => m.selected);
    const selectedTasks = this.tasks().filter(t => t.selected).map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      createdAt: task.createdAt
    }));

    if (this.isFormValid()) {
      this.create.emit({
        name: this.groupName,
        members: selectedMembers,
        tasks: selectedTasks
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getInitials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  }
}

