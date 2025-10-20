import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { Observable, map, take } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
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
        if (isLoggedIn) {
          await this.showAlreadyAuthMessage();
          // Verificar si hay una URL de retorno almacenada
          const returnUrl = localStorage.getItem('returnUrl');
          if (returnUrl) {
            localStorage.removeItem('returnUrl');
            await this.navigationService.navigateTo(returnUrl);
          } else {
            await this.navigationService.navigateTo('/home');
          }
          resolve(false);
          return;
        }

        // Almacenar la URL actual para redireccionar después del login
        if (state.url !== '/login') {
          localStorage.setItem('returnUrl', state.url);
        }

        resolve(true);
      });
    });
  }

  private async showAlreadyAuthMessage() {
    const toast = await this.toastController.create({
      message: 'Ya has iniciado sesión',
      duration: 2000,
      position: 'bottom',
      color: 'primary',
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