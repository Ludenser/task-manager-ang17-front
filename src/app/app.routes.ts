import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './core/auth/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'register', component: SignupComponent, pathMatch: 'full' },
      {
        path: '',
        canActivate: [authGuard],
        children: [
          {
            path: 'profile',
            loadComponent: () =>
              import('./components/profile/profile.component').then(
                (c) => c.ProfileComponent
              ),
          },
          {
            path: 'friends',
            loadComponent: () =>
              import('./pages/friends/friends.component').then(
                (c) => c.FriendsComponent
              ),
          },
          {
            path: 'todo',
            loadComponent: () =>
              import('./pages/todo/todo.component').then(
                (c) => c.TodoComponent
              ),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./components/profile/profile.component').then(
                (c) => c.ProfileComponent
              ),
          },
        ],
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
];
