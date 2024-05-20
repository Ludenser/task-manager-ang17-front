import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

// Определяем интерфейс для профиля пользователя
interface Profile {
  name: string;
  code: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-user-profile-widget',
  templateUrl: './user-profile-widget.component.html',
  styleUrls: ['./user-profile-widget.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzModalModule, NzDropDownModule, NzMenuModule, NzAvatarModule],
})
export class UserProfileWidgetComponent {
  profile: Profile = {
    name: '',
    code: '',
    avatarUrl: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  logout(): void {
    this.notificationService.stopLoadingFriendRequests();
    this.authService.logout();
    this.router.navigate(['/login']);
    window.location.reload();
  }

  navigateToProfileEdit(): void {
    this.router.navigate(['/profile']);
  }
}
