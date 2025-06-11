import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VelocidadService } from '../../services/velocidad.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-velocidad',
  templateUrl: './velocidad.component.html',
  styleUrls: ['./velocidad.component.css'],
  imports: [CommonModule],
})
export class VelocidadComponent implements OnDestroy {
  estado: 'inicio' | 'esperando' | 'click' | 'resultado' = 'inicio';
  mensaje: string = 'Haz click en cualquier parte para empezar';
  tiempoInicio: number = 0;
  
  tiempoReaccion: number = 0;
  timeoutId: any;
  mostrarRecords = false;

  records: any[] = [];

  constructor(
    private router: Router,
    private VelocidadService: VelocidadService
  ) {}
  ngOnInit() {
    this.cargarRecords();
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  cargarRecords() {
    this.VelocidadService.getRecords().subscribe({
      next: (data) => {
        // Aquí opcionalmente ordenamos por puntuación ascendente (mejor tiempo primero)
        this.records = data.sort((a, b) => a.puntuacion - b.puntuacion);
      },
      error: (err) => {
        console.error('❌ Error al cargar récords:', err);
      },
    });
  }

  toggleRecords(event: Event) {
    event.stopPropagation();
    this.mostrarRecords = !this.mostrarRecords;
    if (this.mostrarRecords) {
      this.cargarRecords();
    }
  }

  manejarClick() {
    if (this.estado === 'inicio') {
      this.estado = 'esperando';
      this.mensaje = 'Espera el cambio de color...';

      const delay = 1000 + Math.random() * 3000;
      this.timeoutId = setTimeout(() => {
        this.estado = 'click';
        this.mensaje = '¡Haz click ya!';
        this.tiempoInicio = Date.now();
      }, delay);
    } else if (this.estado === 'esperando') {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.estado = 'inicio';
      this.mensaje =
        '¡Has hecho clic demasiado pronto! Haz click para intentar de nuevo.';
    } else if (this.estado === 'click') {
      this.tiempoReaccion = Date.now() - this.tiempoInicio - 200;
      this.estado = 'resultado';
      this.mensaje = `¡Genial! Tu tiempo de reacción fue ${this.tiempoReaccion} ms. Haz click para jugar otra vez.`;
      this.guardardatos();
    } else if (this.estado === 'resultado') {
      this.estado = 'inicio';
      this.mensaje = 'Haz click en cualquier parte para empezar';
    }
  }

  guardardatos() {
    const id_usuario = Number(localStorage.getItem('id_usuario'));
    const nombre_usuario = localStorage.getItem('nombre_usuario');

    if (id_usuario && nombre_usuario && this.tiempoReaccion > 0) {
      this.VelocidadService.registrarResultado({
        id_usuario,
        puntuacion: this.tiempoReaccion,
        nombre_usuario,
      }).subscribe(
        () => console.log('✅ Resultado guardado en la tabla velocidad'),
        (err: any) => console.error('❌ Error al guardar resultado:', err)
      );
    }
  }
  volverAlMenu(event: Event) {
    event.stopPropagation(); // Evita que el click en el botón también active el manejarClick()
    this.router.navigate(['/main']);
  }
}
