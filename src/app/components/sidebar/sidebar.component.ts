import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  PathManagementService,
  Paths,
} from '../../core/path-manager/path-manager.service';

@Component({
  selector: 'sb-sidebar',
  standalone: true,
  imports: [
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    CommonModule,
    NzToolTipModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  paths!: Paths;
  menuItems = this.pathService.getMenuItems();

  constructor(private pathService: PathManagementService) {}

  ngOnInit() {
    this.paths = this.pathService.getAllPaths();
  }
}
