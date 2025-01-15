import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Ensure localStorage is available
  if (typeof window === 'undefined' || !localStorage) {
    router.navigate(['/login']);
    return false;
  }

  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirect to login route
    return false; // Block access
  }

  return true; // Allow access if authenticated
};
