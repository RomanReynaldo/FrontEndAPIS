import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Perros } from './perros/perros';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'perros', component: Perros,canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
