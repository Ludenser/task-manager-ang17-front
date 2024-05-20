import { Injectable, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FriendshipRequest } from '../../api/user/model/friendshipRequest';
import { UserControllerService } from '../../api/user/services/userController.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private shownRequests = new Set<string>();
  private notificationIds = new Map<string, string>();
  templateRef!: TemplateRef<any>;
  loadFriendRequestsInterval!: ReturnType<typeof setInterval>;

  constructor(
    private notificationService: NzNotificationService,
    private userControllerService: UserControllerService,
    private msg: NzMessageService
  ) {}

  startLoadingFriendRequests(): void {
    this.loadFriendRequests();
    this.loadFriendRequestsInterval = setInterval(
      () => this.loadFriendRequests(),
      10000
    );
  }

  stopLoadingFriendRequests(): void {
    clearInterval(this.loadFriendRequestsInterval);
  }

  loadFriendRequests(): void {
    this.userControllerService.getFriendsRequest().subscribe({
      next: (requests: FriendshipRequest[]) => {
        this.showFriendRequestsNotifications(requests);
      },
      error: () => {
        this.msg.error('Failed to load friend requests');
      },
    });
  }

  private showFriendRequestsNotifications(requests: FriendshipRequest[]): void {
    requests.forEach((request) => {
      if (request.email && !this.shownRequests.has(request.email)) {
        const notificationId = this.notificationService.template(
          this.templateRef,
          {
            nzData: { email: request.email },
            nzDuration: 0,
            nzPlacement: 'bottomRight',
          }
        ).messageId;

        this.shownRequests.add(request.email);
        this.notificationIds.set(request.email, notificationId);
      }
    });
  }

  closeNotification(email: string): void {
    const notificationId = this.notificationIds.get(email);
    if (notificationId) {
      this.notificationService.remove(notificationId);
      this.notificationIds.delete(email);
      this.shownRequests.delete(email);
    }
  }

  resetShownRequests(): void {
    this.shownRequests.clear();
    this.notificationIds.clear();
  }
}
