import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { API_BASE_URL } from '../../app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _sessionId = signal<string | null>(null);
  readonly sessionId = this._sessionId.asReadonly();
  private headers = { 'Content-Type': 'application/json' };
  private destroyRef = inject(DestroyRef);

  login(credentials: { user: string; pass: string }) {
    const requestBody = {
      username: credentials.user,
      password: credentials.pass,
    };

    return this.http
      .post<{ id: string }>(`${API_BASE_URL}/service/sessions/user`, requestBody, {
        headers: this.headers,
      })
      .pipe(
        tap(({ id }) => {
          this._sessionId.set(id);
          console.log('Logged in with session ID:', id);
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  logout() {
    this._sessionId.set(null);
  }
}
