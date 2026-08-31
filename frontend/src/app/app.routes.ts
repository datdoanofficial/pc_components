import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'store',
    loadComponent: () => import('./pages/store/store.component').then((m) => m.StoreComponent),
  },
];
