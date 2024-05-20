import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TaskRecord } from '../../api/core/model/taskRecord';
import { TaskControllerService } from '../../api/core/services/taskController.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [NzFormModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent {
  @Input() date!: Date;
  addTaskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private taskService: TaskControllerService
  ) {
    this.addTaskForm = this.fb.group({
      taskTitle: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      taskStartTime: [null, [Validators.required]],
      taskEndTime: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.addTaskForm.patchValue({
      taskStartTime: this.date,
      taskEndTime: this.date,
    });
  }

  submitForm(): void {
    if (this.addTaskForm.valid) {
      const task = this.addTaskForm.value as TaskRecord;
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.modal.destroy(true);
        },
        error: (error) => {
          console.error('Failed to add task', error);
        },
      });
    }
  }

  cancel(): void {
    this.modal.destroy();
  }
}
