import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only attach JWT token to our backend API endpoints (e.g. localhost:5000 or relative /api)
  // Do NOT attach Authorization header to external third-party APIs (like TheMealDB)
  // because external APIs block unpermitted headers in CORS preflight!
  const isBackendRequest = req.url.includes('localhost:5000') || req.url.startsWith('/api');

  let modifiedReq = req;

  if (token && isBackendRequest) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Auto logout only if 401 Unauthorized occurs on our protected backend API calls
      if (isBackendRequest && error.status === 401 && !req.url.includes('/api/auth/login')) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};

