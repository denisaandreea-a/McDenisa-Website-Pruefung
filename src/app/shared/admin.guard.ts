import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/* ein Guard läuft bevor ne Route geöffnet wird. hier: nur wenn der Admin
   eingeloggt ist (true) darf die Seite geöffnet werden, sonst geb ich nen
   UrlTree zurück, das ist Angulars Art zu sagen "leite stattdessen da hin
   um" ohne dass man extra router.navigate(...) aufrufen muss */
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
