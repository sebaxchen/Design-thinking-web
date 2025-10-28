import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../application/auth.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './settings-modal.html',
  styleUrl: './settings-modal.css'
})
export class SettingsModal {
  @Output() close = new EventEmitter<void>();
  authService = inject(AuthService);

  selectedMenu = 'profile';
  currentPlan = 'free'; // free, basic, premium
  
  menuItems = [
    { id: 'profile', label: 'Perfil', icon: 'person' },
    { id: 'plans', label: 'Planes', icon: 'workspace_premium' },
    { id: 'account', label: 'Cuenta', icon: 'account_circle' },
    { id: 'notifications', label: 'Notificaciones', icon: 'notifications' },
    { id: 'privacy', label: 'Privacidad', icon: 'lock' },
    { id: 'preferences', label: 'Preferencias', icon: 'settings' },
    { id: 'about', label: 'Acerca de', icon: 'info' }
  ];

  plans = [
    {
      id: 'free',
      name: 'Gratis',
      price: '$0',
      features: [
        'Hasta 20 tareas',
        'Hasta 3 colaboradores',
        'Almacenamiento básico',
        'Soporte por email'
      ]
    },
    {
      id: 'basic',
      name: 'Básico',
      price: '$9/mes',
      features: [
        'Tareas ilimitadas',
        'Hasta 10 colaboradores',
        'Almacenamiento expandido',
        'Soporte prioritario',
        'Reportes avanzados'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19/mes',
      features: [
        'Tareas ilimitadas',
        'Colaboradores ilimitados',
        'Almacenamiento ilimitado',
        'Soporte 24/7',
        'Reportes avanzados',
        'Integraciones premium',
        'Analíticas avanzadas'
      ]
    }
  ];

  getUserName(): string {
    return this.authService.getUserName();
  }

  getUserEmail(): string {
    return this.authService.getUserEmail();
  }

  closeModal() {
    this.close.emit();
  }
}

