import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PuntuacionesService } from '../../services/puntuaciones.service';
import { AimService } from '../../services/aim.service';

@Component({
  selector: 'app-aim',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aim.component.html',
  styleUrls: ['./aim.component.css'],
})
export class AimComponent implements OnInit, OnDestroy {
  targetX = 0;
  targetY = 0;
  targetVisible = false;
  aciertos = 0;

  tiempoRestante = 30;
  intervaloTiempo: any;
  intervaloTarget: any;
  juegoActivo = false;
  timeoutDesaparicion: any;

  dificultad = 'facil';
  mostrarRecords = false;

  niveles: ('facil' | 'intermedio' | 'dificil')[] = [
    'facil',
    'intermedio',
    'dificil',
  ];
  dificultadSeleccionada: 'facil' | 'intermedio' | 'dificil' = 'facil';

  records: Record<'facil' | 'intermedio' | 'dificil', any[]> = {
    facil: [],
    intermedio: [],
    dificil: [],
  };

  constructor(
    private router: Router,
    private puntuacionesService: PuntuacionesService,
    private aimService: AimService
  ) {}

  ngOnInit() {
    this.obtenerRecords();
  }

  seleccionarDificultad(nivel: string) {
    this.dificultad = nivel;
    this.iniciarJuego();
  }
  obtenerRecords() {
    this.aimService.getRecords().subscribe(
      (res) => {
        // Reiniciamos y separamos los récords por dificultad
        this.records = { facil: [], intermedio: [], dificil: [] };

        for (let r of res) {
          if (r.dificultad === 1) this.records.facil.push(r);
          else if (r.dificultad === 2) this.records.intermedio.push(r);
          else if (r.dificultad === 3) this.records.dificil.push(r);
        }
        for (let key of ['facil', 'intermedio', 'dificil'] as const) {
          this.records[key] = this.records[key].sort(
            (a, b) => b.puntuacion - a.puntuacion
          );
        }
      },
      (err) => console.error('❌ Error al obtener récords:', err)
    );
  }

  iniciarJuego() {
    this.aciertos = 0;
    this.tiempoRestante = 30;
    this.juegoActivo = true;

    this.intervaloTiempo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finalizarJuego();
      }
    }, 1000);

    this.aparecerTarget(); // solo el primero
  }

  aparecerTarget() {
    if (!this.juegoActivo) return; // ⛔ No hacer nada si el juego ha terminado

    // Resto del código...
    this.targetX = Math.random() * (window.innerWidth - 60);
    this.targetY = Math.random() * (window.innerHeight - 160);
    this.targetVisible = true;

    clearTimeout(this.timeoutDesaparicion);

    const desaparicion =
      this.dificultad === 'facil'
        ? 2000
        : this.dificultad === 'intermedio'
        ? 1200
        : 900;

    this.timeoutDesaparicion = setTimeout(() => {
      if (this.targetVisible && this.juegoActivo) {
        // <- verifica otra vez por seguridad
        if (this.aciertos > 0) {
        this.aciertos--;
      }
        this.targetVisible = false;
        this.aparecerTarget();
      }
    }, desaparicion);
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      target.classList.contains('target') &&
      this.juegoActivo &&
      this.targetVisible
    ) {
      this.aciertos++;
      this.targetVisible = false;
      clearTimeout(this.timeoutDesaparicion); // <- Evita que se dispare cuando ya se acertó

      const delay =
        this.dificultad === 'facil'
          ? 600
          : this.dificultad === 'intermedio'
          ? 300
          : 100;

      setTimeout(() => {
        this.aparecerTarget();
      }, delay);
    }
  }

  finalizarJuego() {
    clearInterval(this.intervaloTiempo);
    clearInterval(this.intervaloTarget);
    clearTimeout(this.timeoutDesaparicion);
    this.juegoActivo = false;
    this.targetVisible = false;

    alert(`⏱️ Fin del juego\nAciertos: ${this.aciertos}`);

    const id_usuario = Number(localStorage.getItem('id_usuario'));
    const nombre_usuario = localStorage.getItem('nombre_usuario');
    const dificultad_num =
      this.dificultad === 'facil'
        ? 1
        : this.dificultad === 'intermedio'
        ? 2
        : 3;

    if (id_usuario && nombre_usuario && this.aciertos > 0) {
      this.aimService
        .registrarResultado({
          id_usuario,
          puntuacion: this.aciertos,
          nombre_usuario,
          dificultad: dificultad_num,
        })
        .subscribe(
          () => console.log('✅ Resultado guardado en la tabla aim'),
          (err) => console.error('❌ Error al guardar resultado:', err)
        );
    }
  }

  volverAlMenu() {
    this.router.navigate(['/main']);
  }

  ngOnDestroy() {
    clearInterval(this.intervaloTiempo);
    clearInterval(this.intervaloTarget);
  }
}
