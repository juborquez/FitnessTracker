import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController, ToastController } from '@ionic/angular/standalone';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationStack: string[] = [];
  private readonly MAX_STACK_SIZE = 10;

  constructor(
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private authService: AuthService,
    private location: Location
  ) {
    // Inicializar el stack de navegación con la página actual
    this.navigationStack.push(this.router.url);

    // Suscribirse a los cambios de ruta
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        this.addToNavigationStack(event.url);
      }
    });
  }

  /**
   * Navega a una nueva página con validaciones
   */
  async navigateTo(route: string, params?: NavigationExtras): Promise<boolean> {
    try {
      // Validar la ruta
      if (!await this.validateNavigation(route)) {
        return false;
      }

      // Validar el estado de autenticación si es necesario
      if (await this.requiresAuth(route) && !this.authService.isLoggedIn()) {
        await this.showAuthAlert();
        return false;
      }

      // Realizar la navegación
      if (params) {
        await this.router.navigate([route], params);
      } else {
        await this.router.navigate([route]);
      }

      return true;
    } catch (error) {
      console.error('Error en la navegación:', error);
      await this.showErrorToast();
      return false;
    }
  }

  /**
   * Navega hacia atrás en el historial
   */
  async goBack(): Promise<void> {
    if (this.canGoBack()) {
      this.location.back();
      this.navigationStack.pop();
    } else {
      await this.navigateTo('/home');
    }
  }

  /**
   * Verifica si se puede navegar hacia atrás
   */
  canGoBack(): boolean {
    return this.navigationStack.length > 1;
  }

  /**
   * Limpia el historial de navegación y navega a una ruta
   */
  async resetNavigationTo(route: string): Promise<void> {
    this.navigationStack = [route];
    await this.router.navigate([route], { replaceUrl: true });
  }

  /**
   * Valida si una navegación es permitida
   */
  private async validateNavigation(route: string): Promise<boolean> {
    // Validar formato de la ruta
    if (!route.startsWith('/')) {
      console.error('Formato de ruta inválido');
      return false;
    }

    // Validar rutas protegidas
    if (this.isProtectedRoute(route) && !this.authService.isLoggedIn()) {
      await this.showAuthAlert();
      return false;
    }

    // Validar estado de la aplicación
    if (!await this.isAppStateValid()) {
      await this.showErrorToast('La aplicación no está en un estado válido para navegar');
      return false;
    }

    return true;
  }

  /**
   * Verifica si una ruta requiere autenticación
   */
  private async requiresAuth(route: string): Promise<boolean> {
    const protectedRoutes = [
      '/workout',
      '/progress',
      '/profile',
      '/settings'
    ];
    return protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute));
  }

  /**
   * Verifica si una ruta está protegida
   */
  private isProtectedRoute(route: string): boolean {
    const publicRoutes = [
      '/login',
      '/register',
      '/reset-password',
      '/about',
      '/feriados'
    ];
    return !publicRoutes.some(publicRoute => route.startsWith(publicRoute));
  }

  /**
   * Verifica si el estado de la aplicación permite la navegación
   */
  private async isAppStateValid(): Promise<boolean> {
    // Implementar validaciones específicas de la aplicación
    return true;
  }

  /**
   * Agrega una ruta al stack de navegación
   */
  private addToNavigationStack(route: string): void {
    if (this.navigationStack.length >= this.MAX_STACK_SIZE) {
      this.navigationStack.shift();
    }
    this.navigationStack.push(route);
  }

  /**
   * Muestra una alerta de autenticación requerida
   */
  private async showAuthAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Autenticación Requerida',
      message: 'Por favor, inicia sesión para acceder a esta sección',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Iniciar Sesión',
          handler: () => {
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: this.router.url } 
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Muestra un toast de error
   */
  private async showErrorToast(message: string = 'Error en la navegación'): Promise<void> {
    const toast = await this.toastController.create({
      message,
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
}