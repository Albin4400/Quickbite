import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, GuardResult, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('allows dashboard navigation only when the backend confirms the current admin role', async () => {
    storeSession('admin');
    const resultPromise = requestGuard();
    http.expectOne('http://localhost:5000/api/auth/me').flush({
      user: { id: 1, name: 'Kitchen admin', email: 'admin@example.test', role: 'admin', created_at: null }
    });

    expect(await resultPromise).toBe(true);
  });

  it('redirects a regular user to the customer foods page even on a direct admin URL', async () => {
    storeSession('user');
    const resultPromise = requestGuard();
    http.expectOne('http://localhost:5000/api/auth/me').flush({
      user: { id: 2, name: 'Customer', email: 'user@example.test', role: 'user', created_at: null }
    });

    const result = await resultPromise;
    if (!(result instanceof UrlTree)) {
      throw new Error('A regular user must be redirected away from the admin dashboard.');
    }
    expect(router.serializeUrl(result)).toBe('/foods');
  });

  function storeSession(role: 'user' | 'admin'): void {
    const payload = btoa(JSON.stringify({ role }));
    localStorage.setItem('quickbite_token', `header.${payload}.signature`);
    localStorage.setItem('quickbite_user', JSON.stringify({
      id: role === 'admin' ? 1 : 2,
      name: role === 'admin' ? 'Kitchen admin' : 'Customer',
      email: `${role}@example.test`,
      role
    }));
  }

  function requestGuard(): Promise<GuardResult> {
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, { url: '/admin' } as RouterStateSnapshot)
    );
    if (!(result instanceof Observable)) {
      throw new Error('Expected the admin guard to verify the current role through the backend.');
    }
    return firstValueFrom(result);
  }
});
