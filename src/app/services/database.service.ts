import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.platform.ready().then(() => {
      this.initializeDatabase();
    });
  }

  // Inicializar la base de datos
  private async initializeDatabase() {
    try {
      const dbSetupDone = await this.sqlite.isConnection('fitness_tracker', false);
      if (dbSetupDone.result) {
        this.db = await this.sqlite.retrieveConnection('fitness_tracker', false);
      } else {
        this.db = await this.sqlite.createConnection(
          'fitness_tracker',
          false,
          'no-encryption',
          1,
          false
        );
      }
      await this.db.open();
      await this.createTables();
      this.dbReady.next(true);
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // Crear las tablas necesarias
  private async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER,
        calories INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        type TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER,
        name TEXT NOT NULL,
        sets INTEGER,
        reps INTEGER,
        weight REAL,
        notes TEXT,
        FOREIGN KEY(workout_id) REFERENCES workouts(id)
      )`,
      `CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        weight REAL,
        body_fat REAL,
        muscle_mass REAL,
        notes TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS feriados_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        nombre TEXT NOT NULL,
        tipo TEXT,
        irrenunciable INTEGER,
        comentarios TEXT,
        cache_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const sql of tables) {
      await this.db.run(sql, []);
    }
  }

  // Métodos CRUD genéricos
  // Crear índices para optimizar consultas
  private async createIndices() {
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id)',
      'CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_feriados_fecha ON feriados_cache(fecha)'
    ];

    for (const index of indices) {
      await this.db.run(index, []);
    }
  }

  // Método para ejecutar consultas SQL personalizadas
  async query(sql: string, params: any[] = []): Promise<any[]> {
    const result = await this.db.query(sql, params);
    return result.values || [];
  }

  // Métodos CRUD mejorados
  async insert(table: string, data: any): Promise<number> {
    const columns = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    
    const result = await this.db.run(sql, values);
    return result.changes?.lastId || 0;
  }

  async update(table: string, data: any, whereClause: string, whereArgs: any[]): Promise<number> {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(',');
    const values = [...Object.values(data), ...whereArgs];
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    
    const result = await this.db.run(sql, values);
    return result.changes?.changes || 0;
  }

  async delete(table: string, whereClause: string, whereArgs: any[]): Promise<number> {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.db.run(sql, whereArgs);
    return result.changes?.changes || 0;
  }

  // Métodos de gestión de base de datos
  isDatabaseReady(): Observable<boolean> {
    return this.dbReady.asObservable();
  }

  async clearTable(table: string): Promise<void> {
    await this.db.run(`DELETE FROM ${table}`, []);
  }

  async dropTable(table: string): Promise<void> {
    await this.db.run(`DROP TABLE IF EXISTS ${table}`, []);
  }

  async vacuum(): Promise<void> {
    await this.db.run('VACUUM', []);
  }

  // Método para realizar backup de la base de datos
  async backup(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      // TODO: Implementar backup usando el método apropiado
      console.log('Database backup to be implemented');
    }
  }
}