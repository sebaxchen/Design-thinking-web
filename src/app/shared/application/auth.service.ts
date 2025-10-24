import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from './team.service';

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
  private teamService = inject(TeamService);

  constructor(private router: Router) {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.addUserToTeamIfNeeded(user);
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
      this.addUserToTeamIfNeeded(user);
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
    this.addUserToTeamIfNeeded(user);
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

  private addUserToTeamIfNeeded(user: User) {
    // Verificar si el usuario ya está en el equipo
    const existingMembers = this.teamService.allMembers();
    const userExists = existingMembers.some(member => member.name === user.name);
    
    if (!userExists) {
      // Añadir al usuario al equipo automáticamente
      const teamMember = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        avatar: '', // Avatar vacío por defecto
        joinDate: new Date()
      };
      
      this.teamService.addMember(teamMember);
      console.log('Usuario añadido automáticamente al equipo:', user.name);
    }
  }
}
