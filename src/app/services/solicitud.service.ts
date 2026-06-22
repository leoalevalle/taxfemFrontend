import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  private apiUrl = 'https://taxfembackend-3.onrender.com/api/solicitud';
                  //'http://localhost:3000/api/solicitud'
                  

  constructor(private http: HttpClient) {}

  // Acción de Pasajera: Registrar una intención de viaje
  registrarSolicitud(solicitud: { pasajeraId: number; origen: string; inicio: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, solicitud);
  }

  // Acción de Operadora (CU-02 Pasos 1 y 2): Traer solicitudes pendientes
  getSolicitudesPendientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pendientes`);
  }
}