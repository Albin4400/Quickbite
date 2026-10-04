import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard that allows navigation only for users with role 'admin'.
 * It reads the JWT stored by AuthService, decodes the payload, and checks the role claim.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  return authService.getCurrentUser().pipe(
    map(({ user }) => {
      authService.refreshCurrentUser(user);
      return authService.isAdmin() ? true : router.createUrlTree(['/foods']);
    }),
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.clearAuthData();
        return of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
      }
      return of(router.createUrlTree(['/foods']));
    })
  );
};
