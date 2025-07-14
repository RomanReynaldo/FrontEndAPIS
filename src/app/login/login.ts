import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `<h1>Login</h1>`,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onLogin() {
    if (this.email.invalid || this.password.invalid) {
      this.snackBar.open('Por favor, completa todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const credentials = {
      email: this.email.value,
      password: this.password.value
    };

    this.http.get<any[]>('https://68743fcedd06792b9c937143.mockapi.io/api/users').subscribe({
      next: (users) => {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        
        if (user) {
          // Login exitoso
          this.snackBar.open('Login exitoso', 'Cerrar', { duration: 2000 });
          // Guardar usuario en localStorage si "Recuérdame" está marcado
          if ((document.getElementById('rememberMe') as HTMLInputElement).checked) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
          // Redirigir a la página principal
          this.router.navigate(['/perros'])
          .then(() => console.log('Redirección exitosa'))
          .catch(err => console.error('Error al redirigir:', err));
        } else {
          this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
        console.error('Error:', err);
      }
    });
  }
}