import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'page1',
    loadComponent: () => import('./page1/page1.page').then( m => m.Page1Page)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'workout',
    loadComponent: () => import('./workout/workout.page').then( m => m.WorkoutPage)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress/progress.page').then( m => m.ProgressPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then( m => m.ResetPasswordComponent)
  },
  {
    path: 'page1',
    loadComponent: () => import('./page1/page1.page').then( m => m.Page1Page)
  },
];
