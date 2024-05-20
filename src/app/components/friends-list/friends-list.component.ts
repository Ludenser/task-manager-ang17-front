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
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Friend } from '../../api/user/model/friend';
import { UserControllerService } from '../../api/user/services/userController.service';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzListModule],
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendsListComponent implements OnInit {
  friends = signal<Friend[]>([]);
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
    this.userControllerService.getFriends().subscribe({
      next: (friends: Friend[]) => {
        const uniqueFriends = Array.from(
          new Set(friends.map((friend) => friend.email))
        ).map((email) => friends.find((friend) => friend.email === email)!);

        this.friends.set(uniqueFriends);
      },
      error: () => {
        this.msg.error('Failed to load friends');
      },
    });
  }
}
