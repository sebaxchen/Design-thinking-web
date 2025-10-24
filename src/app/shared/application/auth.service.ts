import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal(false);

  constructor(private router: Router) {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  async login(email: string, password: string): Promise<boolean> {
    // Simular autenticación (en una app real, esto sería una llamada a la API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para demo, aceptar cualquier email/password
    if (email && password) {
      const user: User = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        role: 'Usuario'
      };
      
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    // Simular registro (en una app real, esto sería una llamada a la API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si el email ya existe
    const existingUser = localStorage.getItem('currentUser');
    if (existingUser) {
      const user = JSON.parse(existingUser);
      if (user.email === email) {
        return false;
      }
    }
    
    // Crear nuevo usuario
    const user: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: 'Usuario'
    };
    
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    return this.currentUser()?.name || 'Usuario';
  }

  getUserEmail(): string {
    return this.currentUser()?.email || '';
  }

  getUserRole(): string {
    return this.currentUser()?.role || 'Usuario';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
