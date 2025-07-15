import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
}

@Component({
  selector: 'app-perfil-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Mi perfil</h2>
    <mat-dialog-content style="text-align: center;">
      <img [src]="data.image" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%;" />
      <p><strong>Nombre:</strong> {{ data.name }}</p>
      <p><strong>Correo:</strong> {{ data.email }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class PerfilDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {}
}
