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
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@empresa.com',
      role: 'Manager',
      avatar: 'JP',
      joinDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@empresa.com',
      role: 'Developer',
      avatar: 'MG',
      joinDate: new Date('2024-02-01')
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@empresa.com',
      role: 'Designer',
      avatar: 'CL',
      joinDate: new Date('2024-02-15')
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana@empresa.com',
      role: 'Analyst',
      avatar: 'AM',
      joinDate: new Date('2024-03-01')
    }
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
