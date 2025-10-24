import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskList } from './task-list';
import { TaskStore } from '../../../learning/application/task.store';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatChip } from '@angular/material/chip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskList,
        MatButton,
        MatIcon,
        MatInput,
        MatFormField,
        MatSelect,
        MatCard,
        MatCardContent,
        MatCardActions,
        MatChip,
        MatCheckbox,
        MatDialogModule,
        FormsModule,
        CommonModule
      ],
      providers: [
        TaskStore,
        { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open add dialog', () => {
    component.openAddDialog();
    expect(component.isAddDialogOpen()).toBeTrue();
  });

  it('should close add dialog', () => {
    component.openAddDialog();
    component.closeAddDialog();
    expect(component.isAddDialogOpen()).toBeFalse();
  });

  it('should add a task', () => {
    const initialCount = component.taskStore.taskCount();
    component.newTask.set({
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      category: 'Test'
    });
    
    component.addTask();
    
    expect(component.taskStore.taskCount()).toBe(initialCount + 1);
    expect(component.isAddDialogOpen()).toBeFalse();
  });

  it('should not add empty task', () => {
    const initialCount = component.taskStore.taskCount();
    component.newTask.set({
      title: '',
      description: 'Test Description',
      priority: 'high',
      category: 'Test'
    });
    
    component.addTask();
    
    expect(component.taskStore.taskCount()).toBe(initialCount);
  });

  it('should get correct priority color', () => {
    expect(component.getPriorityColor('high')).toBe('warn');
    expect(component.getPriorityColor('medium')).toBe('accent');
    expect(component.getPriorityColor('low')).toBe('primary');
  });

  it('should get correct priority icon', () => {
    expect(component.getPriorityIcon('high')).toBe('priority_high');
    expect(component.getPriorityIcon('medium')).toBe('remove');
    expect(component.getPriorityIcon('low')).toBe('keyboard_arrow_down');
  });
});
