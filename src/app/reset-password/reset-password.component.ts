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
  IonIcon,
  IonButtons,
  IonToast,
  AlertController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
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
    IonIcon,
    IonButtons,
    IonToast,
    CommonModule, 
    FormsModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  isToastOpen: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';
  isEmailSent: boolean = false;

  // Emails válidos para simulación (sin BD)
  private validEmails = [
    'admin@gym.com',
    'user@gym.com', 
    'demo@gym.com',
    'test@example.com'
  ];

  constructor(
    private router: Router, 
    private location: Location, 
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  async resetPassword() {
    // Validación de campo vacío
    if (!this.email.trim()) {
      this.showToast('Por favor, ingresa tu email', 'warning');
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email.trim())) {
      this.showToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    // Verificar si el email existe en la lista de válidos
    const emailExists = this.validEmails.includes(this.email.trim().toLowerCase());

    if (emailExists) {
      this.isEmailSent = true;
      this.showToast('Se ha enviado un enlace de restablecimiento a tu email', 'success');
    } else {
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
