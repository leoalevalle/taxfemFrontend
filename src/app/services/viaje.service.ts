import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AsignacionViajeInput {
  solicitudId: number;
  operadoraId: number;
  conductoraId: number;
  fecha: string;      // Formato "YYYY-MM-DD"
  horaInicio: string; // Formato ISOString
}

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private apiUrl = 'http://localhost:3000/api/viaje';

  constructor(private http: HttpClient) {}

  // Acción de Operadora (CU-02 Pasos 6 a 13): Confirmar y registrar la asignación
  asignarViaje(datosAsignacion: AsignacionViajeInput): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignar`, datosAsignacion);
  }
}