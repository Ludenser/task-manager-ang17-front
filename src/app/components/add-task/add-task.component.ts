import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import dayjs from 'dayjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TaskRecord } from '../../api/core/model/taskRecord';

interface ModalData {
  date?: Date;
  infoMode?: boolean;
  updateMode?: boolean;
  task?: TaskRecord;
  members?: string[];
}
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSelectModule,
    NzTypographyModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent {
  addTaskForm: FormGroup;
  parsedStartDate!: Date;
  parsedEndDate!: Date;

  constructor(
    @Inject(NZ_MODAL_DATA) public data: ModalData,
    private fb: FormBuilder,
    private modal: NzModalRef
  ) {
    this.addTaskForm = this.fb.group({
      task_title: ['', [Validators.required]],
      task_description: ['', [Validators.required]],
      task_start_time: [null, [Validators.required]],
      task_end_time: [null, [Validators.required]],
      task_critical: [null, [Validators.required]],
    });
    if (this.data.infoMode) {
      this.addTaskForm.disable();
      this.parsedStartDate = dayjs(this.data.task?.task_start_time).toDate();
      this.parsedEndDate = dayjs(this.data.task?.task_end_time).toDate();
      console.log('parsedData', this.parsedStartDate);
      console.log(this.data.task);

      this.addTaskForm.patchValue({
        task_title: this.data.task?.task_title,
        task_description: this.data.task?.task_description,
        task_start_time: this?.parsedStartDate,
        task_end_time: this?.parsedEndDate,
        task_critical: this.data.task?.task_critical,
      });
    }
    if (this.data.updateMode) {
      this.parsedStartDate = dayjs(this.data.task?.task_start_time).toDate();
      this.parsedEndDate = dayjs(this.data.task?.task_end_time).toDate();
      console.log('parsedData', this.parsedStartDate);
      console.log(this.data.task);

      this.addTaskForm.patchValue({
        task_title: this.data.task?.task_title,
        task_description: this.data.task?.task_description,
        task_start_time: this?.parsedStartDate,
        task_end_time: this?.parsedEndDate,
        task_critical: this.data.task?.task_critical,
      });
    }
  }

  ngOnInit(): void {
    console.log('nzDate', this.data.date);
    if (!(this.data.infoMode || this.data.updateMode)) {
      this.addTaskForm.patchValue({
        task_start_time: this.data.date,
        task_end_time: this.data.date,
      });
    }
  }

  submitForm(): void {
    if (this.addTaskForm.valid) {
      const processTask = (): TaskRecord => {
        const task = this.addTaskForm.value as TaskRecord;

        return {
          ...task,
          task_start_time: dayjs(task.task_start_time).format(
            'YYYY-MM-DDTHH:mm'
          ),
          task_end_time: dayjs(task.task_end_time).format('YYYY-MM-DDTHH:mm'),
        };
      };
      this.modal.close(processTask());
    }
  }

  cancel(): void {
    this.modal.destroy();
  }
}
