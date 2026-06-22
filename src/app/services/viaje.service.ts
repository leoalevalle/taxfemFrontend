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
  private apiUrl = 'http://localhost:3000/api/viaje'
  //'https://taxfembackend-3.onrender.com/api/viaje';

  constructor(private http: HttpClient) {}

  // Acción de Operadora (CU-02 Pasos 6 a 13): Confirmar y registrar la asignación
  asignarViaje(datosAsignacion: AsignacionViajeInput): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignar`, datosAsignacion);
  }

  // Acción de Conductora - Aceptar Asignación
  aceptarViaje(idViaje: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/aceptar/${idViaje}`, {});
  }

  // Acción de Conductora - Rechazar Asignación
  rechazarViaje(idViaje: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rechazar/${idViaje}`, {});
  }

  getViajesActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Acción de Conductora - Finalizar Viaje
  finalizarViaje(idViaje: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/finalizar/${idViaje}`, {});
  }

  // Acción de Conductora - Cancelar Viaje en Curso
  cancelarViaje(idViaje: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cancelar/${idViaje}`, {});
  }
}