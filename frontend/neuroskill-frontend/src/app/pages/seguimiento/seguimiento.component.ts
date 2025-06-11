import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeguimientoService } from '../../services/seguimiento.service';
@Component({
  selector: 'app-bola',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
})
export class SeguimientoComponent implements OnInit, OnDestroy {
  puntos = 0;
  dificultad: 'facil' | 'intermedio' | 'dificil' | null = null;

  bolaX = 50;
  bolaY = 50;
  dirX = 1;
  dirY = 1;
  velocidad = 1.5;

  mostrarRecords = false;
  dificultadSeleccionada: 'facil' | 'intermedio' | 'dificil' = 'facil';

  niveles: ('facil' | 'intermedio' | 'dificil')[] = [
    'facil',
    'intermedio',
    'dificil',
  ];

  records: Record<'facil' | 'intermedio' | 'dificil', any[]> = {
    facil: [],
    intermedio: [],
    dificil: [],
  };

  constructor(
    private router: Router,
    private seguimientoService: SeguimientoService
  ) {}

  presionado = false;
  frameId: any = null;
  contadorInterval: any = null;
  tiempoInterval: any = null;
  tiempoRestante = 30;
  juegoActivo = false;

  ngOnInit() {
    this.obtenerRecords();
  }
  obtenerRecords() {
    this.seguimientoService.getRecords().subscribe(
      (res) => {
        this.records = { facil: [], intermedio: [], dificil: [] };
        for (let r of res) {
          const nivel =
            r.dificultad === 1
              ? 'facil'
              : r.dificultad === 2
              ? 'intermedio'
              : 'dificil';
          this.records[nivel].push(r);
        }
        for (let nivel of this.niveles) {
          this.records[nivel] = this.records[nivel].sort(
            (a, b) => b.puntuacion - a.puntuacion
          );
        }
      },
      (err) => console.error('❌ Error al obtener récords:', err)
    );
  }

  establecerDificultad(dif: 'facil' | 'intermedio' | 'dificil') {
    // Limpiar antes de empezar nuevo juego
    this.puntos = 0;
    this.bolaX = 50;
    this.bolaY = 50;
    this.presionado = false;
    this.juegoActivo = false;
    cancelAnimationFrame(this.frameId);
    clearInterval(this.contadorInterval);
    clearInterval(this.tiempoInterval);

    this.dificultad = dif;
    this.velocidad = dif === 'facil' ? 0.5 : dif === 'intermedio' ? 1 : 1.5;

    this.tiempoRestante = 30;
    this.juegoActivo = true;

    this.iniciarDireccionAleatoria();
    this.iniciarMovimiento();
    this.iniciarContadorPuntos();
    this.iniciarTemporizador();
  }

  iniciarDireccionAleatoria() {
    const angulo = Math.random() * 2 * Math.PI;
    this.dirX = Math.cos(angulo);
    this.dirY = Math.sin(angulo);
  }

  iniciarMovimiento() {
    const mover = () => {
      if (!this.juegoActivo) return;

      this.bolaX += this.dirX * this.velocidad;
      this.bolaY += this.dirY * this.velocidad;

      if (this.bolaX <= 0 || this.bolaX >= 95) {
        this.dirX *= -1;
        this.variarDireccion();
      }

      if (this.bolaY <= 0 || this.bolaY >= 90) {
        this.dirY *= -1;
        this.variarDireccion();
      }

      this.frameId = requestAnimationFrame(mover);
    };

    mover();
  }

  iniciarContadorPuntos() {
    this.contadorInterval = setInterval(() => {
      if (this.presionado && this.juegoActivo) this.puntos++;
    }, 100);
  }

  iniciarTemporizador() {
    this.tiempoInterval = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.detenerJuego();
      }
    }, 1000);
  }

  detenerJuego() {
    this.juegoActivo = false;
    cancelAnimationFrame(this.frameId);
    clearInterval(this.contadorInterval);
    clearInterval(this.tiempoInterval);
    this.presionado = false;
    this.guardarDatos();
    this.obtenerRecords
  }
  guardarDatos() {
    const id_usuario = Number(localStorage.getItem('id_usuario'));
    const nombre_usuario = localStorage.getItem('nombre_usuario');
    const dificultadNum =
      this.dificultad === 'facil'
        ? 1
        : this.dificultad === 'intermedio'
        ? 2
        : 3;

    if (id_usuario && nombre_usuario && this.puntos > 0) {
      this.seguimientoService
        .registrarResultado({
          id_usuario,
          puntuacion: this.puntos,
          nombre_usuario,
          dificultad: dificultadNum,
        })
        .subscribe(
          () => console.log('✅ Resultado guardado en seguimiento'),
          (err) =>
            console.error('❌ Error al guardar resultado seguimiento:', err)
        );
    }
  }

  variarDireccion() {
    const variacion = (Math.random() - 0.5) * 0.5;
    const angulo = Math.atan2(this.dirY, this.dirX) + variacion;
    this.dirX = Math.cos(angulo);
    this.dirY = Math.sin(angulo);
  }

  mouseDown() {
    this.presionado = true;
  }

  mouseUp() {
    this.presionado = false;
  }

  reiniciar() {
    this.puntos = 0;
    this.bolaX = 50;
    this.bolaY = 50;
    this.presionado = false;
    this.juegoActivo = false;
    cancelAnimationFrame(this.frameId);
    clearInterval(this.contadorInterval);
    clearInterval(this.tiempoInterval);
    this.dificultad = null; // Mostrar nuevamente el menú
  }

  ngOnDestroy() {
    this.reiniciar();
  }
  volverAlMenu() {
    this.router.navigate(['/main']);
  }
}
