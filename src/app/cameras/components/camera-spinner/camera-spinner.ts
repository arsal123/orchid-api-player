import { Component, input } from '@angular/core';

@Component({
  selector: 'app-camera-spinner',
  imports: [],
  templateUrl: './camera-spinner.html',
  styleUrl: './camera-spinner.scss'
})
export class CameraSpinner {
  displayText = input('Loading ...');
}
