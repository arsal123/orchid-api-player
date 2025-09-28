import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cameras',
    loadChildren: () => import('./cameras/cameras.routes').then(m => m.CAMERAS_ROUTES)
  },
];
