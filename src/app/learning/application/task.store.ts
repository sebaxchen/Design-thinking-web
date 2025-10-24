import { Injectable, signal, computed } from '@angular/core';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../domain/model/task.entity';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  private tasks = signal<Task[]>([]);

  // Computed values
  readonly allTasks = computed(() => this.tasks().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  readonly notStartedTasks = computed(() => 
    this.tasks().filter(task => task.status === 'not-started').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
  readonly inProgressTasks = computed(() => 
    this.tasks().filter(task => task.status === 'in-progress').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
  readonly completedTasks = computed(() => 
    this.tasks().filter(task => task.status === 'completed').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
  readonly taskCount = computed(() => this.tasks().length);
  readonly completedCount = computed(() => this.completedTasks().length);
  readonly inProgressCount = computed(() => this.inProgressTasks().length);
  readonly notStartedCount = computed(() => this.notStartedTasks().length);

  // Actions
  addTask(request: CreateTaskRequest): void {
    console.log('Adding task:', request);
    const newTask: Task = {
      id: this.generateId(),
      title: request.title,
      description: request.description || '',
      status: request.status || 'not-started',
      priority: request.priority || 'medium',
      category: request.category,
      assignee: request.assignee || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.update(tasks => {
      const newTasks = [...tasks, newTask];
      console.log('Updated tasks:', newTasks);
      return newTasks;
    });
  }

  updateTask(request: UpdateTaskRequest): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === request.id
          ? {
              ...task,
              ...request,
              updatedAt: new Date()
            }
          : task
      )
    );
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  updateStatus(id: string, status: TaskStatus): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === id
          ? { 
              ...task, 
              status: status,
              updatedAt: new Date() 
            }
          : task
      )
    );
  }

  clearCompleted(): void {
    this.tasks.update(tasks => tasks.filter(task => task.status !== 'completed'));
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find(task => task.id === id);
  }

  getTasksByCategory(category: string): Task[] {
    return this.tasks().filter(task => task.category === category);
  }

  getTasksByPriority(priority: 'low' | 'medium' | 'high'): Task[] {
    return this.tasks().filter(task => task.priority === priority).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getTasksByAssignee(assignee: string): Task[] {
    return this.tasks().filter(task => task.assignee === assignee).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
