import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {TaskStore} from '../../../application/task.store';


@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList {
 readonly taskStore = inject(TaskStore);

 teamMembers = [
   { id: '1', name: 'Martín García', initials: 'MG', role: 'Administrator' },
   { id: '2', name: 'Ana López', initials: 'AL', role: 'Developer' },
   { id: '3', name: 'Carlos Ruiz', initials: 'CR', role: 'Designer' },
   { id: '4', name: 'María Fernández', initials: 'MF', role: 'Manager' },
   { id: '5', name: 'David Sánchez', initials: 'DS', role: 'Tester' }
 ];

 getMemberStats(memberName: string) {
   const tasks = this.taskStore.allTasks().filter(task => task.assignee === memberName);
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

}
