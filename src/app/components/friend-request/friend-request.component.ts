import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FriendshipRequest } from '../../api/user/model/friendshipRequest';
import { UserControllerService } from '../../api/user/services/userController.service';

@Component({
  selector: 'app-friend-request',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule,
    NzAlertModule,
    NzSpaceModule,
  ],
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendRequestComponent implements OnInit, OnDestroy {
  friendRequests = signal<FriendshipRequest[]>([]);
  loadFriendRequestsInterval!: ReturnType<typeof setInterval>;
  requestForm: FormGroup;
  @Output() friendAccepted = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private userControllerService: UserControllerService
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadFriendRequests();
    this.loadFriendRequestsInterval = setInterval(
      () => this.loadFriendRequests(),
      10000
    );
  }
  ngOnDestroy(): void {
    clearInterval(this.loadFriendRequestsInterval);
  }

  loadFriendRequests(): void {
    this.userControllerService.getFriendsRequest().subscribe({
      next: (requests: FriendshipRequest[]) => {
        this.friendRequests.set(requests);
      },
      error: () => {
        this.msg.error('Failed to load friend requests');
      },
    });
  }

  acceptRequest(email: string): void {
    let friendRequest = this.friendRequests().find(
      (value) => value.email === email
    );

    let friendshipRequest: FriendshipRequest = {
      email: '',
      friend_email: friendRequest?.email,
    };
    console.log(friendshipRequest);
    this.userControllerService
      .acceptFriendship({ ...friendshipRequest })
      .subscribe({
        next: (requests: string) => {
          this.msg.success(requests);
          this.friendAccepted.emit();
          this.cdr.markForCheck();
          this.loadFriendRequests();
        },
        error: () => {
          this.msg.error('Failed to accept friend requests');
        },
      });
  }

  sendFriendRequest(): void {
    if (this.requestForm.valid) {
      const friend_email = this.requestForm.get('email')?.value;

      this.userControllerService
        .addFriend({ friend_email, email: '' })
        .subscribe({
          next: (response) => {
            console.log('Request was successful:', response);
            this.msg.success(`Request to ${friend_email} sends.`);
            this.requestForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Request failed with error:', error);
            this.msg.error('Failed to send friend request' + error.message);
          },
        });
    }
  }
}
