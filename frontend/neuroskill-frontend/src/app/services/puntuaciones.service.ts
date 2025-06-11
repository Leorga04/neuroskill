import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionesService {
  private apiUrl = 'http://localhost:3000/api/puntuaciones';

  constructor(private http: HttpClient) {}

  // 👉 Registrar nueva puntuación
  registrarPuntuacion(data: {
  id_usuario: number;
  minijuego: string; // << aquí está el cambio
  puntuacion: number;
}) {
  return this.http.post('http://localhost:3000/api/puntuaciones', data);
}

  // 👉 Obtener puntuaciones de un usuario
  obtenerPuntuacionesDeUsuario(id_usuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${id_usuario}`);
  }
}
