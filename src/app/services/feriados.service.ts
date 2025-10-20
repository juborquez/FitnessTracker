import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ErrorHandlingService } from './error-handling.service';

export interface Feriado {
  nombre: string;
  comentarios: string;
  fecha: string;
  irrenunciable: boolean;
  tipo: string;
  leyes: Array<{
    nombre: string;
    url: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class FeriadosService {
  private readonly API_URL = 'https://api.victorsanmartin.com/feriados';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) { }

  /**
   * Obtiene todos los feriados del año actual
   */
  getFeriados(): Observable<Feriado[]> {
    return this.http.get<Feriado[]>(`${this.API_URL}/chile`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  /**
   * Obtiene los feriados de un año específico
   * @param year Año para consultar los feriados
   */
  getFeriadosByYear(year: number): Observable<Feriado[]> {
    return this.http.get<Feriado[]>(`${this.API_URL}/chile/${year}`).pipe(
      catchError(this.handleError<Feriado[]>(`getFeriadosByYear year=${year}`, []))
    );
  }

  /**
   * Obtiene los próximos feriados desde la fecha actual
   * @param limit Número de feriados a retornar
   */
  getProximosFeriados(limit: number = 5): Observable<Feriado[]> {
    return this.getFeriados().pipe(
      map(feriados => {
        const today = new Date();
        return feriados
          .filter(feriado => new Date(feriado.fecha) >= today)
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(0, limit);
      })
    );
  }

  /**
   * Verifica si una fecha específica es feriado
   * @param fecha Fecha a verificar en formato YYYY-MM-DD
   */
  isFeriado(fecha: string): Observable<boolean> {
    return this.getFeriados().pipe(
      map(feriados => feriados.some(feriado => feriado.fecha === fecha))
    );
  }

  /**
   * Obtiene los feriados por tipo
   * @param tipo Tipo de feriado ('Civil', 'Religioso', etc.)
   */
  getFeriadosByTipo(tipo: string): Observable<Feriado[]> {
    return this.getFeriados().pipe(
      map(feriados => feriados.filter(feriado => feriado.tipo === tipo))
    );
  }

  /**
   * Obtiene los feriados irrenunciables
   */
  getFeriadosIrrenunciables(): Observable<Feriado[]> {
    return this.getFeriados().pipe(
      map(feriados => feriados.filter(feriado => feriado.irrenunciable))
    );
  }

  /**
   * Maneja los errores de las llamadas HTTP
   * @param operation Nombre de la operación que falló
   * @param result Valor opcional a retornar como resultado
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Registrar el error en un servicio de registro
      console.error(error);
      // Retornar un resultado vacío/default para mantener la aplicación funcionando
      return of(result as T);
    };
  }
}