import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TeamService, TeamMember } from '../../../application/team.service';

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  role?: string;
}

@Component({
  selector: 'app-assignee-selector',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton],
  template: `
    <div class="assignee-selector">
      <button 
        mat-button 
        (click)="toggleDropdown()"
        class="assignee-button"
        [class.assigned]="selectedAssignee()">
        <div class="assignee-content">
          @if (selectedAssignee()) {
            <div class="assignee-avatar" [style.background-color]="getMemberColor(selectedAssignee()!)">
              <span class="assignee-initials">{{ getAssigneeInitials() }}</span>
            </div>
            <span class="assignee-name">{{ selectedAssignee() }}</span>
          } @else {
            <mat-icon class="assign-icon">person_add</mat-icon>
            <span class="assign-text">Asignar a...</span>
          }
          <mat-icon class="dropdown-icon" [class.rotated]="isDropdownOpen()">keyboard_arrow_down</mat-icon>
        </div>
      </button>
      
      @if (isDropdownOpen()) {
        <div class="assignee-dropdown">
          <button class="dropdown-item clear-option" (click)="selectAssignee('')">
            <mat-icon>person_off</mat-icon>
            <span>Sin asignar</span>
          </button>
          @for (person of people; track person.id) {
            <button class="dropdown-item" (click)="selectAssignee(person.name)">
              <div class="person-option">
                <div class="person-avatar" [style.background-color]="getMemberColor(person.name)">
                  <span class="person-initials">{{ person.initials }}</span>
                </div>
                <div class="person-info">
                  <span class="person-name">{{ person.name }}</span>
                  @if (person.role) {
                    <span class="person-role">{{ person.role }}</span>
                  }
                </div>
                @if (selectedAssignee() === person.name) {
                  <mat-icon class="check-icon">check</mat-icon>
                }
              </div>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .assignee-selector {
      width: 100%;
      position: relative;
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
    }

    .assignee-button {
      width: 100%;
      padding: 8px 12px;
      border: 2px dashed #ddd;
      border-radius: 8px;
      background: #f8f9fa;
      color: #666;
      font-weight: 500;
      transition: all 0.3s ease;
      text-align: left;
      font-size: 0.8rem;
    }

    .assignee-button:hover {
      border-color: #667eea;
      background: #f0f2ff;
      color: #667eea;
    }

    .assignee-button.assigned {
      border: 2px solid #667eea;
      background: #f0f2ff;
      color: #667eea;
    }

    .assignee-content {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .assignee-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .assignee-initials {
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .assignee-name {
      flex: 1;
      font-weight: 500;
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .assign-icon {
      color: #999;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .assign-text {
      flex: 1;
      color: #666;
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-icon {
      color: #999;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .assignee-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
      min-width: 100%;
    }

    /* Custom scrollbar for the dropdown */
    .assignee-dropdown::-webkit-scrollbar {
      width: 6px;
    }

    .assignee-dropdown::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .assignee-dropdown::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 3px;
      transition: all 0.3s ease;
    }

    .assignee-dropdown::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a6fd8, #6a4190);
    }

    /* Firefox scrollbar */
    .assignee-dropdown {
      scrollbar-width: thin;
      scrollbar-color: #667eea #f1f1f1;
    }

    .dropdown-item {
      width: 100%;
      padding: 12px 16px;
      border: none;
      background: white;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .clear-option {
      color: #f44336;
      border-bottom: 1px solid #eee;
    }

    .clear-option mat-icon {
      color: #f44336;
    }

    .person-option {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 4px 0;
    }

    .person-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .person-initials {
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .person-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .person-name {
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    .person-role {
      font-size: 0.8rem;
      color: #666;
    }

    .check-icon {
      color: #4caf50;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .assignee-button {
        padding: 10px 12px;
      }
      
      .assignee-content {
        gap: 8px;
      }
      
      .assignee-avatar,
      .person-avatar {
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class AssigneeSelector {
  @Input() selectedAssignee = signal<string>('');
  @Input() disabled = signal(false);
  @Output() assigneeChange = new EventEmitter<string>();

  isDropdownOpen = signal(false);
  private teamService = inject(TeamService);

  // Convertir TeamMember a Person para compatibilidad
  get people(): Person[] {
    return this.teamService.allMembers().map(member => ({
      id: member.id,
      name: member.name,
      initials: member.avatar,
      role: member.role
    }));
  }

  toggleDropdown(): void {
    if (!this.disabled()) {
      this.isDropdownOpen.set(!this.isDropdownOpen());
    }
  }

  selectAssignee(assignee: string): void {
    if (!this.disabled()) {
      this.selectedAssignee.set(assignee);
      this.assigneeChange.emit(assignee);
      this.isDropdownOpen.set(false);
    }
  }

  getAssigneeInitials(): string {
    const assignee = this.selectedAssignee();
    if (!assignee) return '';
    
    const person = this.people.find(p => p.name === assignee);
    return person?.initials || assignee.substring(0, 2).toUpperCase();
  }

  // Método para obtener el color de un miembro
  getMemberColor(memberName: string): string {
    return this.teamService.getMemberColor(memberName);
  }
}
