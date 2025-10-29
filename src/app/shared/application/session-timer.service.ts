import { Injectable, signal } from '@angular/core';

export interface SessionTimerState {
  elapsedTime: number; // en segundos
  status: 'safe' | 'warning' | 'danger';
  shouldShowBreakModal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SessionTimerService {
  private startTime: number = 0;
  private timerInterval: number | null = null;
  
  // Signals para reactividad
  public sessionState = signal<SessionTimerState>({
    elapsedTime: 0,
    status: 'safe',
    shouldShowBreakModal: false
  });

  constructor() {
    this.startSession();
  }

  /**
   * Inicia el contador de sesión
   */
  startSession(): void {
    this.startTime = Date.now();
    this.updateTimer();
    
    // Actualizar cada segundo
    this.timerInterval = window.setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  /**
   * Actualiza el estado del timer
   */
  private updateTimer(): void {
    const elapsedMs = Date.now() - this.startTime;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    let shouldShowBreakModal = false;

    if (elapsedSeconds >= 600) { // 10 minutos
      status = 'danger';
      shouldShowBreakModal = true;
    } else if (elapsedSeconds >= 420) { // 7 minutos
      status = 'danger';
    } else if (elapsedSeconds >= 300) { // 5 minutos
      status = 'warning';
    }

    this.sessionState.set({
      elapsedTime: elapsedSeconds,
      status,
      shouldShowBreakModal
    });
  }

  /**
   * Reinicia el contador de sesión
   */
  resetSession(): void {
    this.startTime = Date.now();
    this.updateTimer();
  }

  /**
   * Formatea el tiempo en formato MM:SS
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Obtiene el color del contador según el estado
   */
  getTimerColor(status: 'safe' | 'warning' | 'danger'): string {
    switch (status) {
      case 'safe':
        return '#10b981'; // Verde
      case 'warning':
        return '#f59e0b'; // Amarillo
      case 'danger':
        return '#ef4444'; // Rojo
      default:
        return '#10b981';
    }
  }

  /**
   * Cierra el modal de break
   */
  dismissBreakModal(): void {
    this.sessionState.update(state => ({
      ...state,
      shouldShowBreakModal: false
    }));
  }

  /**
   * Limpia el timer cuando se destruye el servicio
   */
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
