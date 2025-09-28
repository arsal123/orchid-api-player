import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CameraService } from '../../services/camera.service';
import { CameraItemComponent } from '../camera-item/camera-item.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { SingleStream, StreamsResponse } from '../../models/streams.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-camera-grid',
  templateUrl: './camera-grid.component.html',
  styleUrls: ['./camera-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CameraItemComponent],
})
export class CameraGridComponent implements OnInit {
  private cameraService = inject(CameraService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = takeUntilDestroyed()
  streams = signal<SingleStream[]>([])

  ngOnInit() {
    this.cameraService.getStreams().pipe(this.destroyRef).subscribe({
      next: (response) => {
        const typedResponse = response as StreamsResponse;
        if (typedResponse.streams){
          this.streams.set(typedResponse.streams);
        }
      },
      error: () => this.streams.set([])
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
