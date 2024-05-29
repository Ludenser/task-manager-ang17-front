import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMentionComponent, NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TaskControllerService } from '../../api/core/services/taskController.service';
import { FriendRecord } from '../../api/user/model/friendRecord';
import { UserControllerService } from '../../api/user/services/userController.service';

@Component({
  selector: 'app-add-assignee',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NzFormModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzMentionComponent,
    NzMentionModule,
    ReactiveFormsModule,
    NzSelectModule,
  ],
  templateUrl: './add-assignee.component.html',
  styleUrl: './add-assignee.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAssigneeComponent {
  loadingFriendsList = signal<boolean>(false);
  suggestions = signal<string[]>([]);
  form: FormGroup;
  inputValue: string = '';

  constructor(
    // @Inject(NZ_MODAL_DATA) public data: ModalData,
    private modal: NzModalRef,
    private taskService: TaskControllerService,
    private userService: UserControllerService,
    private msg: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      mention: [[], [Validators.required]],
    });
    this.loadFriends();
  }

  // mentionValidator: ValidatorFn = (control: AbstractControl) => {
  //   if (!control.value) {
  //     return { required: true };
  //   }

  //   const mentions = this.mentionChild?.getMentions() || [];

  //   const hasDuplicates = mentions.some((mention, index) => {
  //     return mentions.indexOf(mention) !== index;
  //   });

  //   if (hasDuplicates) {
  //     return { duplicate: true, error: true };
  //   }

  //   return null;
  // };

  loadFriends() {
    this.loadingFriendsList.set(true);
    this.userService.getFriends().subscribe({
      next: (result: FriendRecord[]) => {
        this.suggestions.set(
          result.map((friend: FriendRecord) => friend.email)
        );
        console.log('friends', this.suggestions());
        this.loadingFriendsList.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch friendlist', error);
        this.msg.error(error);
      },
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      const processAssign = () => {
        const req = this.form.value;
        console.log(req);

        const mention = req.mention as string[];
        return {
          emails: mention,
        };
      };
      this.modal.close(processAssign());
    }
  }
}
