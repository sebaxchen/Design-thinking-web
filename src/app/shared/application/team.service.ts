import { Injectable, signal } from '@angular/core';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamMembers = signal<TeamMember[]>([
    { id: '1', name: 'Martín García', email: 'martin@ejemplo.com', role: 'Admin', avatar: 'MG', joinDate: new Date('2024-01-01') },
    { id: '2', name: 'Ana López', email: 'ana@ejemplo.com', role: 'Miembro', avatar: 'AL', joinDate: new Date('2024-02-15') },
    { id: '3', name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', role: 'Miembro', avatar: 'CR', joinDate: new Date('2024-03-10') },
    { id: '4', name: 'María Fernández', email: 'maria@ejemplo.com', role: 'Manager', avatar: 'MF', joinDate: new Date('2023-12-01') },
    { id: '5', name: 'David Sánchez', email: 'david@ejemplo.com', role: 'Colaborador', avatar: 'DS', joinDate: new Date('2024-04-05') },
    { id: '6', name: 'Laura Martínez', email: 'laura@ejemplo.com', role: 'Desarrolladora', avatar: 'LM', joinDate: new Date('2024-01-20') },
    { id: '7', name: 'Roberto Silva', email: 'roberto@ejemplo.com', role: 'Diseñador', avatar: 'RS', joinDate: new Date('2024-02-28') },
    { id: '8', name: 'Elena Vargas', email: 'elena@ejemplo.com', role: 'QA Tester', avatar: 'EV', joinDate: new Date('2024-03-15') },
    { id: '9', name: 'Javier Morales', email: 'javier@ejemplo.com', role: 'DevOps', avatar: 'JM', joinDate: new Date('2024-01-10') },
    { id: '10', name: 'Carmen Díaz', email: 'carmen@ejemplo.com', role: 'Product Owner', avatar: 'CD', joinDate: new Date('2023-11-15') }
  ]);

  // Getters
  get allMembers() {
    return this.teamMembers.asReadonly();
  }

  // Actions
  addMember(member: TeamMember): void {
    this.teamMembers.update(members => [...members, member]);
  }

  removeMember(id: string): void {
    this.teamMembers.update(members => members.filter(member => member.id !== id));
  }

  removeMemberByName(name: string): void {
    this.teamMembers.update(members => members.filter(member => member.name !== name));
  }

  updateMember(id: string, updates: Partial<TeamMember>): void {
    this.teamMembers.update(members =>
      members.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  }

  getMemberById(id: string): TeamMember | undefined {
    return this.teamMembers().find(member => member.id === id);
  }

  getMemberByName(name: string): TeamMember | undefined {
    return this.teamMembers().find(member => member.name === name);
  }
}
