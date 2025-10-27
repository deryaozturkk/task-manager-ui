import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Bu, Angular 17+ stilinde modern bir "Functional Interceptor"
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken(); // Token'ı localStorage'dan al

  // Eğer token varsa
  if (token) {
    // İsteği (request) klonla ve 'Authorization' başlığını ekle
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Klonlanmış (token eklenmiş) isteği yola devam ettir
    return next(clonedRequest);
  }

  // Token yoksa, orijinal isteğe dokunmadan devam et
  return next(req);
};