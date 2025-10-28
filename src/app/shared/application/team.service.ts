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
  private teamMembers = signal<TeamMember[]>([]);

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
