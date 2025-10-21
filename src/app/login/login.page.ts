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
  IonSpinner,
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
    IonSpinner,
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  isToastOpen: boolean = false;
  toastMessage: string = '';
  isRegistering: boolean = false;
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
    console.log('LoginPage initialized');
    this.dbService.isDatabaseReady().subscribe(isReady => {
      console.log('Database ready status:', isReady);
    });
  }

  async login() {
    // Validación de campos vacíos
    if (!this.email.trim() || !this.password.trim()) {
      this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    try {
      // Intentar autenticar con el servicio
      await this.authService.login(this.email, this.password);

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

  async register() {
    this.isRegistering = true;
    try {
      const result = await this.authService.register({
        email: this.email,
        password: this.password,
        name: 'New User',
        role: 'user'
      }).toPromise();
      
      console.log('Registro exitoso:', result);
      this.toastMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
      this.isToastOpen = true;
    } catch (error) {
      console.error('Error en el registro:', error);
      this.toastMessage = 'Error en el registro. Por favor, intenta de nuevo.';
      this.isToastOpen = true;
    } finally {
      this.isRegistering = false;
    }
  }

}
