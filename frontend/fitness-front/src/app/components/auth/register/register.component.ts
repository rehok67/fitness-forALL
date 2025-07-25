import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  
  // Form ve state
  registerForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  registrationState: 'form' | 'success' = 'form';
  registeredEmail = '';

  // Services
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    console.log('📝 RegisterComponent oluşturuldu');
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('🚀 RegisterComponent başlatıldı');
  }

  // Reactive Form oluştur
  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_]+$/) // Sadece harf, rakam, underscore
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      firstName: ['', [
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.maxLength(50)
      ]],
      terms: [false, [
        Validators.requiredTrue
      ]]
    }, {
      validators: this.passwordMatchValidator // Custom validator
    });
  }

  // Custom validator - password match kontrolü
  passwordMatchValidator(form: AbstractControl): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    if (password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    
    return null;
  }

  // Form submit
  onSubmit(): void {
    console.log('📝 Register form submit');

    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      console.log('❌ Form geçersiz:', this.getFormErrors());
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formData = this.registerForm.value;
    
    const registerRequest: RegisterRequest = {
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      firstName: formData.firstName?.trim() || '',
      lastName: formData.lastName?.trim() || ''
    };

    console.log('📡 Register request gönderiliyor:', {
      username: registerRequest.username,
      email: registerRequest.email,
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName
    });

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log('✅ Registration başarılı:', response);
        this.isSubmitting = false;
        this.registeredEmail = registerRequest.email;
        this.registrationState = 'success';
      },
      error: (error) => {
        console.error('❌ Registration hatası:', error);
        this.isSubmitting = false;
        
        // Hata mesajını parse et
        if (error.error?.message) {
          this.submitError = error.error.message;
        } else if (error.message) {
          this.submitError = error.message;
        } else {
          this.submitError = 'Kayıt işlemi sırasında hata oluştu. Lütfen tekrar deneyin.';
        }
      }
    });
  }

  // Form validation helper methods
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    // Field-specific error messages
    switch (fieldName) {
      case 'username':
        if (errors['required']) return 'Kullanıcı adı gereklidir';
        if (errors['minlength']) return 'Kullanıcı adı en az 3 karakter olmalıdır';
        if (errors['maxlength']) return 'Kullanıcı adı en fazla 50 karakter olabilir';
        if (errors['pattern']) return 'Kullanıcı adı sadece harf, rakam ve _ içerebilir';
        break;
        
      case 'email':
        if (errors['required']) return 'Email adresi gereklidir';
        if (errors['email']) return 'Geçerli bir email adresi girin';
        if (errors['maxlength']) return 'Email adresi çok uzun';
        break;
        
      case 'password':
        if (errors['required']) return 'Şifre gereklidir';
        if (errors['minlength']) return 'Şifre en az 6 karakter olmalıdır';
        if (errors['maxlength']) return 'Şifre çok uzun';
        break;
        
      case 'confirmPassword':
        if (errors['required']) return 'Şifre tekrarı gereklidir';
        break;
        
      case 'firstName':
        if (errors['maxlength']) return 'Ad çok uzun';
        break;
        
      case 'lastName':
        if (errors['maxlength']) return 'Soyad çok uzun';
        break;
        
      case 'terms':
        if (errors['required']) return 'Kullanım koşullarını kabul etmelisiniz';
        break;
    }

    return 'Geçersiz değer';
  }

  // Form-level error (password mismatch)
  hasPasswordMismatch(): boolean {
    return !!(this.registerForm.errors?.['passwordMismatch'] && 
             this.registerForm.get('confirmPassword')?.touched);
  }

  // Tüm form alanlarını touched olarak işaretle
  markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Debug için - form hatalarını getir
  getFormErrors(): any {
    let errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    if (this.registerForm.errors) {
      errors['form'] = this.registerForm.errors;
    }
    return errors;
  }

  // Navigation methods
  goToLogin(): void {
    console.log('🔑 Login sayfasına yönlendiriliyor');
    this.router.navigate(['/auth/login']);
  }

  goToHome(): void {
    console.log('🏠 Ana sayfaya yönlendiriliyor');
    this.router.navigate(['/']);
  }

  // Success state'den form'a geri dön
  backToForm(): void {
    this.registrationState = 'form';
    this.registerForm.reset();
    this.submitError = '';
  }
} 