import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    // Verificar si hay un token almacenado
    const token = localStorage.getItem('userToken');
    if (token) {
      this.isAuthenticated.next(true);
    }
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Simular llamada al API
      if (username && password) {
        localStorage.setItem('userToken', 'dummy-token');
        this.isAuthenticated.next(true);
        resolve(true);
      } else {
        reject('Credenciales inválidas');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('userToken');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getAuthToken(): string | null {
    return localStorage.getItem('userToken');
  }

  getUserRoles(): string[] {
    // Por ahora retornamos un rol por defecto
    // TODO: Implementar roles reales desde el backend
    return ['user'];
  }

  getToken(): string | null {
    return this.getAuthToken();
  }
}