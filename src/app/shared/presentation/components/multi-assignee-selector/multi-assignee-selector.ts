import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TeamService } from '../../../application/team.service';

interface Person {
  id: string;
  name: string;
  initials: string;
  role?: string;
}

@Component({
  selector: 'app-multi-assignee-selector',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton],
  template: `
    <div class="multi-assignee-selector">
      <button 
        mat-button 
        (click)="toggleDropdown()"
        class="assignee-button">
        <div class="assignee-content">
          <mat-icon class="assign-icon">group_add</mat-icon>
          <span class="assign-text">Asignar a grupo...</span>
          <mat-icon class="dropdown-icon" [class.rotated]="isDropdownOpen()">keyboard_arrow_down</mat-icon>
        </div>
      </button>
      
      @if (isDropdownOpen()) {
        <div class="assignee-dropdown">
          <button class="dropdown-item clear-option" (click)="clearAllAssignees()">
            <mat-icon>person_off</mat-icon>
            <span>Sin asignar</span>
          </button>
          @for (person of people; track person.id) {
            <button class="dropdown-item" (click)="togglePerson(person.name)">
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
                @if (isPersonSelected(person.name)) {
                  <mat-icon class="check-icon">check</mat-icon>
                }
              </div>
            </button>
          }
        </div>
      }
      
      @if (selectedAssignees().length > 0) {
        <div class="selected-assignees">
          @for (assignee of selectedAssignees(); track assignee) {
            <div class="assignee-chip">
              <div class="assignee-avatar-small" [style.background-color]="getMemberColor(assignee)">
                <span class="assignee-initials-small">{{ getInitials(assignee) }}</span>
              </div>
              <span class="assignee-name-small">{{ assignee }}</span>
              <mat-icon class="remove-icon" (click)="removeAssignee(assignee)">close</mat-icon>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .multi-assignee-selector {
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

    .assignee-content {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
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

    .selected-assignees {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .assignee-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f0f4ff;
      border: 1px solid #667eea;
      border-radius: 16px;
      font-size: 0.8rem;
    }

    .assignee-avatar-small {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .assignee-initials-small {
      color: white;
      font-weight: 600;
      font-size: 0.7rem;
    }

    .assignee-name-small {
      color: #667eea;
      font-weight: 500;
    }

    .remove-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #667eea;
      cursor: pointer;
    }

    .remove-icon:hover {
      color: #f44336;
    }
  `]
})
export class MultiAssigneeSelector {
  @Input() selectedAssignees = signal<string[]>([]);
  @Output() assigneesChange = new EventEmitter<string[]>();

  isDropdownOpen = signal(false);
  private teamService = inject(TeamService);

  get people(): Person[] {
    return this.teamService.allMembers().map(member => ({
      id: member.id,
      name: member.name,
      initials: member.avatar,
      role: member.role
    }));
  }

  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  clearAllAssignees(): void {
    this.selectedAssignees.set([]);
    this.assigneesChange.emit([]);
    this.isDropdownOpen.set(false);
  }

  togglePerson(name: string): void {
    const current = this.selectedAssignees();
    const isSelected = current.includes(name);
    
    if (isSelected) {
      this.selectedAssignees.set(current.filter(a => a !== name));
    } else {
      this.selectedAssignees.set([...current, name]);
    }
    
    this.assigneesChange.emit(this.selectedAssignees());
  }

  isPersonSelected(name: string): boolean {
    return this.selectedAssignees().includes(name);
  }

  removeAssignee(assignee: string): void {
    const current = this.selectedAssignees();
    this.selectedAssignees.set(current.filter(a => a !== assignee));
    this.assigneesChange.emit(this.selectedAssignees());
  }

  getInitials(name: string): string {
    const person = this.people.find(p => p.name === name);
    return person?.initials || name.substring(0, 2).toUpperCase();
  }

  // Método para obtener el color de un miembro
  getMemberColor(memberName: string): string {
    return this.teamService.getMemberColor(memberName);
  }
}

