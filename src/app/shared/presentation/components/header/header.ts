import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../application/user.service';
import { AuthService } from '../../../application/auth.service';
import { SettingsModal } from '../settings-modal/settings-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    SettingsModal
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isMenuOpen = false;
  isSettingsOpen = false;

  options = [
    { link: '/home', label: 'Inicio', icon: 'home' },
    { link: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { link: '/groups', label: 'Grupos', icon: 'groups' },
    { link: '/about', label: 'Gestión de Tareas', icon: 'info' },
    { link: '/learning/categories', label: 'Colaboradores', icon: 'group' },
    { link: '/shared-files', label: 'Archivos', icon: 'cloud' }
  ];

  constructor(
    public userService: UserService,
    public authService: AuthService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openSettings() {
    this.isSettingsOpen = true;
  }

  logout() {
    this.authService.logout();
  }
}
