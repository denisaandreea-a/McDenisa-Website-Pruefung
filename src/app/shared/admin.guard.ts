import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (sessionStorage.getItem('isAdmin') === 'true') {
    return true;
  }
  return router.createUrlTree(['/login']);
};
