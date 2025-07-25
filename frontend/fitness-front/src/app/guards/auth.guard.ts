import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

// Auth Guard - Sadece giriş yapmış kullanıcılar erişebilir
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ AuthGuard checking access to:', state.url);

  return authService.isAuthenticated$.pipe(
    take(1), // Sadece bir kez kontrol et
    map(isAuthenticated => {
      if (isAuthenticated) {
        console.log('✅ AuthGuard: Access granted');
        return true;
      } else {
        console.log('❌ AuthGuard: Access denied, redirecting to login');
        // Login sayfasına yönlendir
        router.navigate(['/auth/login'], { 
          queryParams: { returnUrl: state.url } // Giriş yaptıktan sonra geri dönmek için
        });
        return false;
      }
    })
  );
};

// Guest Guard - Sadece giriş yapmamış kullanıcılar erişebilir (login/register sayfaları için)
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('👤 GuestGuard checking access to:', state.url);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        console.log('✅ GuestGuard: Access granted');
        return true;
      } else {
        console.log('❌ GuestGuard: User already authenticated, redirecting to home');
        // Zaten giriş yapmışsa ana sayfaya yönlendir
        router.navigate(['/']);
        return false;
      }
    })
  );
};

// Admin Guard - Sadece admin kullanıcılar erişebilir
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('👑 AdminGuard checking access to:', state.url);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        console.log('❌ AdminGuard: Not authenticated');
        router.navigate(['/auth/login']);
        return false;
      }

      if (authService.isAdmin()) {
        console.log('✅ AdminGuard: Admin access granted');
        return true;
      } else {
        console.log('❌ AdminGuard: Insufficient permissions');
        router.navigate(['/']); // Ya da 403 error sayfası
        return false;
      }
    })
  );
};

// Email Verification Guard - Sadece doğrulanmış kullanıcılar
export const verifiedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('📧 VerifiedGuard checking access to:', state.url);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        console.log('❌ VerifiedGuard: Not authenticated');
        router.navigate(['/auth/login']);
        return false;
      }

      if (authService.isVerified()) {
        console.log('✅ VerifiedGuard: Verified user access granted');
        return true;
      } else {
        console.log('❌ VerifiedGuard: Email not verified');
        // Email doğrulama sayfasına yönlendir
        router.navigate(['/auth/verify-email']);
        return false;
      }
    })
  );
}; 