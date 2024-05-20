import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserControllerService } from '../../api/user/services/userController.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    SidebarComponent,
    NavbarComponent,
    NzButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements AfterViewInit {
  isAuth: boolean = true;

  @ViewChild('notificationTemplate', { static: false })
  notificationTemplate!: TemplateRef<{}>;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private userControllerService: UserControllerService,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuth = this.getIsAuth();
        if (this.getIsAuth()) {
          this.notificationService.startLoadingFriendRequests();
        } else {
          this.notificationService.stopLoadingFriendRequests();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.notificationService.templateRef = this.notificationTemplate;
  }

  ngOnDestroy(): void {
    this.notificationService.stopLoadingFriendRequests();
  }

  getIsAuth(): boolean {
    return !!localStorage.getItem('token');
  }

  acceptRequest(email: string): void {
    this.userControllerService
      .acceptFriendship({ friend_email: email })
      .subscribe({
        next: (requests: string) => {
          this.msg.success(requests);
          this.notificationService.closeNotification(email);
        },
        error: () => {
          this.msg.error('Failed to accept friend requests');
        },
      });
  }
}
