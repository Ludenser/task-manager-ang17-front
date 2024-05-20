import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { TaskRecord } from '../../api/core/model/taskRecord';
import { TaskControllerService } from '../../api/core/services/taskController.service';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, NzCalendarModule, NzBadgeModule, NzIconModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  tasks: TaskRecord[] = [];
  viewDate: Date = new Date();
  subscription!: Subscription;
  showAddIcon = signal(false);
  addTaskForm!: FormGroup;

  constructor(
    private taskService: TaskControllerService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.addTaskForm = this.fb.group({
      taskTitle: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      taskStartTime: [null, [Validators.required]],
      taskEndTime: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadTasks(): void {
    const timeStart = this.getStartOfMonth(this.viewDate);
    const timeEnd = this.getEndOfMonth(this.viewDate);
    this.subscription = this.taskService
      .getAllTaskBetweenTime(timeStart, timeEnd)
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          console.log(this.tasks);
        },
        error: (error) => {
          console.error('Failed to load tasks', error);
        },
      });
  }

  getTasksForDate(date: Date): TaskRecord[] {
    if (this.tasks?.length > 0) {
      return this.tasks.filter((task) => {
        if (!task.taskStartTime) return false;
        return (
          new Date(task.taskStartTime).toDateString() === date.toDateString()
        );
      });
    } else {
      return [];
    }
  }

  dateCellRender(date: Date): string {
    const tasks = this.getTasksForDate(date);
    return tasks
      .map(
        (task) =>
          `<nz-badge nzStatus="processing" nzText="${task.taskTitle}"></nz-badge>`
      )
      .join('');
  }

  onDateSelect(date: Date): void {
    this.viewDate = date;
    this.loadTasks();
  }

  private getStartOfMonth(date: Date): string {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    return formatDate(start, 'yyyy-MM-dd', 'ru_RU');
  }

  private getEndOfMonth(date: Date): string {
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return formatDate(end, 'yyyy-MM-dd', 'ru_RU');
  }

  trackByTaskId(index: number, task: TaskRecord): number | undefined {
    return task.taskId;
  }

  openAddTaskModal(date: Date): void {
    this.addTaskForm.reset();
    this.addTaskForm.patchValue({
      taskStartTime: date,
      taskEndTime: date,
    });
    this.modal.create({
      nzTitle: 'Add Task',
      nzContent: AddTaskComponent,
      nzData: {
        date: date,
      },
      nzOnOk: () => this.addTask(),
    });
  }

  addTask(): void {
    if (this.addTaskForm.valid) {
      const task = this.addTaskForm.value as TaskRecord;
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Failed to add task', error);
        },
      });
    }
  }
}
