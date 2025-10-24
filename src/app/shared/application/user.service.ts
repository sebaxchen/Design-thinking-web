import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = signal<User>({
    id: '1',
    name: 'Martín García',
    email: 'martin.garcia@acme.com',
    avatar: '/assets/avatar-placeholder.svg',
    role: 'Administrador'
  });

  readonly user = this.currentUser.asReadonly();

  updateUser(user: Partial<User>): void {
    this.currentUser.update(current => ({ ...current, ...user }));
  }

  getUserName(): string {
    return this.user().name;
  }

  getUserInitials(): string {
    const names = this.user().name.split(' ');
    return names.map(name => name.charAt(0)).join('').toUpperCase();
  }
}
