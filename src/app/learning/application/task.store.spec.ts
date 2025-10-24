import { TestBed } from '@angular/core/testing';
import { TaskStore } from './task.store';
import { CreateTaskRequest, UpdateTaskRequest } from '../domain/model/task.entity';

describe('TaskStore', () => {
  let service: TaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', () => {
    const taskRequest: CreateTaskRequest = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high'
    };

    service.addTask(taskRequest);
    expect(service.taskCount()).toBe(1);
    expect(service.allTasks()[0].title).toBe('Test Task');
  });

  it('should toggle task completion', () => {
    const taskRequest: CreateTaskRequest = {
      title: 'Test Task'
    };

    service.addTask(taskRequest);
    const taskId = service.allTasks()[0].id;
    
    expect(service.pendingCount()).toBe(1);
    expect(service.completedCount()).toBe(0);

    service.toggleTask(taskId);
    
    expect(service.pendingCount()).toBe(0);
    expect(service.completedCount()).toBe(1);
  });

  it('should delete a task', () => {
    const taskRequest: CreateTaskRequest = {
      title: 'Test Task'
    };

    service.addTask(taskRequest);
    expect(service.taskCount()).toBe(1);

    const taskId = service.allTasks()[0].id;
    service.deleteTask(taskId);
    
    expect(service.taskCount()).toBe(0);
  });

  it('should update a task', () => {
    const taskRequest: CreateTaskRequest = {
      title: 'Original Title'
    };

    service.addTask(taskRequest);
    const taskId = service.allTasks()[0].id;

    const updateRequest: UpdateTaskRequest = {
      id: taskId,
      title: 'Updated Title',
      completed: true
    };

    service.updateTask(updateRequest);
    
    const updatedTask = service.getTaskById(taskId);
    expect(updatedTask?.title).toBe('Updated Title');
    expect(updatedTask?.completed).toBe(true);
  });
});
