import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg
} from '@ionic/angular/standalone';
import { constructOutline, homeOutline, arrowBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-under-construction',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Página en Construcción</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-img src="assets/under-construction.svg" alt="En construcción"></ion-img>
        <ion-card-content class="ion-text-center">
          <h2>¡Página en Construcción!</h2>
          <p>Estamos trabajando para traerte nuevas funcionalidades. Disculpa las molestias.</p>
          
          <div class="ion-padding">
            <ion-button (click)="goBack()" fill="clear">
              <ion-icon slot="start" name="arrow-back-outline"></ion-icon>
              Volver
            </ion-button>
            <ion-button (click)="goHome()" fill="solid" color="primary">
              <ion-icon slot="start" name="home-outline"></ion-icon>
              Ir al Inicio
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    ion-img {
      max-width: 300px;
      margin: 2rem auto;
    }
    .ion-text-center {
      text-align: center;
    }
    h2 {
      color: var(--ion-color-primary);
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: var(--ion-color-medium);
      margin-bottom: 2rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg
  ]
})
export class UnderConstructionComponent {
  constructor(private router: Router) {
    addIcons({ constructOutline, homeOutline, arrowBackOutline });
  }

  goBack() {
    window.history.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}