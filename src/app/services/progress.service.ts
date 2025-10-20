import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Progress {
  id?: number;
  user_id: number;
  date: string;
  weight?: number;
  body_fat?: number;
  muscle_mass?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progress = new BehaviorSubject<Progress[]>([]);

  constructor(private db: DatabaseService) {
    this.loadProgress();
  }

  private async loadProgress() {
    try {
      const progress = await this.db.query(
        'SELECT * FROM progress ORDER BY date DESC',
        []
      );
      this.progress.next(progress);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  getProgress(): Observable<Progress[]> {
    return this.progress.asObservable();
  }

  async addProgress(progress: Progress): Promise<number> {
    try {
      const id = await this.db.insert('progress', progress);
      await this.loadProgress();
      return id;
    } catch (error) {
      console.error('Error adding progress:', error);
      throw error;
    }
  }

  async updateProgress(id: number, progress: Progress): Promise<void> {
    try {
      await this.db.update('progress', progress, 'id = ?', [id]);
      await this.loadProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  async deleteProgress(id: number): Promise<void> {
    try {
      await this.db.delete('progress', 'id = ?', [id]);
      await this.loadProgress();
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  }

  // Métodos de análisis y estadísticas
  async getProgressStats(userId: number): Promise<any> {
    const stats = await this.db.query(`
      SELECT 
        AVG(weight) as avg_weight,
        MIN(weight) as min_weight,
        MAX(weight) as max_weight,
        AVG(body_fat) as avg_body_fat,
        AVG(muscle_mass) as avg_muscle_mass
      FROM progress 
      WHERE user_id = ?
    `, [userId]);
    return stats[0];
  }

  async getWeightTrend(userId: number, months: number = 3): Promise<any[]> {
    return this.db.query(`
      SELECT date, weight
      FROM progress
      WHERE user_id = ? 
        AND date >= date('now', '-${months} months')
      ORDER BY date ASC
    `, [userId]);
  }

  async getBodyCompositionTrend(userId: number, months: number = 3): Promise<any[]> {
    return this.db.query(`
      SELECT date, body_fat, muscle_mass
      FROM progress
      WHERE user_id = ? 
        AND date >= date('now', '-${months} months')
      ORDER BY date ASC
    `, [userId]);
  }

  async getLatestProgress(userId: number): Promise<Progress | null> {
    const results = await this.db.query(`
      SELECT *
      FROM progress
      WHERE user_id = ?
      ORDER BY date DESC
      LIMIT 1
    `, [userId]);
    return results.length > 0 ? results[0] : null;
  }

  // Método para calcular cambios
  async calculateChanges(userId: number, days: number = 30): Promise<any> {
    const results = await this.db.query(`
      SELECT 
        (SELECT weight FROM progress 
         WHERE user_id = ? AND weight IS NOT NULL 
         ORDER BY date DESC LIMIT 1) - 
        (SELECT weight FROM progress 
         WHERE user_id = ? AND weight IS NOT NULL 
         AND date <= date('now', '-${days} days')
         ORDER BY date DESC LIMIT 1) as weight_change,
        
        (SELECT body_fat FROM progress 
         WHERE user_id = ? AND body_fat IS NOT NULL 
         ORDER BY date DESC LIMIT 1) -
        (SELECT body_fat FROM progress 
         WHERE user_id = ? AND body_fat IS NOT NULL 
         AND date <= date('now', '-${days} days')
         ORDER BY date DESC LIMIT 1) as fat_change,
        
        (SELECT muscle_mass FROM progress 
         WHERE user_id = ? AND muscle_mass IS NOT NULL 
         ORDER BY date DESC LIMIT 1) -
        (SELECT muscle_mass FROM progress 
         WHERE user_id = ? AND muscle_mass IS NOT NULL 
         AND date <= date('now', '-${days} days')
         ORDER BY date DESC LIMIT 1) as muscle_change
    `, [userId, userId, userId, userId, userId, userId]);
    return results[0];
  }
}