import {Component, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {TaskStore} from '../../../application/task.store';
import {AddMemberModal} from '../../../../shared/presentation/components/add-member-modal/add-member-modal';
import {ConfirmDeleteModal} from '../../../../shared/presentation/components/confirm-delete-modal/confirm-delete-modal';
import {WorkerProfileModal} from '../../../../shared/presentation/components/worker-profile-modal/worker-profile-modal';
import {TeamService, TeamMember} from '../../../../shared/application/team.service';


@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatButton
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList {
  readonly taskStore = inject(TaskStore);
  private dialog = inject(MatDialog);
  private teamService = inject(TeamService);

  // Usar el servicio de equipo en lugar de un signal local
  get teamMembers() {
    return this.teamService.allMembers;
  }

 getMemberStats(memberName: string) {
   const tasks = this.taskStore.getTasksByAssignee(memberName);
   const completed = tasks.filter(task => task.status === 'completed').length;
   const inProgress = tasks.filter(task => task.status === 'in-progress').length;
   const notStarted = tasks.filter(task => task.status === 'not-started').length;
   
   return {
     total: tasks.length,
     completed,
     inProgress,
     notStarted,
     completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
   };
 }

 getTrafficLightClass(totalTasks: number): string {
   if (totalTasks < 5) {
     return 'traffic-green';
   } else if (totalTasks < 10) {
     return 'traffic-yellow';
   } else {
     return 'traffic-red';
   }
 }

  openAddMemberModal() {
    const dialogRef = this.dialog.open(AddMemberModal, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((newMember: TeamMember) => {
      if (newMember) {
        this.teamService.addMember(newMember);
      }
    });
  }

  openDeleteMemberModal(memberName: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteModal, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container',
      data: { memberName }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.teamService.removeMemberByName(memberName);
        // También eliminar las tareas asignadas a este miembro
        this.taskStore.allTasks().forEach(task => {
          if (task.assignee === memberName) {
            this.taskStore.deleteTask(task.id);
          }
        });
      }
    });
  }

  openWorkerProfileModal(member: any) {
    console.log('Opening profile modal for member:', member);
    const stats = this.getMemberStats(member.name);
    console.log('Member stats:', stats);
    
    try {
      const dialogRef = this.dialog.open(WorkerProfileModal, {
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        disableClose: false,
        panelClass: 'custom-dialog-container',
        data: {
          member: member,
          stats: stats
        }
      });
      
      console.log('Dialog opened successfully');
    } catch (error) {
      console.error('Error opening dialog:', error);
    }
  }

}
