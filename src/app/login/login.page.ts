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
  AlertController
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonButtons,
    IonToast,
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  isToastOpen: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';

  // Usuarios válidos para validación simple (sin BD)
  private validUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' },
    { username: 'demo', password: 'demo123' }
  ];

  constructor(
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private authService: AuthService,
    private dbService: DatabaseService
  ) { }

  ngOnInit() {
  }

  async login() {
    // Validación de campos vacíos
    if (!this.username.trim() || !this.password.trim()) {
      this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    try {
      // Intentar autenticar con el servicio
      await this.authService.login(this.username, this.password);
      
      // Guardar información en la base de datos local
      await this.dbService.insert('users', {
        email: this.username,
        name: this.username // Por simplicidad usamos el email como nombre
      });

      this.showToast('¡Inicio de sesión exitoso!', 'success');
      
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } catch (error) {
      this.showToast('Usuario o contraseña incorrectos', 'danger');
      this.password = ''; // Limpiar contraseña por seguridad
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

  async showValidUsers() {
    const alert = await this.alertController.create({
      header: 'Usuarios de Prueba',
      message: `
        <strong>Usuarios válidos:</strong><br>
        • admin / admin123<br>
        • user / user123<br>
        • demo / demo123
      `,
      buttons: ['OK']
    });

    await alert.present();
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
