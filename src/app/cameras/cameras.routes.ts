import { Routes } from '@angular/router';
import { CameraGridComponent } from './components/camera-grid/camera-grid.component';
import { authGuard } from '../auth/auth.guard';

export const CAMERAS_ROUTES: Routes = [
  {
    path: '',
    component: CameraGridComponent,
    canActivate: [authGuard]
  },
];
