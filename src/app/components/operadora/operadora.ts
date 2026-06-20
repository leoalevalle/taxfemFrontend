import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { ConductoraService } from '../../services/conductora.service';
import { ViajeService } from '../../services/viaje.service';

@Component({
  selector: 'app-operadora',
  imports: [CommonModule, FormsModule],
  templateUrl: './operadora.html',
  styleUrl: './operadora.css',
})
export class Operadora implements OnInit {
  // Datos del Sistema
  solicitudesPendientes: any[] = [];
  conductorasDisponibles: any[] = [];

  // Estados de la interfaz (CU-02)
  solicitudSeleccionada: any = null;
  conductoraSeleccionada: any = null;
  mostrarConfirmacion: boolean = false;
  mensajeExito: string = '';
  errorMsg: string = '';

  // Simulamos que la operadora logueada tiene el ID 1 (Precondición: CU-01)
  idOperadoraLogueada: number = 1;

  constructor(
    private solicitudService: SolicitudService,
    private conductoraService: ConductoraService,
    private viajeService: ViajeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  // Paso 1 y 2: Buscar y listar solicitudes pendientes
  cargarSolicitudes() {
    this.solicitudService.getSolicitudesPendientes().subscribe({
      next: (res) => {
        this.solicitudesPendientes = res;
        this.cdr.detectChanges();
      },
      error: (err) => { // 🛠️ CORREGIDO: Se envolvieron las acciones en llaves
        this.errorMsg = 'Error al cargar solicitudes.';
        this.cdr.detectChanges();
      }
    });
  }

  // Paso 1: Seleccionar una solicitud de la lista
  seleccionarSolicitud(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.conductorasDisponibles = [];
    this.conductoraSeleccionada = null;
    this.mostrarConfirmacion = false;
    this.mensajeExito = '';
    this.cdr.detectChanges(); // Fuerza refresco al cambiar de seleccionada
  }

  // Paso 3, 4 y 5: Buscar y mostrar conductoras disponibles
  consultarDisponibilidad() {
    this.errorMsg = '';
    this.conductoraService.getConductorasDisponibles().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.conductorasDisponibles = res.data;
          this.cdr.detectChanges();
        } else {
          // Flujo Alternativo (4): No hay conductoras disponibles
          this.errorMsg = 'Flujo Alternativo: No hay conductoras disponibles en este momento.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => { // CORREGIDO: Se envolvieron las acciones en llaves
        this.errorMsg = 'Error al consultar disponibilidad.';
        this.cdr.detectChanges();
      }
    });
  }

  // Paso 6: Seleccionar la conductora a asignar
  seleccionarConductora(conductora: any) {
    this.conductoraSeleccionada = conductora;
    this.cdr.detectChanges();
  }

  // Paso 7: Solicita confirmación de la asignación de viaje
  pedirConfirmacion() {
    if (this.solicitudSeleccionada && this.conductoraSeleccionada) {
      this.mostrarConfirmacion = true;
      this.cdr.detectChanges();
    }
  }

  // Flujo Alternativo (7): No confirma, la solicitud permanece pendiente
  cancelarAsignacion() {
    this.mostrarConfirmacion = false;
    this.conductoraSeleccionada = null;
    this.cdr.detectChanges();
  }

  // Paso 8 a 13: Ingresa confirmación, registra actualización y emite alertas con notificaciones
  confirmarAsignacion() {
    const ahora = new Date();
    const datosAsignacion = {
      solicitudId: this.solicitudSeleccionada.idS,
      operadoraId: this.idOperadoraLogueada,
      conductoraId: this.conductoraSeleccionada.idUsuario,
      fecha: ahora.toISOString().split('T')[0], // "YYYY-MM-DD"
      horaInicio: ahora.toISOString()
    };

    this.viajeService.asignarViaje(datosAsignacion).subscribe({
      next: (res) => {
        // Paso 11: Muestra el mensaje de asignación exitosa.
        this.mensajeExito = res.msg;
        
        // Limpiamos la selección y recargamos las solicitudes actualizadas
        this.solicitudSeleccionada = null;
        this.conductoraSeleccionada = null;
        this.conductorasDisponibles = [];
        this.mostrarConfirmacion = false;
        this.cargarSolicitudes();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err.error?.msg || 'Error crítico en la asignación.';
        this.mostrarConfirmacion = false;
        this.cdr.detectChanges();
      }
    });
  }
}