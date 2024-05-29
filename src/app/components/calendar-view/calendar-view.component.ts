import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  Observable,
  Subscription,
  catchError,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { MembersResponse } from '../../api/core/model/membersResponse';
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
    NzTypographyModule,
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
        this.msg.error(error.error.message);
        throw error.error;
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
        this.msg.error(error.error.message);
        throw error.error;
      })
    );
  }

  loadTaskMembers(taskId: number) {
    return this.taskService.getAllMembersInTask(taskId).pipe(
      map((members: MembersResponse[]) => {
        console.log(members);
        return members;
      }),
      catchError((error: any) => {
        console.error('Failed to load members by id', error);
        this.msg.error(error.error.message);
        throw error.error;
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
    this.loadTaskMembers(taskId)
      .pipe(
        switchMap((members) => {
          return this.loadTaskById(taskId).pipe(
            tap((task) => {
              this.modal.create({
                nzTitle: 'Информация о задаче',
                nzContent: AddTaskComponent,
                nzData: {
                  task: task,
                  infoMode: true,
                  members: members.map((member) => member.email),
                },
                nzFooter: null,
              });
            })
          );
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Failed to load task and members', error);
          this.msg.error(error.error.message);
        },
      });
  }

  getTaskPriorityForNz(status: Task.CriticalEnum): string {
    switch (status) {
      case 'HIGH':
        return 'error';
      case 'LOW':
        return 'default';
      case 'NORMAL':
        return 'processing';
      default:
        return 'default';
    }
  }

  updateTask(task: TaskRecord, taskId: number) {
    this.taskService.updateTask(task, taskId).subscribe({
      next: () => {
        this.loadTasks().subscribe();
        this.msg.success('Задача обновлена');
      },
      error: (error) => {
        console.error('Failed to delete task', error);
        this.msg.error(error.error.message);
      },
    });
  }

  setDone(task: TaskRecord, taskId: number) {
    this.taskService
      .updateTask({ ...task, task_status: 'DONE' }, taskId)
      .subscribe({
        next: () => {
          this.loadTasks().subscribe();
          this.msg.success('Задача завершена.');
        },
        error: (error) => {
          console.error('Failed to delete task', error);
          this.msg.error(error.error.message);
        },
      });
  }

  onDelete(taskId: number): void {
    this.proceedConfirm('delete', () => this.deleteTask(taskId));
  }

  onDone(task: TaskRecord, taskId: number): void {
    this.proceedConfirm('setDone', () => this.setDone(task, taskId));
  }

  proceedConfirm(action: 'delete' | 'setDone', onConfirm: () => void): void {
    let nzTitle,
      nzOkText = '';
    switch (action) {
      case 'delete':
        nzTitle = 'Вы уверены, что хотите удалить задачу?';
        nzOkText = 'Удалить';
        break;
      case 'setDone':
        nzTitle = 'Вы уверены, что хотите отметить задачу выполненной?';
        nzOkText = 'Да';
        break;
      default:
        break;
    }
    this.modal.confirm({
      nzTitle,
      nzOkText,
      nzCancelText: 'Отменить',
      nzCentered: true,
      nzOkDanger: true,
      nzOnOk: onConfirm,
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
        this.msg.error(error.error.message);
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
      nzTitle: 'Создание задачи',
      nzContent: AddTaskComponent,
      nzData: {
        date: date,
      },
      nzOkDisabled: true,
      nzOkText: 'Создать',
      nzOnOk: (child) => child.submitForm(),
    });

    modal.afterOpen.subscribe(() => {
      const modalForm = modal.getContentComponent()?.addTaskForm;

      modalForm.valueChanges.subscribe(() => {
        modal.updateConfig({ nzOkDisabled: modalForm.invalid });
      });
    });
    modal.afterClose.subscribe((result: TaskRecord) => {
      if (result) {
        console.log('result', result);

        this.taskService.createTask(result).subscribe({
          next: () => {
            this.loadTasks().subscribe();
            this.msg.success('Задача создана');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Failed to add task', error);
            this.msg.error(error.error.message);
          },
        });
      }
    });
  }

  openChangeTaskModal(taskId: number): void {
    let modal: NzModalRef<AddTaskComponent, any>;
    this.loadTaskById(taskId).subscribe({
      next: (task) => {
        modal = this.modal.create({
          nzTitle: 'Изменение задачи',
          nzContent: AddTaskComponent,
          nzData: {
            task: task,
            updateMode: true,
          },
          nzOkDisabled: true,
          nzOkText: 'Обновить',
          nzOnOk: (child) => child.submitForm(),
        });
        modal.afterOpen.subscribe(() => {
          const modalForm = modal.getContentComponent()?.addTaskForm;

          modalForm.valueChanges.subscribe(() => {
            modal.updateConfig({ nzOkDisabled: modalForm.invalid });
          });
        });
        modal.afterClose.subscribe((result) => {
          if (result) {
            console.log('последний резулт', result);

            this.taskService
              .updateTask({ ...task, ...result }, taskId)
              .subscribe({
                next: () => {
                  this.loadTasks().subscribe();
                  this.msg.success('Задача обновлена.');
                },
                error: (error) => {
                  console.error('Failed to update task', error);
                  this.msg.error(error.error.message);
                },
              });
          }
        });
      },
      error: (error) => {
        console.error('Failed to load task by id', error);
        this.msg.error(error);
      },
    });
  }

  openAddAssigneeModal(taskId: number): void {
    const modal = this.modal.create({
      nzTitle: 'Добавление пользователя',
      nzContent: AddAssigneeComponent,
      nzData: {
        taskId,
      },
      nzOkDisabled: true,
      nzOkText: 'Добавить',
      nzOnOk: (child) => child.submitForm(),
    });

    modal.afterOpen.subscribe(() => {
      const modalForm = modal.getContentComponent()?.form;

      modalForm.valueChanges.subscribe(() => {
        modal.updateConfig({ nzOkDisabled: modalForm.invalid });
      });
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        console.log('result', result);
        this.taskService.assignTask({ ...result, taskId }, taskId).subscribe({
          next: (res) => {
            let busyUsers: string | undefined;
            if (res.length > 0) {
              busyUsers = res.map((error) => error.id).join(',');
              this.msg.warning(`${busyUsers}, занят/-ы в это время`);
            } else {
              this.loadTasks().subscribe();
              this.msg.success('Пользователи прикреплены');
            }
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
