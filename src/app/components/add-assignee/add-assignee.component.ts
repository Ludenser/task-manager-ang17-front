import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
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
import {
  MentionOnSearchTypes,
  NzMentionComponent,
  NzMentionModule,
} from 'ng-zorro-antd/mention';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
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
  ],
  templateUrl: './add-assignee.component.html',
  styleUrl: './add-assignee.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAssigneeComponent {
  loadingFriendsList = signal<boolean>(false);
  suggestions = signal<string[]>(['seee']);
  form: FormGroup;
  inputValue: string = '';
  @ViewChild('mentions', { static: true }) mentionChild!: NzMentionComponent;

  constructor(
    // @Inject(NZ_MODAL_DATA) public data: ModalData,
    private modal: NzModalRef,
    private taskService: TaskControllerService,
    private userService: UserControllerService,
    private msg: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      mention: ['@afc163 ', [Validators.required]],
    });
  }

  onMentionsSearchChange({ value }: MentionOnSearchTypes) {
    console.log('sadasasd', value);

    this.loadingFriendsList.set(true);
    this.userService.getFriends().subscribe({
      next: (result: FriendRecord[]) => {
        console.log('friends', result);

        this.suggestions.set(
          result.map((friend: FriendRecord) => friend.email)
        );
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
        const mention = req.mention as string;
        const modifiedMention = mention.replace(/^@/, ''); // Удаляем первый символ '@'

        return {
          emails: [modifiedMention],
        };
      };
      this.modal.close(processAssign());
    }
  }
}
