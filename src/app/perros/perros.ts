import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogContent } from "../../../node_modules/@angular/material/dialog/index";  

interface DogBreed {
  id: number;
  name: string;
  weight: { imperial: string; metric: string; };
  height: { imperial: string; metric: string; };
  bred_for?: string;
  breed_group?: string;
  life_span?: string;
  temperament?: string;
  origin?: string;
  reference_image_id: string;
  imageError?: boolean;
}

// Componente modal para detalle
@Component({
  selector: 'app-detalle-raza',
  template: `
    <h2 mat-dialog-title>{{ data.name }}</h2>
    <mat-dialog-content>
      <img 
        [src]="'https://cdn2.thedogapi.com/images/' + data.reference_image_id + '.jpg'" 
        alt="{{ data.name }}" 
        style="width: 100%; max-width: 400px; margin-bottom: 16px;"
        (error)="imgError = true"
        *ngIf="!imgError"
      />
      <p *ngIf="imgError">Imagen no disponible.</p>

      <p><strong>Bred for:</strong> {{ data.bred_for || 'N/A' }}</p>
      <p><strong>Origen:</strong> {{ data.origin || 'N/A' }}</p>
      <p><strong>Grupo:</strong> {{ data.breed_group || 'N/A' }}</p>
      <p><strong>Peso (kg):</strong> {{ data.weight.metric }}</p>
      <p><strong>Altura (cm):</strong> {{ data.height.metric }}</p>
      <p><strong>Temperamento:</strong> {{ data.temperament || 'N/A' }}</p>
      <p><strong>Vida:</strong> {{ data.life_span || 'N/A' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  imports: [CommonModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,  // <- este
    DetalleRazaComponent],
})
export class DetalleRazaComponent {
  imgError = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DogBreed,
    public dialogRef: MatDialogRef<DetalleRazaComponent>
  ) {}
}

@Component({
  selector: 'app-perros',
  standalone: true,
  templateUrl: './perros.html',
  styleUrls: ['./perros.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    DetalleRazaComponent
  ]
})
export class Perros implements OnInit {
  razas: DogBreed[] = [];
  cargando = true;

  paginaActual = 1;
  opcionesPorPagina = [5, 10, 20, 50, 100];

  private _filtro: string = '';
  get filtro(): string {
    return this._filtro;
  }
  set filtro(value: string) {
    this._filtro = value;
    this.paginaActual = 1;
  }

  private _razasPorPagina = 10;
  get razasPorPagina(): number {
    return this._razasPorPagina;
  }
  set razasPorPagina(value: number) {
    this._razasPorPagina = value;
    this.paginaActual = 1;
  }

  razaEditando: DogBreed | null = null;

  fallbackImage = 'https://i0.wp.com/micompi.com/blog/wp-content/uploads/2015/08/ConfusedDog.png?w=960&ssl=1';

  columnasTabla: string[] = [
    'name',
    'breed_group',
    'weight',
    'height',
    'bred_for',
    'origin',
    'image',
    'acciones'
  ];

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.obtenerRazas();
  }

  obtenerRazas() {
    this.http.get<DogBreed[]>('https://api.thedogapi.com/v1/breeds').subscribe({
      next: (data) => {
        this.razas = data.slice(0, 500);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  getImagenUrl(imageId: string): string {
    return `https://cdn2.thedogapi.com/images/${imageId}.jpg`;
  }

  handleImageError(raza: DogBreed) {
    raza.imageError = true;
  }

  get razasFiltradas(): DogBreed[] {
    return this.razas.filter(raza =>
      raza.name.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  get razasFiltradasPaginadas(): DogBreed[] {
    const inicio = (this.paginaActual - 1) * this.razasPorPagina;
    return this.razasFiltradas.slice(inicio, inicio + this.razasPorPagina);
  }

  siguientePagina() {
    if ((this.paginaActual * this.razasPorPagina) < this.razasFiltradas.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  verMas(raza: DogBreed) {
    this.dialog.open(DetalleRazaComponent, {
      width: '450px',
      data: raza
    });
  }

  editarRaza(raza: DogBreed | null) {
    if (this.razaEditando === raza) {
      this.razaEditando = null;
    } else {
      this.razaEditando = raza;
    }
  }
  agregarRaza() {
    // Crear un nuevo objeto raza con datos mínimos y únicos (id incremental o timestamp)
    const nuevaRaza: DogBreed = {
      id: this.razas.length > 0 ? Math.max(...this.razas.map(r => r.id)) + 1 : 1,
      name: 'Nueva raza',
      weight: { imperial: '', metric: '' },
      height: { imperial: '', metric: '' },
      bred_for: '',
      breed_group: '',
      life_span: '',
      temperament: '',
      origin: '',
      reference_image_id: '', // sin imagen
      imageError: false,
    };
  
    // Insertar al inicio o al final del arreglo
    this.razas.unshift(nuevaRaza);
  
    // Opcional: activar edición para que el usuario complete datos inmediatamente
    this.razaEditando = nuevaRaza;
  
    // Opcional: resetear filtros o pagina a la primera
    this.paginaActual = 1;
  }
  

  guardarEdicion(raza: DogBreed) {
    this.razaEditando = null;
  }

  eliminarRaza(raza: DogBreed) {
    if (confirm(`¿Eliminar la raza "${raza.name}"? Esta acción no se puede deshacer.`)) {
      this.razas = this.razas.filter(r => r !== raza);
    }
  }
}
