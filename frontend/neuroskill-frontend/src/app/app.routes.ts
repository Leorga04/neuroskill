import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AimComponent } from './pages/aim/aim.component';
import { VelocidadComponent } from './pages/velocidad/velocidad.component';
import { MemoriaComponent } from './pages/memoria/memoria.component';
import { SeguimientoComponent } from './pages/seguimiento/seguimiento.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'main', component: MainComponent },
  { path: 'aim', component: AimComponent},
  { path: 'velocidad', component: VelocidadComponent },
  {path: 'memoria', component: MemoriaComponent},
  {path:'seguimiento', component: SeguimientoComponent},
];

export const routes = [
    // Define your routes here
  ];