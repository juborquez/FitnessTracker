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
  IonCardHeader, 
  IonCardTitle,
  IonItem, 
  IonLabel, 
  IonButton,
  IonIcon,
  IonList,
  IonBadge,
  IonProgressBar,
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle,
    IonItem, 
    IonLabel, 
    IonButton,
    IonList,
    IonBadge,
    IonProgressBar,
    IonButtons,
    CommonModule, 
    FormsModule
  ]
})
export class ProgressPage implements OnInit {
  Math = Math;
  
  weeklyProgress = [
    { day: 'Lunes', completed: 4, total: 4, percentage: 100 },
    { day: 'Martes', completed: 2, total: 4, percentage: 50 },
    { day: 'Miércoles', completed: 4, total: 4, percentage: 100 },
    { day: 'Jueves', completed: 1, total: 4, percentage: 25 },
    { day: 'Viernes', completed: 3, total: 4, percentage: 75 },
    { day: 'Sábado', completed: 0, total: 4, percentage: 0 },
    { day: 'Domingo', completed: 0, total: 4, percentage: 0 }
  ];

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }

  getOverallProgress(): number {
    const totalCompleted = this.weeklyProgress.reduce((sum, day) => sum + day.completed, 0);
    const totalExercises = this.weeklyProgress.reduce((sum, day) => sum + day.total, 0);
    return totalExercises > 0 ? totalCompleted / totalExercises : 0;
  }

  goToWorkout() {
    this.router.navigate(['/workout']);
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
