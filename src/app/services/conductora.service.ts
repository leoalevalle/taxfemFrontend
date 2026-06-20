import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConductoraService {
  private apiUrl = 'http://localhost:3000/api/conductora';

  constructor(private http: HttpClient) {}

  // Acción de Operadora (CU-02 Pasos 3 a 5): Consultar disponibilidad
  getConductorasDisponibles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/disponibles`);
  }

  // Agregar a src/app/services/conductora.service.ts

  getViajesAsignados(conductoraId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${conductoraId}/viajes`);
  }
}