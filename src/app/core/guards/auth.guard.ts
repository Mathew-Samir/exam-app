import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Guard to allow only authenticated users
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    router.navigate(['/auth/login']);
    return false;
  }

  // On the server, we allow the route to load to avoid flickering.
  // The client-side hydration will handle the actual check.
  return true;
};
