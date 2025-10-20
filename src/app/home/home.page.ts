import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonButtons } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonButtons],
  standalone: true,
})
export class HomePage implements OnInit {
  userData: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dbService: DatabaseService
  ) {}

  async ngOnInit() {
    try {
      // Obtener datos del usuario desde la base de datos local
      const users = await this.dbService.select('users', '', []);
      if (users.length > 0) {
        this.userData = users[0];
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  navigateToWorkout() {
    this.router.navigate(['/workout']);
  }

  navigateToProgress() {
    this.router.navigate(['/progress']);
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
