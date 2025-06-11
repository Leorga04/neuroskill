import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = 'http://localhost:3000/api/usuarios'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, usuario); // ✅
  }
  loginUsuario(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
  
  
}
