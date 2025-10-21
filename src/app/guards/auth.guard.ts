import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { Observable, map, take } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService,
    private toastController: ToastController
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.authService.isLoggedIn().pipe(take(1)).subscribe(async (isLoggedIn: boolean) => {
        // Verificar autenticación
        if (!isLoggedIn) {
          await this.showAuthError();
          await this.navigationService.navigateTo('/login', { 
            queryParams: { returnUrl: state.url }
          });
          resolve(false);
          return;
        }

        // Verificar roles si están especificados en la ruta
        if (route.data['roles'] && !this.checkRoles(route.data['roles'])) {
          await this.showUnauthorizedError();
          await this.navigationService.navigateTo('/home');
          resolve(false);
          return;
        }

        // Verificar estado de la sesión
        if (!await this.checkSessionValid()) {
          await this.handleInvalidSession();
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  private async showAuthError() {
    const toast = await this.toastController.create({
      message: 'Por favor, inicia sesión para acceder a esta página',
      duration: 3000,
      position: 'bottom',
      color: 'warning',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  private async showUnauthorizedError() {
    const toast = await this.toastController.create({
      message: 'No tienes permisos para acceder a esta página',
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  private checkRoles(requiredRoles: string[]): boolean {
    const userRoles = this.authService.getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }

  private async checkSessionValid(): Promise<boolean> {
    const token = this.authService.getToken();
    if (!token) {
      console.log('No hay token de sesión');
      return false;
    }

    try {
      const userData = JSON.parse(atob(token));
      if (!userData || !userData.id || !userData.email) {
        console.log('Token inválido o incompleto');
        return false;
      }
      
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.log('No hay usuario actual en el servicio de auth');
        return false;
      }

      console.log('Sesión válida para:', userData.email);
      return true;
    } catch (error) {
      console.error('Error validando sesión:', error);
      return false;
    }
  }

  private async handleExpiredToken() {
    await this.showSessionExpiredError();
    this.authService.logout();
    await this.navigationService.resetNavigationTo('/login');
  }

  private async handleInvalidSession() {
    this.authService.logout();
    await this.navigationService.resetNavigationTo('/login');
  }

  private async showSessionExpiredError() {
    const toast = await this.toastController.create({
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      duration: 3000,
      position: 'bottom',
      color: 'warning',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}