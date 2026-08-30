import { Routes } from '@angular/router';
import { SiteLayoutComponent } from './shared/components/site-layout/site-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
];
