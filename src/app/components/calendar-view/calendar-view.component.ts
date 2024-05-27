import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import {
  NzContextMenuService,
  NzDropDownModule,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { Task } from '../../api/core/model/task';
import { TaskRecord } from '../../api/core/model/taskRecord';
import { TaskControllerService } from '../../api/core/services/taskController.service';
import { UserControllerService } from '../../api/user/services/userController.service';
import { AddAssigneeComponent } from '../add-assignee/add-assignee.component';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    NzCalendarModule,
    NzBadgeModule,
    NzIconModule,
    NzDropdownMenuComponent,
    NzDropDownModule,
    NzPopoverModule,
    NzMentionModule,
    NzInputModule,
    FormsModule,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarViewComponent implements OnInit {
  tasks = signal<TaskRecord[]>([]);
  viewDate: Date = new Date();
  subscription!: Subscription;
  showAddIcon = signal(false);
  addTaskForm!: FormGroup;
  selectedTask!: TaskRecord;

  constructor(
    private taskService: TaskControllerService,
    private userService: UserControllerService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService,
    private msg: NzMessageService
  ) {
    this.loadTasks().subscribe();
  }

  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      task_title: ['', [Validators.required]],
      task_description: ['', [Validators.required]],
      task_start_time: [null, [Validators.required]],
      task_end_time: [null, [Validators.required]],
    });
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  loadTasks(): Observable<TaskRecord[]> {
    const timeStart = this.getStartOfMonth(this.viewDate);
    const timeEnd = this.getEndOfMonth(this.viewDate);
    return this.taskService.getAllTaskBetweenTime(timeStart, timeEnd).pipe(
      map((tasks: TaskRecord[]) => {
        this.tasks.set(tasks);
        console.log(this.tasks());
        return tasks;
      }),
      catchError((error: any) => {
        console.error('Failed to load tasks', error);
        this.msg.error(error);
        throw error;
      })
    );
  }

  loadTaskById(taskId: number): Observable<TaskRecord> {
    return this.taskService.getTaskById(taskId).pipe(
      map((task: TaskRecord) => {
        this.selectedTask = task;
        console.log(this.selectedTask);
        return task;
      }),
      catchError((error: any) => {
        console.error('Failed to load task by id', error);
        this.msg.error(error);
        throw error;
      })
    );
  }

  getTasksForDate(date: Date): TaskRecord[] {
    if (this.tasks()?.length > 0) {
      return this.tasks().filter((task) => {
        if (!task.task_start_time || !task.task_end_time) return false;
        const taskStartTime = new Date(task.task_start_time);
        const taskEndTime = new Date(task.task_end_time);
        return date >= taskStartTime && date <= taskEndTime;
      });
    } else {
      return [];
    }
  }

  onDateSelect(date: Date): void {
    this.viewDate = date;
    this.loadTasks().subscribe();
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
    return task.task_id;
  }

  openTask(taskId: number) {
    this.loadTaskById(taskId).subscribe({
      next: (task) => {
        this.modal.create({
          nzTitle: 'Task info',
          nzContent: AddTaskComponent,
          nzData: {
            task: task,
            infoMode: true,
          },
          nzFooter: null,
        });
      },
      error: (error) => {
        console.error('Failed to load task by id', error);
        this.msg.error(error);
      },
    });
  }

  getTaskStatusForNz(status: Task.CriticalEnum): string {
    switch (status) {
      case 'HIGH':
        return 'error';
      case 'LOW':
        return 'processing';
      case 'NORMAL':
        return 'default';
      default:
        return 'default';
    }
  }

  updateTask(task: TaskRecord, taskId: number) {
    this.taskService.updateTask(task, taskId).subscribe({
      next: () => {
        this.loadTasks().subscribe();
        this.msg.success('Задача удалена');
      },
      error: (error) => {
        console.error('Failed to delete task', error);
        this.msg.error(error);
      },
    });
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.loadTasks().subscribe();
        this.msg.success('Задача удалена');
      },
      error: (error) => {
        console.error('Failed to delete task', error);
        this.msg.error(error);
      },
    });
  }

  openAddTaskModal(date: Date): void {
    this.addTaskForm.reset();
    this.addTaskForm.patchValue({
      task_start_time: date,
      task_end_time: date,
    });
    const modal = this.modal.create({
      nzTitle: 'Add Task',
      nzContent: AddTaskComponent,
      nzData: {
        date: date,
      },
      nzOkText: 'Создать',
      nzOnOk: (child) => child.submitForm(),
    });
    modal.afterClose.subscribe((result: TaskRecord) => {
      if (result) {
        console.log('result', result);

        this.taskService.createTask(result).subscribe({
          next: () => {
            this.loadTasks().subscribe();
            this.msg.success('Задача создана');
          },
          error: (error) => {
            console.error('Failed to add task', error);
            this.msg.error(error);
          },
        });
      }
    });
  }

  openAddAssigneeModal(taskId: number): void {
    const modal = this.modal.create({
      nzTitle: 'User Assign',
      nzContent: AddAssigneeComponent,
      nzData: {
        taskId,
      },
      nzOkText: 'Добавление пользователя',
      nzOnOk: (child) => child.submitForm(),
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        console.log('result', result);

        this.taskService.assignTask({ ...result, taskId }, taskId).subscribe({
          next: () => {
            this.loadTasks().subscribe();
            this.msg.success('Пользователь прикреплен');
          },
          error: (error) => {
            console.error('Failed assignee to task', error);
            this.msg.error(error);
          },
        });
      }
    });
  }
}
