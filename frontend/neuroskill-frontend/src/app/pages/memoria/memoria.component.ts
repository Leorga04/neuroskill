import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MemoriaService } from '../../services/memoria.service';

@Component({
  selector: 'app-memoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memoria.component.html',
  styleUrls: ['./memoria.component.css'],
})
export class MemoriaComponent {
  cartas: any[] = [];
  cartaSeleccionada: any = null;
  bloqueado = false;
  mensaje = 'Haz clic en dos cartas para encontrar las parejas';
  tiempo = 0;
  intervalo: any = null;
  previsualizando = true;
   mostrarRecords = false;

  dificultad: 'facil' | 'intermedio' | 'dificil' = 'facil';
  mostrarSelector = true;
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
  constructor(private router: Router, private memoriaService: MemoriaService) {}

  establecerDificultad(n: string) {
    this.dificultad = n as any;
    this.mostrarSelector = false;
    this.iniciarJuego();
  }
  toggleRecords() {
  this.mostrarRecords = !this.mostrarRecords;
  if (this.mostrarRecords) {
    this.obtenerRecords();
  }
}

obtenerRecords() {
    this.memoriaService.getRecords().subscribe(
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
            (a, b) => b.tiempo - a.tiempo
          );
        }
      },
      (err) => console.error('❌ Error al obtener récords:', err)
    );
  }
  iniciarJuego() {
    const valoresBase = [
      '🍒',
      '🍋',
      '🍉',
      '🍇',
      '🍊',
      '🥝',
      '🍓',
      '🥥',
      '🍌',
      '🍍',
      '🍈',
      '🥭',
      '🍏',
      '🍐',
      '🍎',
      '🥑',
      '🍅',
      '🌽',
      '🥕',
      '🫐',
      '🥦',
      '🧄',
      '🥬',
      '🥒',
      '🍠',
    ];

    clearInterval(this.intervalo); // Reiniciar el tiempo
    this.tiempo = 0;

    let cantidadParejas = 0;
    if (this.dificultad === 'facil') cantidadParejas = 4; // 8 cartas
    if (this.dificultad === 'intermedio') cantidadParejas = 12; // 24 cartas
    if (this.dificultad === 'dificil') cantidadParejas = 24; // 48 cartas

    const valores = valoresBase.slice(0, cantidadParejas);
    this.cartas = [...valores, ...valores];

    // Rellenar con carta comodín si faltan
    const totalCartas =
      this.dificultad === 'facil' ? 9 : this.dificultad === 'intermedio' ? 25 : 49;

    while (this.cartas.length < totalCartas) {
      this.cartas.push('❓');
    }

    // Convertir todas a objetos con descubierta=true para previsualizar
    this.cartas = this.cartas
      .map((valor) => ({
        valor,
        descubierta: true,
        emparejada: false,
      }))
      .sort(() => Math.random() - 0.5);

    this.previsualizando = true;
    this.mensaje = '¡Memoriza las cartas!';

    // Ocultar después de 3 segundos
    setTimeout(() => {
      this.cartas.forEach((c) => {
        if (c.valor !== '❓') c.descubierta = false;
      });
      this.previsualizando = false;
      this.mensaje = 'Haz clic en dos cartas para encontrar las parejas';

      // Iniciar contador de tiempo después de previsualizar
      this.intervalo = setInterval(() => {
        this.tiempo++;
      }, 1000);
    }, 3000);

    this.cartaSeleccionada = null;
    this.bloqueado = false;
  }

  seleccionarCarta(carta: any) {
    if (
      this.bloqueado ||
      carta.descubierta ||
      carta.emparejada ||
      this.previsualizando
    )
      return;

    carta.descubierta = true;

    if (!this.cartaSeleccionada) {
      this.cartaSeleccionada = carta;
    } else {
      this.bloqueado = true;
      setTimeout(() => {
        if (this.cartaSeleccionada.valor === carta.valor) {
          carta.emparejada = true;
          this.cartaSeleccionada.emparejada = true;
        } else {
          carta.descubierta = false;
          this.cartaSeleccionada.descubierta = false;
        }
        this.cartaSeleccionada = null;
        this.bloqueado = false;

        if (
          this.cartas.filter((c) => c.valor !== '❓').every((c) => c.emparejada)
        ) {
          this.mensaje = '¡Felicidades! Has completado el juego.';
          clearInterval(this.intervalo);
          this.guardarDatos();
        }
      }, 1000);
    }
  }
  guardarDatos() {
    const id_usuario = Number(localStorage.getItem('id_usuario'));
    const nombre_usuario = localStorage.getItem('nombre_usuario');
    const dificultad_num =
      this.dificultad === 'facil' ? 1 : this.dificultad === 'intermedio' ? 2 : 3;
    if (id_usuario && nombre_usuario && this.tiempo && dificultad_num > 0) {
      this.memoriaService
        .registrarResultado({
          id_usuario,
          dificultad: dificultad_num,
          tiempo: this.tiempo,
          nombre_usuario,
        })
        .subscribe(
          () => console.log('Resultado guardado en la tabla memoria'),
          (err) => console.error('Error al guardar resultado:', err)
        );
    }
  }
  reiniciarJuego() {
    this.mostrarSelector = true;
    this.cartas = [];
    this.mensaje = 'Haz clic en dos cartas para encontrar las parejas';
  }

  volverAlMenu() {
    this.router.navigate(['/main']);
  }
}
