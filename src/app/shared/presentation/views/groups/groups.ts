import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupModal } from '../../components/create-group-modal/create-group-modal';
import { ConfirmDeleteTaskModal } from '../../components/confirm-delete-task-modal/confirm-delete-task-modal';
import { GroupProfileModal } from '../../components/group-profile-modal/group-profile-modal';
import { GroupsService } from '../../../application/groups.service';
import { TeamService } from '../../../application/team.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatButton,
    CreateGroupModal
  ],
  templateUrl: './groups.html',
  styleUrl: './groups.css'
})
export class GroupsComponent {
  isModalOpen = signal(false);
  editingGroup = signal<any>(null);
  
  private dialog = inject(MatDialog);
  private groupsService = inject(GroupsService);
  private teamService = inject(TeamService);
  
  get groups() {
    return this.groupsService.getAllGroups();
  }


  createGroup() {
    if (this.groups().length >= 9) {
      return;
    }
    this.editingGroup.set(null);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingGroup.set(null);
  }

  onCreateGroup(groupData: any) {
    const currentGroup = this.editingGroup();
    if (currentGroup && currentGroup.id) {
      this.groupsService.updateGroup(currentGroup.id, groupData);
    } else {
      this.groupsService.addGroup(groupData);
    }
    this.closeModal();
  }

  editGroup(group: any) {
    // Reload fresh data for the group
    const updatedGroup = this.groups().find(g => g.id === group.id);
    if (updatedGroup) {
      this.editingGroup.set(updatedGroup);
    } else {
      this.editingGroup.set(group);
    }
    this.isModalOpen.set(true);
  }

  deleteGroup(groupName: string) {
    const group = this.groups().find(g => g.name === groupName);
    if (!group || !group.id) return;

    const dialogRef = this.dialog.open(ConfirmDeleteTaskModal, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container',
      data: { taskTitle: `el grupo "${groupName}"` }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.groupsService.deleteGroup(group.id!);
      }
    });
  }

  getInitials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'horizontal_rule';
      case 'low': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }

  getPriorityText(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  }

  getElapsedTime(createdAt: Date): string {
    const now = new Date();
    const elapsed = now.getTime() - new Date(createdAt).getTime();
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor(elapsed / (1000 * 60));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Recién';
    }
  }

  openGroupProfile(group: any): void {
    this.dialog.open(GroupProfileModal, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: 'none',
      disableClose: false,
      panelClass: 'group-profile-modal',
      data: { group }
    });
  }

  // Método para obtener el color de un miembro
  getMemberColor(memberName: string): string {
    return this.teamService.getMemberColor(memberName);
  }

  // Método para obtener el color de un grupo
  getGroupColor(groupName: string): string {
    return this.groupsService.getGroupColor(groupName);
  }
}

