import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { ViajeService } from '../../services/viaje.service'

@Component({
  selector: 'app-pasajera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pasajera.html',
  styleUrl: './pasajera.css',
})
export class Pasajera implements OnInit {
  // Datos del Formulario
  origen: string = '';
  inicio: string = ''; // Destino

  // Simulación de sesión
  idPasajeraSeleccionada: number = 2; // Por defecto Laura Benítez
  pasajerasDePrueba = [
    { id: 2, nombre: 'Laura Benítez' },
    { id: 3, nombre: 'Sofía Rodríguez' }
  ];

  // Estados de la interfaz
  pestanaActiva: string = 'solicitar'; // Controla las vistas
  viajeActual: any = null;              // Aloja la respuesta de la conductora asignada
  mensajeExito: string = '';
  errorMsg: string = '';
  cargando: boolean = false;

  constructor(
    private solicitudService: SolicitudService,
    private viajeService: ViajeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.consultarEstadoViaje();
  }

  // Enviar solicitud (Mapeado a + registrarViaje() del UML)
  enviarSolicitud() {
    this.mensajeExito = '';
    this.errorMsg = '';

    if (!this.origen.trim() || !this.inicio.trim()) {
      this.errorMsg = 'Por favor, completa los campos de Origen y Destino.';
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    const nuevaSolicitud = {
      pasajeraId: Number(this.idPasajeraSeleccionada),
      origen: this.origen,
      inicio: this.inicio
    };

    this.solicitudService.registrarSolicitud(nuevaSolicitud).subscribe({
      next: (res) => {
        this.mensajeExito = `¡Solicitud enviada con éxito! Tu viaje quedó en revisión.`;
        this.origen = '';
        this.inicio = '';
        this.cargando = false;
        
        // Saltamos automáticamente a "Mi Viaje" para ver el monitoreo en tiempo real
        this.pestanaActiva = 'miviaje';
        this.consultarEstadoViaje();
      },
      error: (err) => {
        this.errorMsg = err.error?.msg || 'Ocurrió un error al registrar el viaje.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Consulta el estado en la base de datos para recibir la notificación
 consultarEstadoViaje() {
  this.mensajeExito = '';
  this.errorMsg = '';

  // 1. Validamos primero si la solicitud sigue en la lista general de pendientes
  this.solicitudService.getSolicitudesPendientes().subscribe({
    next: (solicitudes: any[]) => {
      const miSolicitudPendiente = solicitudes.find(s => Number(s.pasajeraId) === Number(this.idPasajeraSeleccionada));
      
      if (miSolicitudPendiente) {
        // Si la operadora no la asignó, pantalla de carga limpia "Buscando conductora..."
        this.viajeActual = null;
        this.cdr.detectChanges();
      } else {
        // 2. Si ya no está pendiente, traemos la lista de viajes del back
        this.viajeService.getViajesActivos().subscribe({
          next: (listaViajes: any[]) => {
            // FILTRO DE SEGURIDAD: Buscamos el viaje más reciente que esté EN CURSO para esta pasajera
            const miViajeReal = listaViajes
              .filter(v => Number(v.solicitud?.pasajeraId) === Number(this.idPasajeraSeleccionada))
              .find(v => v.estadoDeViaje === 'encurso'); // Ignora automáticamente los 'finalizados' viejos

            if (miViajeReal) {
              this.viajeActual = {
                idViaje: miViajeReal.idViaje,
                origen: miViajeReal.solicitud.origen,
                inicio: miViajeReal.solicitud.inicio,
                estadoDeViaje: miViajeReal.estadoDeViaje,
                
                // Mapeo 100% dinámico de la base de datos
                conductora: {
                  nombre: miViajeReal.conductora?.nombre || 'Conductora Asignada',
                  vehiculo: 'Toyota Etios 2023', 
                  matricula: miViajeReal.conductora?.matricula || 'S/D'
                }
              };
            } else {
              // Si no hay ningún viaje en curso activo, no muestra datos residuales
              this.viajeActual = null;
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error("Error al obtener viajes activos:", err);
            this.viajeActual = null;
            this.cdr.detectChanges();
          }
        });
      }
    },
    error: (err) => {
      console.error("Error al obtener solicitudes pendientes:", err);
      this.viajeActual = null;
      this.cdr.detectChanges();
    }
  });
  }

  cancelarViajeClick() {
    if (confirm('¿Estás segura de que deseas cancelar tu viaje en curso?')) {
      this.viajeActual = null;
      this.pestanaActiva = 'solicitar';
      this.mensajeExito = 'El viaje ha sido cancelado por la pasajera.';
      this.cdr.detectChanges();
    }
  }
}