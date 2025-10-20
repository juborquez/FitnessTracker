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
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
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
    IonButtons,
    CommonModule, 
    FormsModule
  ]
})
export class WorkoutPage implements OnInit {
  exercises = [
    { name: 'Flexiones', sets: 3, reps: 15, completed: false },
    { name: 'Sentadillas', sets: 3, reps: 20, completed: false },
    { name: 'Plancha', sets: 3, reps: 30, completed: false },
    { name: 'Burpees', sets: 2, reps: 10, completed: false }
  ];

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }

  toggleExercise(index: number) {
    this.exercises[index].completed = !this.exercises[index].completed;
  }

  goToProgress() {
    this.router.navigate(['/progress']);
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
