import { inject, Injectable, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { API_BASE_URL } from '../../app.constants';
import { StreamsResponse } from '../models/streams.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  getStreams(): Observable<StreamsResponse> {
    const sessionId = this.authService.sessionId();
    return this.http
      .get<StreamsResponse>(`${API_BASE_URL}/service/streams?sid=${sessionId}&live=primary`)
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  getCameraFrameUrl(streamId: number): string {
    const sessionId = this.authService.sessionId();
    if (!sessionId) {
      throw new Error('Not authenticated');
    }
    return `${API_BASE_URL}/service/streams/${streamId}/frame?sid=${sessionId}`;
  }
}
