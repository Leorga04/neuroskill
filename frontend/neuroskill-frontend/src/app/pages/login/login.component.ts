import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  datos = {
    nombre_usuario: '',
    correo: '',
    contrasena: ''
  };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  iniciarSesion() {
    // ✅ Validación de campos vacíos
    if (!this.datos.correo || !this.datos.contrasena) {
      alert('❗ Todos los campos son obligatorios');
      return;
    }

    // ✅ Validación de formato de correo
    if (!this.datos.correo.endsWith('@gmail.com') || this.datos.correo === '@gmail.com') {
      alert('❌ El correo debe ser un Gmail válido (ej. ejemplo@gmail.com)');
      return;
    }

    // ✅ Si pasa las validaciones, intenta iniciar sesión
    this.usuariosService.loginUsuario(this.datos).subscribe(
      (res: { user?: { id?: number, nombre_usuario: string } }) => {
        // ✅ Guarda el ID del usuario para registrar puntuaciones más tarde
        if (res.user && res.user.id) {
          localStorage.setItem('id_usuario', res.user.id.toString());
          localStorage.setItem('nombre_usuario', res.user.nombre_usuario);
        }

        alert('✅ Inicio de sesión exitoso');
        this.router.navigate(['/main']);
      },
      (err) => {
        console.error('❌ Error al iniciar sesión:', err);
        alert('❌ Credenciales incorrectas');
      }
    );
  }
}
