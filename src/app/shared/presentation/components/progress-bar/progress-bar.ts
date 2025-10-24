import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlider, MatIcon],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <span class="progress-label">Progreso</span>
        <span class="progress-percentage">{{ progress() }}%</span>
      </div>
      
      <div class="progress-bar-wrapper">
        <div class="progress-bar" [style.width.%]="progress()">
          <div class="progress-fill" [class]="getProgressClass()">
            <mat-icon class="progress-icon" *ngIf="progress() > 0">
              {{ getProgressIcon() }}
            </mat-icon>
          </div>
        </div>
        
        <mat-slider
          class="progress-slider"
          [min]="0"
          [max]="100"
          [step]="5"
          [(ngModel)]="progressValue"
          (ngModelChange)="onProgressChange($event)"
          [disabled]="disabled()">
        </mat-slider>
      </div>
      
      <div class="progress-status">
        <span class="status-text" [class]="getStatusClass()">
          {{ getStatusText() }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
      padding: 12px 0;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .progress-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #666;
    }

    .progress-percentage {
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
      background: #f0f0f0;
      padding: 4px 8px;
      border-radius: 12px;
      min-width: 40px;
      text-align: center;
    }

    .progress-bar-wrapper {
      position: relative;
      margin-bottom: 8px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 4px;
      position: relative;
    }

    .progress-fill.progress-low {
      background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
    }

    .progress-fill.progress-medium {
      background: linear-gradient(90deg, #ffa726, #ffb74d);
    }

    .progress-fill.progress-high {
      background: linear-gradient(90deg, #66bb6a, #81c784);
    }

    .progress-fill.progress-complete {
      background: linear-gradient(90deg, #4caf50, #66bb6a);
    }

    .progress-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
      color: white;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }

    .progress-slider {
      width: 100%;
      margin-top: 8px;
    }

    .progress-slider ::ng-deep .mat-slider-track-fill {
      background: transparent;
    }

    .progress-slider ::ng-deep .mat-slider-thumb {
      background: #667eea;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .progress-slider ::ng-deep .mat-slider-thumb:hover {
      transform: scale(1.1);
    }

    .progress-status {
      text-align: center;
      margin-top: 4px;
    }

    .status-text {
      font-size: 0.8rem;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .status-text.status-not-started {
      color: #666;
      background: #f5f5f5;
    }

    .status-text.status-in-progress {
      color: #ff9800;
      background: #fff3e0;
    }

    .status-text.status-almost-done {
      color: #4caf50;
      background: #e8f5e8;
    }

    .status-text.status-complete {
      color: #2e7d32;
      background: #c8e6c9;
    }
  `]
})
export class ProgressBar {
  @Input() progress = signal(0);
  @Input() disabled = signal(false);
  @Output() progressChange = new EventEmitter<number>();

  progressValue = 0;

  constructor() {
    effect(() => {
      this.progressValue = this.progress();
    });
  }

  onProgressChange(value: number): void {
    this.progress.set(value);
    this.progressChange.emit(value);
  }

  getProgressClass(): string {
    const progress = this.progress();
    if (progress === 0) return 'progress-not-started';
    if (progress < 25) return 'progress-low';
    if (progress < 75) return 'progress-medium';
    if (progress < 100) return 'progress-high';
    return 'progress-complete';
  }

  getProgressIcon(): string {
    const progress = this.progress();
    if (progress === 0) return 'play_arrow';
    if (progress < 25) return 'trending_up';
    if (progress < 75) return 'trending_up';
    if (progress < 100) return 'near_me';
    return 'check_circle';
  }

  getStatusClass(): string {
    const progress = this.progress();
    if (progress === 0) return 'status-not-started';
    if (progress < 50) return 'status-in-progress';
    if (progress < 100) return 'status-almost-done';
    return 'status-complete';
  }

  getStatusText(): string {
    const progress = this.progress();
    if (progress === 0) return 'No iniciada';
    if (progress < 25) return 'Iniciando';
    if (progress < 50) return 'En progreso';
    if (progress < 75) return 'Avanzando';
    if (progress < 100) return 'Casi terminada';
    return 'Completada';
  }
}
