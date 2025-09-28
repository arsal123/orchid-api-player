import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: any;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form and default states', () => {
    expect(component.form.get('user')?.value).toBe('');
    expect(component.form.get('pass')?.value).toBe('');
    expect(component.loginError()).toBe(false);
    expect(component.isLoading()).toBe(false);
  });

  it('should require user and pass fields', () => {
    const userControl = component.form.get('user');
    const passControl = component.form.get('pass');

    expect(userControl?.invalid).toBe(true);
    expect(passControl?.invalid).toBe(true);

    userControl?.setValue('testuser');
    passControl?.setValue('testpass');

    expect(userControl?.valid).toBe(true);
    expect(passControl?.valid).toBe(true);
  });

  it('should not call login service when form is invalid', () => {
    component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should successfully login and navigate to cameras', () => {
    authService.login.mockReturnValue(of({ id: 'test-session-id' }));
    
    component.form.patchValue({
      user: 'testuser',
      pass: 'testpass'
    });

    component.login();

    expect(authService.login).toHaveBeenCalledWith({
      user: 'testuser',
      pass: 'testpass'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/cameras']);
    expect(component.isLoading()).toBe(false);
    expect(component.loginError()).toBe(false);
  });

  it('should handle login error with custom message', () => {
    const errorResponse = {
      error: {
        reason: 'Custom error message'
      }
    };
    authService.login.mockReturnValue(throwError(() => errorResponse));
    
    component.form.patchValue({
      user: 'testuser',
      pass: 'wrongpass'
    });

    component.login();

    expect(component.isLoading()).toBe(false);
    expect(component.loginError()).toBe('Custom error message');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle login error with default message', () => {
    const errorResponse = {
      error: {}
    };
    authService.login.mockReturnValue(throwError(() => errorResponse));
    
    component.form.patchValue({
      user: 'testuser',
      pass: 'wrongpass'
    });

    component.login();

    expect(component.isLoading()).toBe(false);
    expect(component.loginError()).toBe('Invalid username or password');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});