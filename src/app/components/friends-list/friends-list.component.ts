import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  effect,
  signal,
} from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Friend } from '../../api/user/model/friend';
import { UserControllerService } from '../../api/user/services/userController.service';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzListModule,
    NzFlexModule,
    NzAvatarModule,
  ],
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendsListComponent implements OnInit {
  friends = signal<Friend[]>([]);
  loading = signal<boolean>(false);
  @Input() friendAccepted: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private msg: NzMessageService,
    private userControllerService: UserControllerService
  ) {
    effect(() => {
      this.loadFriends();
    });
  }

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends(): void {
    this.loading.set(true);
    this.userControllerService.getFriends().subscribe({
      next: (friends: Friend[]) => {
        const uniqueFriends = Array.from(
          new Set(friends.map((friend) => friend.email))
        ).map((email) => friends.find((friend) => friend.email === email)!);
        this.friends.set(uniqueFriends);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.msg.error('Failed to load friends');
      },
    });
  }
}
