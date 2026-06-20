import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConductoraService } from '../../services/conductora.service';

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
    { id: 5, nombre: 'Valeria Cruz (Matrícula: 61129)' }
  ];

  // Datos
  viajesAsignados: any[] = [];
  errorMsg: string = '';

  constructor(private conductoraService: ConductoraService) {}

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
      },
      error: (err) => {
        this.errorMsg = 'No se pudieron recuperar las notificaciones de viaje.';
      }
    });
  }

  // Al cambiar de chofer en el selector simulado, recargamos sus datos
  cambiarConductora() {
    this.viajesAsignados = [];
    this.cargarViajes();
  }
}