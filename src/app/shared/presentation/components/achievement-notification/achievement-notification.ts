import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Achievement } from '../../../../learning/domain/model/achievement.entity';

@Component({
  selector: 'app-achievement-notification',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton, MatCardModule],
  template: `
    <div class="achievement-notification" *ngIf="achievement" [@slideIn]>
      <mat-card class="notification-card">
        <div class="notification-content">
          <div class="achievement-icon">
            <mat-icon>{{ achievement.icon }}</mat-icon>
          </div>
          <div class="notification-text">
            <h3>¡Logro Desbloqueado!</h3>
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
          </div>
          <button mat-icon-button (click)="dismiss()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .achievement-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }

    .notification-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.5s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 16px;
    }

    .achievement-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      animation: pulse 2s infinite;
    }

    .notification-text {
      flex: 1;
    }

    .notification-text h3 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      opacity: 0.9;
    }

    .notification-text h4 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 700;
    }

    .notification-text p {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
      line-height: 1.4;
    }

    .close-btn {
      color: white;
      opacity: 0.7;
    }

    .close-btn:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
      }
    }

    @media (max-width: 480px) {
      .achievement-notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `],
  animations: [
    // Aquí podrías agregar animaciones más complejas si es necesario
  ]
})
export class AchievementNotificationComponent implements OnInit, OnDestroy {
  @Input() achievement: Achievement | null = null;
  @Input() autoHide: boolean = true;
  @Input() hideDelay: number = 5000; // 5 segundos por defecto

  private hideTimer: any;

  ngOnInit() {
    if (this.autoHide && this.achievement) {
      this.hideTimer = setTimeout(() => {
        this.dismiss();
      }, this.hideDelay);
    }
  }

  ngOnDestroy() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  }

  dismiss() {
    this.achievement = null;
  }
}
