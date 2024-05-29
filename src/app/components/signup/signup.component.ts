import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzFlexModule,
    NzCardModule,
    NzIconModule,
    NzAlertModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage = signal<null | string>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nickName: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }

    this.registerForm.markAsPending();
    const email = this.registerForm.get('email')!.value;
    const password = this.registerForm.get('password')!.value;
    const nickName = this.registerForm.get('nickName')!.value;
    const firstName = this.registerForm.get('firstName')!.value;
    const lastName = this.registerForm.get('lastName')!.value;

    this.authService
      .register(email, password, firstName, lastName, nickName)
      .subscribe({
        next: () => {
          this.successMessage.set('Успешно!');
          this.errorMessage = null;
          setTimeout(() => this.router.navigate(['login']), 1000);
        },
        error: (error) => {
          this.registerForm.reset();
          this.errorMessage =
            'Пользователь с указанными данными уже сущесвтует / Нет связи с сервером';
          this.successMessage.set('');
        },
      });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
