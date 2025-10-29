import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { SessionTimerService } from '../../../application/session-timer.service';

@Component({
  selector: 'app-break-modal',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButton],
  template: `
    @if (sessionTimerService.sessionState().shouldShowBreakModal) {
      <div class="break-modal-overlay" (click)="onOverlayClick($event)">
        <div class="break-modal">
          <div class="break-modal-content">
            <div class="break-icon">
              <mat-icon>coffee</mat-icon>
            </div>
            <h2 class="break-title">¡Es hora de tomar un descanso!</h2>
            <p class="break-description">
              Has estado trabajando por más de 10 minutos. 
              Es importante tomar descansos regulares para mantener tu productividad y bienestar.
            </p>
            <div class="break-suggestions">
              <div class="suggestion-item">
                <mat-icon>visibility</mat-icon>
                <span>Mira por la ventana</span>
              </div>
              <div class="suggestion-item">
                <mat-icon>directions_walk</mat-icon>
                <span>Camina un poco</span>
              </div>
              <div class="suggestion-item">
                <mat-icon>water_drop</mat-icon>
                <span>Bebe agua</span>
              </div>
              <div class="suggestion-item">
                <mat-icon>self_improvement</mat-icon>
                <span>Respira profundamente</span>
              </div>
            </div>
            <div class="break-actions">
              <button mat-button class="break-btn continue-btn" (click)="continueWorking()">
                <mat-icon>play_arrow</mat-icon>
                Continuar trabajando
              </button>
              <button mat-button class="break-btn take-break-btn" (click)="takeBreak()">
                <mat-icon>pause</mat-icon>
                Tomar descanso
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .break-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    }

    .break-modal {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .break-modal-content {
      padding: 40px 32px;
      text-align: center;
    }

    .break-icon {
      width: 80px;
      height: 80px;
      background: #1a1a1a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .break-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    .break-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }

    .break-description {
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 32px 0;
    }

    .break-suggestions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 0 0 32px 0;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    .suggestion-item:hover {
      background: #f0f4ff;
      border-color: #d1d5db;
      transform: translateY(-2px);
    }

    .suggestion-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #6b7280;
    }

    .suggestion-item span {
      font-size: 0.9rem;
      font-weight: 500;
      color: #4b5563;
    }

    .break-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .break-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      min-width: 160px;
    }

    .continue-btn {
      background: #1a1a1a;
      color: #ffffff;
      border: 2px solid #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .continue-btn:hover {
      background: #2d2d2d;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .take-break-btn {
      background: #1a1a1a;
      color: #ffffff;
      border: 2px solid #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .take-break-btn:hover {
      background: #2d2d2d;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .break-btn {
      color: #ffffff;
    }

    .break-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #ffffff;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .break-modal {
        width: 95%;
        margin: 20px;
      }

      .break-modal-content {
        padding: 32px 24px;
      }

      .break-suggestions {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .break-actions {
        flex-direction: column;
        gap: 12px;
      }

      .break-btn {
        width: 100%;
        min-width: auto;
      }
    }
  `]
})
export class BreakModalComponent {
  sessionTimerService = inject(SessionTimerService);

  onOverlayClick(event: Event): void {
    // Solo cerrar si se hace click en el overlay, no en el modal
    if (event.target === event.currentTarget) {
      this.continueWorking();
    }
  }

  continueWorking(): void {
    this.sessionTimerService.dismissBreakModal();
  }

  takeBreak(): void {
    // Aquí podrías implementar lógica adicional para el descanso
    // Por ejemplo, pausar el timer o redirigir a una página de descanso
    this.sessionTimerService.dismissBreakModal();
    this.sessionTimerService.resetSession();
  }
}
