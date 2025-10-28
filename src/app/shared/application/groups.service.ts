import { Injectable, signal } from '@angular/core';

export interface Group {
  id?: string;
  name: string;
  members: { id: string; name: string }[];
  tasks: { id: string; title: string; priority: string; createdAt: Date }[];
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groups = signal<Group[]>([]);

  constructor() {
    this.loadGroups();
  }

  private loadGroups(): void {
    // Load groups from localStorage or start empty
    const stored = localStorage.getItem('groups');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.groups.set(parsed);
      } catch (e) {
        this.groups.set([]);
      }
    } else {
      this.groups.set([]);
    }
  }

  private saveGroups(): void {
    localStorage.setItem('groups', JSON.stringify(this.groups()));
  }

  getAllGroups() {
    return this.groups.asReadonly();
  }

  addGroup(group: Group): void {
    const newGroup = {
      ...group,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.groups.update(groups => [...groups, newGroup]);
    this.saveGroups();
  }

  updateGroup(groupId: string, updates: Partial<Group>): void {
    this.groups.update(groups =>
      groups.map(g => {
        if (g.id === groupId) {
          // Merge arrays for members and tasks if they exist
          const merged: any = { ...g };
          if (updates.members) merged.members = updates.members;
          if (updates.tasks) merged.tasks = updates.tasks;
          return { ...merged, ...updates };
        }
        return g;
      })
    );
    this.saveGroups();
  }

  deleteGroup(groupId: string): void {
    this.groups.update(groups => groups.filter(g => g.id !== groupId));
    this.saveGroups();
  }

  getGroupById(groupId: string): Group | undefined {
    return this.groups().find(g => g.id === groupId);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
