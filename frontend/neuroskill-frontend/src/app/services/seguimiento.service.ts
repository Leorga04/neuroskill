import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService {
  private apiUrl = 'http://localhost:3000/api/seguimiento';

  constructor(private http: HttpClient) {}
  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(
      'http://localhost:3000/api/seguimiento/records'
    );
  }
  registrarResultado(data: {
    id_usuario: number;
    dificultad: number;
    puntuacion: number;
    nombre_usuario: string;
  }) {
    return this.http.post(this.apiUrl, data);
  }
}
