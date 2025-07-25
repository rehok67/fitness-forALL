import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // JWT token'ı al
  const token = authService.getToken();
  
  // Token varsa Authorization header'ı ekle
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Debug log (development için)
    console.log('🔐 Adding JWT token to request:', {
      url: req.url,
      method: req.method,
      hasToken: !!token
    });
  }

  // Request'i gönder ve response'u handle et
  return next(authReq).pipe(
    catchError(error => {
      // 401 Unauthorized - Token geçersiz veya süresi dolmuş
      if (error.status === 401) {
        console.warn('🚨 401 Unauthorized - Token may be expired');
        
        // Auth endpoint'leri için logout yapma (çünkü zaten giriş yapmaya çalışıyor)
        if (!req.url.includes('/api/auth/')) {
          console.log('🚪 Auto-logout due to expired token');
          authService.logout();
        }
      }
      
      // 403 Forbidden - Yetkisiz erişim
      if (error.status === 403) {
        console.warn('🚨 403 Forbidden - Insufficient permissions');
        // İsteğe bağlı: Bir error sayfasına yönlendir
      }

      return throwError(() => error);
    })
  );
}; 