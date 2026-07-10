import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerAuthService } from './customer-auth.service';

/* genau wie adminGuard, nur für Kunden. Unterschied: hier muss ich async/await
   benutzen weil Firebase erst im Hintergrund prüfen muss ob schon jemand
   eingeloggt ist (dauert kurz, kommt nicht sofort zurück). auth.ready wartet
   genau darauf. klappt das nicht (z.b kein Netz) schick ich die Person einfach zur Konto-Seite */
export const customerGuard: CanActivateFn = async () => {
  const auth = inject(CustomerAuthService);
  const router = inject(Router);

  try {
    await auth.ready;
  } catch {
    return router.createUrlTree(['/konto']);
  }

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/konto']);
};
