import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { UserInfo } from '../../api/user/model/userInfo';
import { UserControllerService } from '../../api/user/services/userController.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzAvatarModule,
    NzDividerModule,
    NzUploadModule,
    NzDescriptionsModule,
    NzFlexModule,
    NzSpinModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  loading = signal(true);
  avatarUrl?: string;
  profile!: UserInfo;

  constructor(
    private msg: NzMessageService,
    private userControllerService: UserControllerService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userControllerService.getUserInfo1().subscribe({
      next: (data: UserInfo) => {
        this.profile = data;
        this.loading.set(false);
      },
      error: (error) => {
        this.msg.error('Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
}
