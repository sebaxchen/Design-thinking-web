import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../application/user.service';
import { AuthService } from '../../../application/auth.service';

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
    TranslatePipe
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isMenuOpen = false;

  options = [
    { link: '/home', label: 'option.home', icon: 'home' },
    { link: '/about', label: 'Gestión de Tareas', icon: 'info' },
    { link: '/learning/categories', label: 'Trabajo en Equipo', icon: 'group' }
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

  logout() {
    this.authService.logout();
  }
}
