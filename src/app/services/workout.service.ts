import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Workout {
  id?: number;
  user_id: number;
  name: string;
  description?: string;
  duration?: number;
  calories?: number;
  date: string;
  type: string;
}

export interface Exercise {
  id?: number;
  workout_id: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workouts = new BehaviorSubject<Workout[]>([]);

  constructor(private db: DatabaseService) {
    this.loadWorkouts();
  }

  private async loadWorkouts() {
    try {
      const workouts = await this.db.query(
        'SELECT * FROM workouts ORDER BY date DESC',
        []
      );
      this.workouts.next(workouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  }

  getWorkouts(): Observable<Workout[]> {
    return this.workouts.asObservable();
  }

  async addWorkout(workout: Workout): Promise<number> {
    try {
      const id = await this.db.insert('workouts', workout);
      await this.loadWorkouts();
      return id;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  }

  async updateWorkout(id: number, workout: Workout): Promise<void> {
    try {
      await this.db.update('workouts', workout, 'id = ?', [id]);
      await this.loadWorkouts();
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }

  async deleteWorkout(id: number): Promise<void> {
    try {
      await this.db.delete('workouts', 'id = ?', [id]);
      // También eliminar ejercicios asociados
      await this.db.delete('exercises', 'workout_id = ?', [id]);
      await this.loadWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }

  // Métodos para ejercicios
  async getExercises(workoutId: number): Promise<Exercise[]> {
    return this.db.query(
      'SELECT * FROM exercises WHERE workout_id = ? ORDER BY id',
      [workoutId]
    );
  }

  async addExercise(exercise: Exercise): Promise<number> {
    return this.db.insert('exercises', exercise);
  }

  async updateExercise(id: number, exercise: Exercise): Promise<void> {
    await this.db.update('exercises', exercise, 'id = ?', [id]);
  }

  async deleteExercise(id: number): Promise<void> {
    await this.db.delete('exercises', 'id = ?', [id]);
  }

  // Métodos de estadísticas
  async getWorkoutStats(userId: number): Promise<any> {
    const stats = await this.db.query(`
      SELECT 
        COUNT(*) as total_workouts,
        SUM(duration) as total_duration,
        SUM(calories) as total_calories,
        AVG(duration) as avg_duration
      FROM workouts 
      WHERE user_id = ?
    `, [userId]);
    return stats[0];
  }

  async getWorkoutsByType(userId: number): Promise<any[]> {
    return this.db.query(`
      SELECT type, COUNT(*) as count
      FROM workouts
      WHERE user_id = ?
      GROUP BY type
    `, [userId]);
  }

  async getRecentWorkouts(userId: number, limit: number = 5): Promise<Workout[]> {
    return this.db.query(`
      SELECT *
      FROM workouts
      WHERE user_id = ?
      ORDER BY date DESC
      LIMIT ?
    `, [userId, limit]);
  }
}