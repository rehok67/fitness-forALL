import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {
  AuthState,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerificationResponse,
  ResendVerificationRequest,
  ApiResponse,
  UserInfo,
  AUTH_STORAGE_KEYS,
  AUTH_HTTP_STATUS
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // ============================================================================
  // CONFIGURATION & DEPENDENCIES
  // ============================================================================
  
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private http = inject(HttpClient);
  private router = inject(Router);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  // Public Observable - Components bunları dinler
  public authState$ = this.authStateSubject.asObservable();
  public isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  public user$ = this.authState$.pipe(map(state => state.user));
  public loading$ = this.authState$.pipe(map(state => state.loading));
  public error$ = this.authState$.pipe(map(state => state.error));

  constructor() {
    console.log('🔐 AuthService initialized');
    this.initializeAuth();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      console.log('🔄 Restoring authentication from localStorage');
      this.updateAuthState({
        isAuthenticated: true,
        user: user,
        token: token,
        loading: false,
        error: null
      });
    }
  }

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  login(request: LoginRequest): Observable<LoginResponse> {
    console.log('🔑 Login attempt for:', request.emailOrUsername);
    this.setLoading(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        console.log('✅ Login successful:', response.user.username);
        this.handleLoginSuccess(response);
      }),
      catchError(error => {
        console.error('❌ Login failed:', error);
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    console.log('📝 Registration attempt for:', request.email);
    this.setLoading(true);

    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, request).pipe(
      tap(response => {
        console.log('✅ Registration successful:', response.email);
        this.setLoading(false);
        this.clearError();
      }),
      catchError(error => {
        console.error('❌ Registration failed:', error);
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  verifyEmail(token: string): Observable<VerificationResponse> {
    console.log('📧 Email verification for token:', token.substring(0, 8) + '...');
    this.setLoading(true);

    return this.http.get<VerificationResponse>(`${this.API_URL}/verify?token=${token}`).pipe(
      tap(response => {
        console.log('✅ Email verification successful:', response.email);
        this.setLoading(false);
        this.clearError();
      }),
      catchError(error => {
        console.error('❌ Email verification failed:', error);
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  resendVerification(request: ResendVerificationRequest): Observable<ApiResponse> {
    console.log('🔄 Resending verification email to:', request.email);
    this.setLoading(true);

    return this.http.post<ApiResponse>(`${this.API_URL}/resend-verification`, request).pipe(
      tap(response => {
        console.log('✅ Verification email sent');
        this.setLoading(false);
        this.clearError();
      }),
      catchError(error => {
        console.error('❌ Failed to resend verification:', error);
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    console.log('🚪 User logout');
    this.clearAuthData();
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
    this.router.navigate(['/']);
  }

  // ============================================================================
  // TOKEN & STORAGE MANAGEMENT
  // ============================================================================

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): UserInfo | null {
    return this.authStateSubject.value.user;
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.storeAuthData(response.token, response.user);
    this.updateAuthState({
      isAuthenticated: true,
      user: response.user,
      token: response.token,
      loading: false,
      error: null
    });
  }

  private storeAuthData(token: string, user: UserInfo): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  }

  private getStoredUser(): UserInfo | null {
    const userJson = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  }

  // ============================================================================
  // STATE MANAGEMENT HELPERS
  // ============================================================================

  private updateAuthState(newState: AuthState): void {
    this.authStateSubject.next(newState);
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.updateAuthState({ ...currentState, loading, error: null });
  }

  private setError(error: string): void {
    const currentState = this.authStateSubject.value;
    this.updateAuthState({ ...currentState, loading: false, error });
  }

  private clearError(): void {
    const currentState = this.authStateSubject.value;
    this.updateAuthState({ ...currentState, error: null });
  }

  private handleAuthError(error: HttpErrorResponse): void {
    let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    
    if (error.status === AUTH_HTTP_STATUS.UNAUTHORIZED) {
      errorMessage = 'Email/kullanıcı adı veya şifre hatalı.';
    } else if (error.status === AUTH_HTTP_STATUS.FORBIDDEN) {
      errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
    } else if (error.status === AUTH_HTTP_STATUS.UNPROCESSABLE_ENTITY) {
      errorMessage = 'Gönderilen bilgiler geçersiz.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    
    this.setError(errorMessage);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isVerified(): boolean {
    const user = this.getCurrentUser();
    return user ? user.verified : false;
  }

  // Force token refresh (ileride kullanılabilir)
  refreshToken(): Observable<LoginResponse> {
    // Bu metod refresh token implementasyonu için placeholder
    throw new Error('Refresh token not implemented yet');
  }
} 