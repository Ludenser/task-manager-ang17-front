import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInfo } from '../../api/user/model/userInfo';
import { AuthControllerService } from '../../api/user/services/authController.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoading$ = this.authState.asObservable();

  constructor(private authControllerService: AuthControllerService) {}

  login(email: string, password: string): Observable<any> {
    return this.authControllerService.signIn(email, password).pipe(
      tap((response) => {
        this.token = response;
        localStorage.setItem('token', this.token);
        this.authState.next(true);
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  fakeLogin(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.token = 'fake-jwt-token';
        localStorage.setItem('token', this.token);
        this.authState.next(true);
      })
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<any> {
    const userInfo: UserInfo = {
      email,
      password,
      firstName,
      lastName,
      nickName: '',
      enabled: true,
      username: email,
      accountNonLocked: true,
      authorities: [],
      credentialsNonExpired: true,
      accountNonExpired: true,
      friendList: [],
    };
    return this.authControllerService.signUp(userInfo).pipe(
      tap((response) => {
        console.log('Registration successful:', response);
      }),
      catchError(this.handleError<any>('register'))
    );
  }

  fakeRegister(email: string, password: string): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        console.log('Fake registration successful for:', email);
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => error);
    };
  }
}
