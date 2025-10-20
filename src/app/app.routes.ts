import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'feriados',
    loadComponent: () => import('./components/feriados.component').then(m => m.FeriadosComponent),
    title: 'Feriados Chile'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
    title: 'Inicio'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
    canActivate: [NoAuthGuard],
    title: 'Iniciar Sesión'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [NoAuthGuard],
    title: 'Restablecer Contraseña'
  },
  {
    path: 'workout',
    loadComponent: () => import('./workout/workout.page').then(m => m.WorkoutPage),
    canActivate: [AuthGuard],
    title: 'Entrenamiento'
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress/progress.page').then(m => m.ProgressPage),
    canActivate: [AuthGuard],
    title: 'Progreso'
  },
  {
    path: '404',
    loadComponent: () => import('./pages/under-construction/under-construction.component')
      .then(m => m.UnderConstructionComponent),
    title: 'Página en Construcción'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
