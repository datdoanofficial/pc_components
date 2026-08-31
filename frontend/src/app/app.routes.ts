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
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.component').then((m) => m.HelpComponent),
  },
];
