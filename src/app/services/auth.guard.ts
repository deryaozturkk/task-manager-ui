import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'; 
import { AuthService } from './auth.service'; 

export const authGuard: CanActivateFn = (route, state) => {

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