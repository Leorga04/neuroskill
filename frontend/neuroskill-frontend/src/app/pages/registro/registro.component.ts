import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuarios: any[] = [];

  nuevoUsuario = {
    nombre_usuario: '',
    correo: '',
    contrasena: ''
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  registrarUsuario() {
    const { nombre_usuario, correo, contrasena } = this.nuevoUsuario;

    if (!nombre_usuario || !correo || !contrasena) {
      alert('❗ Todos los campos son obligatorios');
      return;
    }

    if (!correo.endsWith('@gmail.com') || correo === '@gmail.com') {
      alert('❌ El correo debe ser un Gmail válido (ej. ejemplo@gmail.com)');
      return;
    }

    if (contrasena.length < 4 || contrasena.length > 16) {
      alert('❌ La contraseña debe tener entre 4 y 16 caracteres');
      return;
    }

    // ✅ Si pasa validaciones, registrar usuario
    this.usuariosService.registrarUsuario(this.nuevoUsuario).subscribe(
      (res) => {
        alert('✅ Usuario registrado con éxito');
        this.nuevoUsuario = { nombre_usuario: '', correo: '', contrasena: '' };
        this.cargarUsuarios();
      },
      (err) => {
        console.error('❌ Error al registrar usuario:', err);
        alert('❌ Error al registrar usuario. Revisa consola.');
      }
    );
  }
}
