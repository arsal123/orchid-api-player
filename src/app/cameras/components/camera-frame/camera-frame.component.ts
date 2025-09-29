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
  imageUrl = signal<string>('');
  isImageLoading = signal(true);
  hasImageError = signal(false);

  ngOnInit() {
    console.log('CameraFrameComponent initialized with stream:', this.inputStream());
    this.updateImageUrl();
    this.refreshInterval = setInterval(() => this.updateImageUrl(), 5000);
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
    
    // this.isImageLoading.set(true);
    this.hasImageError.set(false);
    this.imageUrl.set(`${imageUrl}&t=${timestamp}`);
  }

  onImageLoad() {
    this.isImageLoading.set(false);
    this.hasImageError.set(false);
  }

  onImageError() {
    this.isImageLoading.set(false);
    this.hasImageError.set(true);
  }
}
