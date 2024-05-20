import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FriendRequestComponent } from '../../components/friend-request/friend-request.component';
import { FriendsListComponent } from '../../components/friends-list/friends-list.component';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    FriendRequestComponent,
    FriendsListComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {}
