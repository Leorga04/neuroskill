import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  constructor(private router: Router) {}
  mostrarCuenta = false;

  usuario = {
    id: Number(localStorage.getItem('id_usuario')),
    nombre_usuario: localStorage.getItem('nombre_usuario') || '',
    correo: localStorage.getItem('correo') || '',
  };

  guardarCambios() {
    // Aquí puedes hacer una petición al backend si deseas actualizar el nombre.
    localStorage.setItem('nombre_usuario', this.usuario.nombre_usuario);
    alert('✅ Nombre actualizado');
    this.mostrarCuenta = false;
  }

  iniciarJuego(juego: string) {
    if (juego === 'aim') {
      this.router.navigate(['/aim']);
    } else if (juego === 'velocidad') {
      this.router.navigate(['/velocidad']);
    } else if (juego === 'memoria') {
      this.router.navigate(['/memoria']);
    } else if (juego === 'seguimiento') {
      this.router.navigate(['/seguimiento']);
    } else {
      alert(`Iniciando juego de ${juego}`);
    }
  }

  cerrarSesion() {
    localStorage.clear(); // o elimina solo lo que uses para guardar el usuario
    this.router.navigate(['/login']);
  }
}
