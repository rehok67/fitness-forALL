import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  
  // Component state
  verificationStatus: 'loading' | 'success' | 'error' | 'invalid' = 'loading';
  message = '';
  token = '';
  
  // Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    console.log('🔐 VerifyEmailComponent initialized');
    
    // URL'den token parametresini al
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      
      if (this.token) {
        console.log('📧 Token bulundu, verification başlatılıyor...');
        this.verifyEmail();
      } else {
        console.log('❌ Token bulunamadı');
        this.verificationStatus = 'invalid';
        this.message = 'Geçersiz verification link\'i. Token bulunamadı.';
      }
    });
  }

  /**
   * Email verification işlemini gerçekleştir
   */
  private verifyEmail(): void {
    this.verificationStatus = 'loading';
    this.message = 'Email adresiniz doğrulanıyor...';
    
    // Backend'e verification request gönder
    this.authService.verifyEmail(this.token).subscribe({
      next: (response) => {
        console.log('✅ Email verification başarılı:', response);
        this.verificationStatus = 'success';
        this.message = 'Email adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.';
        
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Email verification hatası:', error);
        this.verificationStatus = 'error';
        
        // Hata mesajını parse et
        if (error.error?.message) {
          this.message = error.error.message;
        } else if (error.message) {
          this.message = error.message;
        } else {
          this.message = 'Email doğrulama sırasında hata oluştu. Lütfen tekrar deneyin.';
        }
      }
    });
  }

  /**
   * Yeni verification email gönder
   */
  resendVerification(): void {
    console.log('📧 Yeniden verification email gönderiliyor...');
    
    // Burada email adresi lazım, ama token'dan çıkaramayız
    // Basit bir workaround: Kullanıcıdan email isteyebiliriz
    // Ya da login sayfasına yönlendirip orada "resend" özelliği ekleyebiliriz
    this.router.navigate(['/auth/login'], { 
      queryParams: { message: 'verification_failed' } 
    });
  }

  /**
   * Login sayfasına git
   */
  goToLogin(): void {
    console.log('🔑 Login sayfasına yönlendiriliyor...');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Ana sayfaya git
   */
  goToHome(): void {
    console.log('🏠 Ana sayfaya yönlendiriliyor...');
    this.router.navigate(['/']);
  }
} 