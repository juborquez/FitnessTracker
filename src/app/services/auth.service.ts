import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatabaseService } from './database.service';

interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser: User | null = null;

  constructor(private dbService: DatabaseService) {
    // Verificar si hay un token almacenado y es válido
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const userData = JSON.parse(atob(token));
        if (userData && userData.id && userData.email) {
          this.currentUser = userData;
          this.isAuthenticated.next(true);
          console.log('Sesión restaurada para:', userData.email);
        } else {
          console.log('Token inválido, limpiando...');
          this.logout();
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        this.logout();
      }
    }

    // Inicializar usuarios predeterminados cuando la base de datos esté lista
    this.dbService.isDatabaseReady().subscribe(async (isReady) => {
      if (isReady) {
        await this.initializeDefaultUsers();
      }
    });
  }

  register(user: User): Observable<any> {
    return new Observable(observer => {
      this.dbService.query('SELECT * FROM users WHERE email = ?', [user.email])
        .then(existingUsers => {
          if (existingUsers.length > 0) {
            observer.error('El email ya está registrado');
            return;
          }

          this.dbService.insert('users', user)
            .then(userId => {
              console.log('Usuario registrado:', userId);
              observer.next({ success: true, userId });
              observer.complete();
            })
            .catch(error => {
              console.error('Error al registrar:', error);
              observer.error(error);
            });
        })
        .catch(error => {
          console.error('Error al verificar email:', error);
          observer.error(error);
        });
    });
  }

  private async initializeDefaultUsers() {
    try {
      console.log('Verificando usuarios existentes...');
      // Verificar si ya existen usuarios
      const existingUsers = await this.dbService.query('SELECT * FROM users');
      console.log('Usuarios existentes:', existingUsers);
      
      if (existingUsers.length === 0) {
        console.log('No hay usuarios, creando usuarios predeterminados...');
        // Crear usuarios predeterminados
        const defaultUsers: User[] = [
          { email: 'admin@test.com', password: 'admin123', name: 'Administrator', role: 'admin' },
          { email: 'user@test.com', password: 'user123', name: 'Test User', role: 'user' }
        ];

        for (const user of defaultUsers) {
          console.log('Creando usuario:', user.email);
          await this.dbService.query(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [user.email, user.password, user.name, user.role]
          );
        }
        
        console.log('Usuarios predeterminados creados correctamente');
      }
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log('Intentando login con email:', email);
      // Buscar usuario en la base de datos
      const users = await this.dbService.query(
        'SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1',
        [email, password]
      );
      console.log('Resultados de búsqueda:', users);

      if (users.length > 0) {
        const user = users[0];
        console.log('Usuario encontrado:', user);
        this.currentUser = user;
        localStorage.setItem('userToken', btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role })));
        this.isAuthenticated.next(true);
        return true;
      } else {
        console.log('No se encontró ningún usuario con esas credenciales');
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('userToken');
    this.currentUser = null;
    this.isAuthenticated.next(false);
    console.log('Sesión cerrada');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getAuthToken(): string | null {
    return localStorage.getItem('userToken');
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (token) {
      try {
        const userData = JSON.parse(atob(token));
        return [userData.role];
      } catch (error) {
        console.error('Error parsing user roles:', error);
        return [];
      }
    }
    return [];
  }

  getToken(): string | null {
    return this.getAuthToken();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}