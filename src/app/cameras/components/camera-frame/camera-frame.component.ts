import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SingleStream } from '../../models/streams.model';
import { CameraService } from '../../services/camera.service';
import { CameraSpinner } from "../camera-spinner/camera-spinner";

@Component({
  selector: 'app-camera-frame',
  templateUrl: './camera-frame.component.html',
  styleUrls: ['./camera-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, CameraSpinner],
})
export class CameraFrameComponent implements OnInit, OnDestroy {
  inputStream = input.required<SingleStream>();
  private cameraService = inject(CameraService);
  private refreshInterval: number | null = null;
  private isImageLoading: boolean = false;
  imageUrl = signal<string>('');
  isLoadingSpinner = signal(true);
  hasImageError = signal(false);

  ngOnInit() {
    this.updateImageUrl();
    this.refreshInterval = setInterval(() => {
      if (!this.isImageLoading) this.updateImageUrl();      
    }, 5000);
  }

  ngOnDestroy() {
    if (this.refreshInterval){
      clearInterval(this.refreshInterval);
    }    
  }

  private updateImageUrl() {
    // Added a timestamp to bypass browser cache for image refresh
    const timestamp = new Date().getTime();
    
    const imageUrl = this.cameraService.getCameraFrameUrl(this.inputStream().id);
    this.isImageLoading = true;

    this.hasImageError.set(false);
    this.imageUrl.set(`${imageUrl}&t=${timestamp}`);
  }

  onImageLoad() {
    this.isImageLoading = false;
    this.isLoadingSpinner.set(false);
    this.hasImageError.set(false);
  }

  onImageError() {
    this.isLoadingSpinner.set(false);
    this.hasImageError.set(true);
  }
}
