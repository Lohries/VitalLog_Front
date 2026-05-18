import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, SignUpRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'vl_token';
  private readonly USER_KEY = 'vl_user';

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  signUp(data: SignUpRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({ name: res.name, email: res.email }));
    localStorage.setItem('userLoggedIn', 'true');
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('userLoggedIn');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): { name: string; email: string } | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
