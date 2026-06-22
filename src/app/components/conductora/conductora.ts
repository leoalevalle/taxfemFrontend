import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConductoraService } from '../../services/conductora.service';
import { ViajeService } from '../../services/viaje.service';

@Component({
  selector: 'app-conductora',
  imports: [CommonModule, FormsModule],
  templateUrl: './conductora.html',
  styleUrl: './conductora.css',
})
export class Conductora implements OnInit {
  // Simulación de Perfil Activo (IDs provenientes del seed)
  idConductoraSeleccionada: number = 4; // Por defecto Elena Gómez
  conductorasDePrueba = [
    { id: 4, nombre: 'Elena Gómez (Matrícula: 45502)' },
    { id: 5, nombre: 'Valeria Cruz (Matrícula: 61129)' },
    { id: 6, nombre: 'Tatiana Gonzales (Matrícula: 45511)' },
    { id: 7, nombre: 'Patricia Cruz (Matrícula: 61100)' },
  ];

  // Datos
  viajesAsignados: any[] = [];
  errorMsg: string = '';

  constructor(private conductoraService: ConductoraService,
              private viajeService: ViajeService,
              private cdr: ChangeDetectorRef
              ) {}

  ngOnInit(): void {
    this.cargarViajes();
  }

  // Mapeado conceptual a + notificarConductora() / obtenerRespuesta()
  // Lee los viajes que la operadora le acaba de despachar
  cargarViajes() {
    this.errorMsg = '';
    this.conductoraService.getViajesAsignados(Number(this.idConductoraSeleccionada)).subscribe({
      next: (res) => {
        this.viajesAsignados = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'No se pudieron recuperar las notificaciones de viaje.';
        this.cdr.detectChanges();
      }
    });
  }

  // Al cambiar de chofer en el selector simulado, recargamos sus datos
  cambiarConductora() {
    this.viajesAsignados = [];
    this.cargarViajes();
  }

  rechazar(idViaje: number) {
    this.errorMsg = '';
    this.viajeService.rechazarViaje(idViaje).subscribe({
      next: (res) => {
        // Al rechazar, el viaje desaparece de su panel. Recargamos la lista.
        this.cargarViajes();
      },
      error: (err) => {
        this.errorMsg = 'Error al procesar el rechazo del viaje.';
        this.cdr.detectChanges();
      }
    });
  }

  aceptar(idViaje: number) {
    this.errorMsg = '';
    this.viajeService.aceptarViaje(idViaje).subscribe({
      next: (res) => {
        // El viaje pasa a estar 'encurso'. Volvemos a cargar para refrescar la vista/badges.
        this.cargarViajes();
      },
      error: (err) => {
        this.errorMsg = 'Error al procesar la aceptación del viaje.';
        this.cdr.detectChanges();
      }
    });
  }

  finalizar(idViaje: number) {
    this.errorMsg = '';
    this.viajeService.finalizarViaje(idViaje).subscribe({
      next: (res) => {
        this.cargarViajes(); // Refresca la lista y quita el viaje de la pantalla
      },
      error: (err) => {
        this.errorMsg = 'Error al finalizar el viaje.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(idViaje: number) {
    this.errorMsg = '';
    this.viajeService.cancelarViaje(idViaje).subscribe({
      next: (res) => {
        this.cargarViajes(); // Refresca la lista y quita el viaje de la pantalla
      },
      error: (err) => {
        this.errorMsg = 'Error al cancelar el viaje.';
        this.cdr.detectChanges();
      }
    });
  }
}