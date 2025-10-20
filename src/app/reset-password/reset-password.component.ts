import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonToast,
  AlertController,
  IonIcon
} from '@ionic/angular/standalone';

import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonToast,
    IonIcon
  ]
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  isToastOpen: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';
  isEmailSent: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Inicialización si es necesaria
  }

  async resetPassword() {
    if (!this.email.trim()) {
      this.showToast('Por favor, ingresa tu email', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email.trim())) {
      this.showToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    try {
      await this.apiService.post('auth/reset-password', { email: this.email.trim() });
      this.isEmailSent = true;
      this.showToast('Se ha enviado un enlace de restablecimiento a tu email', 'success');
    } catch (error) {
      this.showToast('Email no encontrado en el sistema', 'danger');
    }
  }

  showToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.isToastOpen = true;
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async showValidEmails() {
    const alert = await this.alertController.create({
      header: 'Emails de Prueba',
      message: `
        <strong>Emails válidos para testing:</strong><br>
        • admin@gym.com<br>
        • user@gym.com<br>
        • demo@gym.com<br>
        • test@example.com
      `,
      buttons: ['OK']
    });

    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  tryAgain() {
    this.isEmailSent = false;
    this.email = '';
  }
}
