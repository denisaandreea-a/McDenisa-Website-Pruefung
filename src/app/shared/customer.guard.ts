import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerAuthService } from './customer-auth.service';

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
