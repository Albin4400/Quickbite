import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginPayload, RegisterPayload } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'quickbite_token';
  private readonly USER_KEY = 'quickbite_user';

  // Reactive signal for current user state
  currentUser = signal<User | null>(this.getStoredUser());
  isAuthenticated = signal<boolean>(this.hasValidToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Register a new user with name, email, and password.
   */
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, payload).pipe(
      tap((res) => {
        if (res && res.access_token && res.user) {
          this.saveAuthData(res.access_token, res.user);
        }
      })
    );
  }

  /**
   * Log in an existing user with email and password.
   */
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, payload).pipe(
      tap((res) => {
        if (res && res.access_token && res.user) {
          this.saveAuthData(res.access_token, res.user);
        }
      })
    );
  }

  /**
   * Log out the current user, clear localStorage, and redirect to /login.
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is currently logged in.
   */
  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get JWT access token from localStorage.
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get user information from localStorage.
   */
  getUser(): User | null {
    return this.currentUser();
  }

  /**
   * Store JWT and User object into localStorage and update signals.
   */
  saveAuthData(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  /**
   * Remove JWT and User data from localStorage and reset signals.
   */
  clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private hasValidToken(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && token.trim().length > 0;
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
}
