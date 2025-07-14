// src/app/components/navbar/navbar.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  template: `
    <div class="navbar">
      <span>Mi App</span>
      <div class="profile-menu" *ngIf="user">
        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Perfil">
          <img [src]="user.image" alt="{{user.name}}" class="avatar" />
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      align-items: center;
      height: 56px;
      background-color: #1976d2;
      color: white;
      font-weight: 600;
    }
    .profile-menu {
      display: flex;
      align-items: center;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: User | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = this.auth.getCurrentUser();
      if (currentUser) {
        this.fetchUser(currentUser.id);
      }
    }
  }

  fetchUser(userId: string) {
    this.http.get<User>(`https://68743fcedd06792b9c937143.mockapi.io/api/users/${userId}`).subscribe({
      next: user => this.user = user,
      error: () => this.logout()
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
