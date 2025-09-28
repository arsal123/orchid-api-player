import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './services/auth.service';

describe('authGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    const authServiceMock = {
      sessionId: jest.fn()
    };

    const routerMock = {
      parseUrl: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should allow access when user is authenticated', () => {
    authService.sessionId.mockReturnValue('test-session-id');

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(result).toBe(true);
    expect(router.parseUrl).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockUrlTree = { toString: () => '/login' };
    authService.sessionId.mockReturnValue(null);
    router.parseUrl.mockReturnValue(mockUrlTree as any);

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(result).toBe(mockUrlTree);
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });
});