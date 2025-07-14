import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-perros',
  standalone: true,
  templateUrl: './perros.html',
  styleUrls: ['./perros.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class Perros implements OnInit {
  razas: DogBreed[] = [];
  cargando = true;
  columnas = 3;

  paginaActual = 1;
  razasPorPagina = 20;

  fallbackImage = 'https://i0.wp.com/micompi.com/blog/wp-content/uploads/2015/08/ConfusedDog.png?w=960&ssl=1';

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.ajustarColumnas(window.innerWidth);
    }
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

  get razasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.razasPorPagina;
    return this.razas.slice(inicio, inicio + this.razasPorPagina);
  }

  siguientePagina() {
    if ((this.paginaActual * this.razasPorPagina) < this.razas.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  handleImageError(raza: DogBreed) {
    raza.imageError = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.isBrowser) {
      const ancho = (event.target as Window).innerWidth;
      this.ajustarColumnas(ancho);
    }
  }

  private ajustarColumnas(ancho: number) {
    if (ancho <= 600) this.columnas = 1;
    else if (ancho <= 900) this.columnas = 2;
    else this.columnas = 3;
  }
}
