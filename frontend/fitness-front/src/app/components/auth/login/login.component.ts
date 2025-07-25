import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { LoginRequest, AUTH_VALIDATION } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  
  // ============================================================================
  // COMPONENT STATE
  // ============================================================================
  
  loginForm!: FormGroup;
  showPassword = false;
  returnUrl = '/';
  
  // Service dependencies
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  // Observables lifecycle management
  private destroy$ = new Subject<void>();
  
  // Auth state observables
  loading$ = this.authService.loading$;
  error$ = this.authService.error$;

  constructor() {
    console.log('🔑 LoginComponent initialized');
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getReturnUrl();
    this.checkExistingAuth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(AUTH_VALIDATION.PASSWORD.MIN_LENGTH)
      ]],
      rememberMe: [false]
    });
  }

  private getReturnUrl(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private checkExistingAuth(): void {
    // Zaten giriş yapmışsa ana sayfaya yönlendir
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          console.log('🔄 User already authenticated, redirecting...');
          this.router.navigate([this.returnUrl]);
        }
      });
  }

  // ============================================================================
  // FORM ACTIONS
  // ============================================================================

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const loginRequest: LoginRequest = {
      emailOrUsername: this.loginForm.value.emailOrUsername,
      password: this.loginForm.value.password
    };

    console.log('🔑 Submitting login for:', loginRequest.emailOrUsername);

    this.authService.login(loginRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Login successful, redirecting to:', this.returnUrl);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('❌ Login failed:', error);
          // Error handling is done in AuthService
        }
      });
  }

  // ============================================================================
  // UI HELPERS
  // ============================================================================

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }

  navigateToForgotPassword(): void {
    // İleride implement edilecek
    console.log('Forgot password - not implemented yet');
  }

  // ============================================================================
  // FORM VALIDATION HELPERS
  // ============================================================================

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.loginForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    return field.invalid && (field.dirty || field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) {
      switch (fieldName) {
        case 'emailOrUsername': return 'Email veya kullanıcı adı gerekli';
        case 'password': return 'Şifre gerekli';
        default: return 'Bu alan gerekli';
      }
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `En az ${requiredLength} karakter olmalı`;
    }

    return 'Geçersiz değer';
  }

  // ============================================================================
  // SOCIAL LOGIN (İleride implement edilebilir)
  // ============================================================================

  loginWithGoogle(): void {
    console.log('Google login - not implemented yet');
  }

  loginWithGithub(): void {
    console.log('GitHub login - not implemented yet');
  }
} 