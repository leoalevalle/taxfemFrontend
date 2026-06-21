<div class="container mt-4">
  <h2>Módulo de Operadora - Caso de Uso: Asignar Viajes</h2>
  <hr />

  <div *ngIf="mensajeExito" class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>¡Éxito!</strong> {{ mensajeExito }} (Pasajera y Conductora Notificadas).
  </div>
  <div *ngIf="errorMsg" class="alert alert-danger" role="alert">
    {{ errorMsg }}
  </div>

  <div class="row">
    <div class="col-md-6">
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">1. Seleccionar Solicitud de Viaje Pendiente</h5>
        </div>
        <div class="card-body">
          <div *ngIf="solicitudesPendientes.length === 0" class="text-muted">
            No hay solicitudes pendientes en el sistema.
          </div>
          <ul class="list-group">
            <li *ngFor="let sol of solicitudesPendientes" 
                (click)="seleccionarSolicitud(sol)"
                [class.active]="solicitudSeleccionada?.idS === sol.idS"
                class="list-group-item list-group-item-action cursor-pointer">
              <strong>Pasajera:</strong> {{ sol.pasajera?.nombre }} <br>
              <strong>Origen:</strong> {{ sol.origen }} | <strong>Destino:</strong> {{ sol.inicio }} <br>
              <small>Fecha/Hora: {{ sol.createdAt | date:'short' }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div *ngIf="solicitudSeleccionada" class="card border-info mb-4">
        <div class="card-body">
          <h5 class="card-title text-info">2. Datos del Viaje Seleccionado</h5>
          <p class="card-text">
            <strong>ID Solicitud:</strong> {{ solicitudSeleccionada.idS }} <br>
            <strong>Pasajera:</strong> {{ solicitudSeleccionada.pasajera?.nombre }} (Tel: {{ solicitudSeleccionada.pasajera?.telefono }}) <br>
            <strong>Recogida:</strong> {{ solicitudSeleccionada.origen }} -> {{ solicitudSeleccionada.inicio }}
          </p>
          <button (click)="consultarDisponibilidad()" class="btn btn-info w-100 text-white">
            3. Consultar Conductoras Disponibles
          </button>
        </div>
      </div>

      <div *ngIf="conductorasDisponibles.length > 0 && solicitudSeleccionada" class="card shadow-sm mb-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">5. Conductoras Disponibles</h5>
        </div>
        <div class="card-body">
          <div class="list-group">
            <button *ngFor="let cond of conductorasDisponibles"
                    type="button"
                    (click)="seleccionarConductora(cond)"
                    [class.active]="conductoraSeleccionada?.idUsuario === cond.idUsuario"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ cond.nombre }}</strong> <br>
                <small>Matrícula: {{ cond.matricula }} | Cel: {{ cond.telefono }}</small>
              </div>
              <span class="badge bg-light text-dark">Libre</span>
            </button>
          </div>

          <div class="mt-3" *ngIf="conductoraSeleccionada">
            <button (click)="pedirConfirmacion()" class="btn btn-warning w-100 fw-bold">
              7. Proceder a Asignar Viaje
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div *ngIf="mostrarConfirmacion" class="modal-backdrop-simulado p-4 bg-light border border-warning rounded mt-4 shadow">
    <h4 class="text-warning">¿Confirmar la Asignación del Viaje?</h4>
    <p>
      Se procederá a formalizar el traslado de la pasajera <strong>{{ solicitudSeleccionada?.pasajera?.nombre }}</strong> 
      junto con la conductora <strong>{{ conductoraSeleccionada?.nombre }}</strong>.
    </p>
    <div class="d-flex gap-2">
      <button (click)="confirmarAsignacion()" class="btn btn-success px-4">8. Sí, Confirmar</button>
      <button (click)="cancelarAsignacion()" class="btn btn-secondary px-4">No, Cancelar</button>
    </div>
  </div>
</div>