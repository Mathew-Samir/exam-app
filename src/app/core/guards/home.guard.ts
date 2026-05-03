import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Guard to redirect authenticated users away from auth pages (e.g., login, register)
 */
export const homeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      router.navigate(['/dashboard']); // Redirect to dashboard if already logged in
      return false;
    }
  }

  return true;
};
