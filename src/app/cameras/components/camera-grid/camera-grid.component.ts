import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CameraService } from '../../services/camera.service';
import { CameraFrameComponent } from '../camera-frame/camera-frame.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { SingleStream, StreamsResponse } from '../../models/streams.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-camera-grid',
  templateUrl: './camera-grid.component.html',
  styleUrls: ['./camera-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CameraFrameComponent],
})
export class CameraGridComponent implements OnInit {
  private cameraService = inject(CameraService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = takeUntilDestroyed();
  streams = signal<SingleStream[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit() {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.cameraService.getStreams().subscribe({
      next: (response) => {
        const typedResponse = response as StreamsResponse;
        this.isLoading.set(false);
        if (typedResponse.streams){
          this.streams.set(typedResponse.streams);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
        this.streams.set([]);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
