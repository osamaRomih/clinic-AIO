import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ChatService, IExternalAuth, ILoginRequest, ILoginResponse, IUser } from '../../public-api';
import { IRegisterCred } from '../../models/login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<IUser | null>(null);
  baseAPI = 'http://localhost:5069/api';
  constructor(private httpClient: HttpClient, private router: Router, private chatService: ChatService) {}

  login(model: ILoginRequest) {
    return this.httpClient.post<ILoginResponse>(`${this.baseAPI}/auth/login`, model);
  }

  register(model: IRegisterCred) {
    return this.httpClient.post(`${this.baseAPI}/auth/register`, model);
  }

  loginWithGoogle(body: IExternalAuth) {
    console.log(body);
    return this.httpClient.post<ILoginResponse>(`${this.baseAPI}/auth/external-login`, body);
  }

  getUserInfo() {
    return this.httpClient.get<IUser>(`${this.baseAPI}/me`).pipe(
      map((res) => {
        this.setCurrentUser(res);
        return res;
      }),
    );
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user.set(user);
  }

  refreshToken() {
    const body = {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
    console.log('Sending refresh body:', body);

    return this.httpClient.post(`${this.baseAPI}/auth/refresh-token`, body).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
      }),
    );
  }

  revokeRefreshToken() {
    const body = {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
    return this.httpClient.put(`${this.baseAPI}/auth/revoke-refresh-token`, body).pipe(
      tap((res: any) => {
        this.logout();
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl('/auth/login');
    this.user.set(null);
    this.chatService.closeConnection();
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get refresh(): string | null {
    return localStorage.getItem('refreshToken');
  }
}
