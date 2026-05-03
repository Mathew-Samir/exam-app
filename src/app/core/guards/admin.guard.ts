import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Guard to allow only admin users
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user?.role === 'admin') {
          return true;
        }
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    }
  }

  router.navigate(['/']); // Redirect to home if not admin
  return false;
};
