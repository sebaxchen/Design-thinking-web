import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TaskStatus } from '../../../../learning/domain/model/task.entity';

@Component({
  selector: 'app-status-selector',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <div class="status-selector">
      <div class="status-options">
        <button 
          *ngFor="let status of statusOptions" 
          class="status-option"
          [class]="'status-' + status.value"
          [class.active]="currentStatus() === status.value"
          [class.disabled]="disabled()"
          (click)="selectStatus(status.value)"
          [disabled]="disabled()">
          <mat-icon class="status-icon">{{ status.icon }}</mat-icon>
          <span class="status-label">{{ status.label }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .status-selector {
      width: 100%;
    }

    .status-options {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: #f5f5f5;
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
      justify-content: center;
    }

    .status-option:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .status-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .status-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .status-label {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Not Started */
    .status-option.status-not-started {
      background: #f8f9fa;
      color: #6c757d;
      border-color: #dee2e6;
    }

    .status-option.status-not-started.active {
      background: #e9ecef;
      color: #495057;
      border-color: #adb5bd;
      box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);
    }

    /* In Progress */
    .status-option.status-in-progress {
      background: #fff3cd;
      color: #856404;
      border-color: #ffeaa7;
    }

    .status-option.status-in-progress.active {
      background: #ffeaa7;
      color: #6c5ce7;
      border-color: #a29bfe;
      box-shadow: 0 2px 8px rgba(116, 185, 255, 0.3);
    }

    /* Completed */
    .status-option.status-completed {
      background: #d4edda;
      color: #155724;
      border-color: #c3e6cb;
    }

    .status-option.status-completed.active {
      background: #c3e6cb;
      color: #0f5132;
      border-color: #a3d9a4;
      box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .status-options {
        flex-direction: column;
        gap: 6px;
      }

      .status-option {
        min-width: 100%;
        padding: 10px 12px;
      }
    }
  `]
})
export class StatusSelector {
  @Input() currentStatus = signal<TaskStatus>('not-started');
  @Input() disabled = signal(false);
  @Output() statusChange = new EventEmitter<TaskStatus>();

  statusOptions = [
    {
      value: 'not-started' as TaskStatus,
      label: 'Sin iniciar',
      icon: 'play_circle_outline'
    },
    {
      value: 'in-progress' as TaskStatus,
      label: 'En progreso',
      icon: 'hourglass_empty'
    },
    {
      value: 'completed' as TaskStatus,
      label: 'Terminado',
      icon: 'check_circle'
    }
  ];

  selectStatus(status: TaskStatus): void {
    if (!this.disabled()) {
      this.currentStatus.set(status);
      this.statusChange.emit(status);
    }
  }
}
