import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'; // 'inject' fonksiyonunu import ediyoruz
import { AuthService } from './auth.service'; // AuthService'imizi import ediyoruz

// Bu, Angular 17+ stilinde modern bir "Functional Guard" (Fonksiyonel Koruyucu)
export const authGuard: CanActivateFn = (route, state) => {

  // Gerekli servisleri 'inject' (enjekte) ediyoruz
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Kullanıcı giriş yapmış mı?
  if (authService.isLoggedIn()) {
    return true; // Evet, giriş yapmış. Yola devam etmesine izin ver.
  }

  // 2. Hayır, giriş yapmamış.
  // Onu /login sayfasına yönlendir ve bu yola girmesini engelle.
  return router.createUrlTree(['/login']);
};