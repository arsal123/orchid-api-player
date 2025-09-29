import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = 'https://orchid.ipconfigure.com';
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
      .post<{ id: string }>(`${this.BASE_URL}/service/sessions/user`, requestBody, {
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
