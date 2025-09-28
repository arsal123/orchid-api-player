import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = takeUntilDestroyed(); 
  loginError = signal<boolean | string>(false);

  form = this.fb.group({
    user: ['', [Validators.required]],
    pass: ['', [Validators.required]],
  });

  login() {
    if (this.form.valid) {
      this.loginError.set(false);
      const { user, pass } = this.form.getRawValue();
      this.authService.login({ user: user!, pass: pass! })
        .pipe(this.destroyRef)
        .subscribe({
          next: () => {
            this.loginError.set(false);
            this.router.navigate(['/cameras']);
          },
          error: (err: any) => {
            if (err.error.reason && typeof err.error.reason === 'string') {
              this.loginError.set(err.error.reason);
            } else {
              this.loginError.set('Invalid username or password');
            }
            console.log('Error in login:', err);
          },
        });
    }
  }
}
