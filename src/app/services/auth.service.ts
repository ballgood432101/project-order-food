import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

interface UserResponse {
  user_id: number;
  username: string;
  email: string;
  role: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: UserResponse | undefined = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : undefined;

  public get getUser() {
    return this.user;
  }

  public get getToken() {
    return this.user?.access_token;
  }

  public get getIsCustomer() {
    return this.user?.role === '1';
  }

  public get getIsAdmin() {
    return this.user?.role === '2';
  }

  public get getIsStaff() {
    return this.user?.role === '3';
  }

  public get isLoginOrRegisterPage() {
    return (
      this.router.url.includes('login') || this.router.url.includes('register')
    );
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  public get isLoggedIn() {
    return !!this.user;
  }

  public login = (user: {
    username: string;
    password: string;
  }): Observable<UserResponse> => {
    return this.httpClient
      .post<UserResponse>(`http://localhost:3000/api/user/login`, user)
      .pipe(
        tap((res) => {
          this.user = res;
          localStorage.setItem('user', JSON.stringify(this.user));
        }),
        map((res) => res)
      );
  };

  public register = (user: any): Observable<any> => {
    return this.httpClient.post<any>(`http://localhost:3000/api/user/`, user);
  };

  public checkIsLoggedIn() {
    return !!localStorage.getItem('user');
  }

  public logout() {
    localStorage.clear();
    this.user = undefined;
    this.router.navigate(['']);
  }
}
