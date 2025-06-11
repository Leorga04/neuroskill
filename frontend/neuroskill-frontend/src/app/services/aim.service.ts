import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AimService {
  private apiUrl = 'http://localhost:3000/api/aim';

  constructor(private http: HttpClient) {}
  getRecords(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/aim/records');
  }

  registrarResultado(data: {
    id_usuario: number;
    puntuacion: number;
    nombre_usuario: string;
    dificultad: number;
  }) {
    return this.http.post(this.apiUrl, data);
  }
}
