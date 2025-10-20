import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  /**
   * Maneja errores HTTP y muestra mensajes apropiados
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    switch (error.status) {
      case 404:
        this.router.navigate(['/404']);
        errorMessage = 'Recurso no encontrado';
        break;
      case 401:
        this.router.navigate(['/login']);
        errorMessage = 'No autorizado. Por favor, inicia sesión.';
        break;
      case 403:
        errorMessage = 'No tienes permiso para realizar esta acción';
        break;
      case 500:
        errorMessage = 'Error del servidor. Por favor, intenta más tarde';
        break;
      default:
        errorMessage = 'Ha ocurrido un error inesperado';
    }

    this.showErrorToast(errorMessage);
    return throwError(() => error);
  }

  /**
   * Muestra un toast con el mensaje de error
   */
  async showErrorToast(message: string) {
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

  /**
   * Maneja errores específicos de la aplicación
   */
  handleAppError(error: any, defaultMessage: string = 'Ha ocurrido un error') {
    const message = error?.message || defaultMessage;
    this.showErrorToast(message);
  }
}