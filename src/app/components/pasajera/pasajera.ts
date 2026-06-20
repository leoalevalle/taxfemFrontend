import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-pasajera',
  imports: [CommonModule, FormsModule],
  templateUrl: './pasajera.html',
  styleUrl: './pasajera.css',
})
export class Pasajera implements OnInit {
  // Datos del Formulario
  origen: string = '';
  inicio: string = ''; // Destino

  // Simulación de sesión (Basado en las usuarias de prueba del seed)
  idPasajeraSeleccionada: number = 2; // Por defecto Laura Benítez
  pasajerasDePrueba = [
    { id: 2, nombre: 'Laura Benítez' },
    { id: 3, nombre: 'Sofía Rodríguez' }
  ];

  // Estados de la interfaz
  mensajeExito: string = '';
  errorMsg: string = '';
  cargando: boolean = false;

  constructor(
    private solicitudService: SolicitudService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  // + registrarViaje() / Enviar solicitud
  enviarSolicitud() {
    this.mensajeExito = '';
    this.errorMsg = '';

    // Validaciones básicas en el Front
    if (!this.origen.trim() || !this.inicio.trim()) {
      this.errorMsg = 'Por favor, completa los campos de Origen y Destino.';
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges(); // Fuerza el refresco para mostrar el estado "cargando" (ej. deshabilitar botón)

    const nuevaSolicitud = {
      pasajeraId: Number(this.idPasajeraSeleccionada),
      origen: this.origen,
      inicio: this.inicio // Mapeado al atributo del UML
    };

    this.solicitudService.registrarSolicitud(nuevaSolicitud).subscribe({
      next: (res) => {
        this.mensajeExito = `¡Solicitud enviada con éxito! Tu viaje desde "${res.data.origen}" quedó registrado en estado pendiente.`;
        // Limpiamos el formulario
        this.origen = '';
        this.inicio = '';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err.error?.msg || 'Ocurrió un error al registrar el viaje.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}