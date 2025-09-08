import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private router: Router) {}

  navigateToWorkout() {
    this.router.navigate(['/workout']);
  }

  navigateToProgress() {
    this.router.navigate(['/progress']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
