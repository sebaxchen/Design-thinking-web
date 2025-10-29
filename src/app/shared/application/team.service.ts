import { Injectable, signal, inject } from '@angular/core';
import { MemberColorsService } from './member-colors.service';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate?: Date;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private memberColorsService = inject(MemberColorsService);
  
  private teamMembers = signal<TeamMember[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@empresa.com',
      role: 'Manager',
      avatar: 'JP',
      joinDate: new Date('2024-01-15'),
      color: this.memberColorsService.getMemberColor('Juan Pérez')
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@empresa.com',
      role: 'Developer',
      avatar: 'MG',
      joinDate: new Date('2024-02-01'),
      color: this.memberColorsService.getMemberColor('María García')
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@empresa.com',
      role: 'Designer',
      avatar: 'CL',
      joinDate: new Date('2024-02-15'),
      color: this.memberColorsService.getMemberColor('Carlos López')
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana@empresa.com',
      role: 'Analyst',
      avatar: 'AM',
      joinDate: new Date('2024-03-01'),
      color: this.memberColorsService.getMemberColor('Ana Martínez')
    }
  ]);

  // Getters
  get allMembers() {
    return this.teamMembers.asReadonly();
  }

  // Actions
  addMember(member: TeamMember): void {
    // Asignar color automáticamente si no tiene uno
    if (!member.color) {
      member.color = this.memberColorsService.getMemberColor(member.name);
    }
    
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

  // Método para obtener el color de un miembro
  getMemberColor(memberName: string): string {
    const member = this.getMemberByName(memberName);
    if (member && member.color) {
      return member.color;
    }
    // Si no existe el miembro o no tiene color, obtener uno del servicio
    return this.memberColorsService.getMemberColor(memberName);
  }
}
