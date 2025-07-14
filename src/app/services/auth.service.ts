
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    }
    return false;
  }

  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  setCurrentUser(user: any, remember: boolean = false): void {
    if (isPlatformBrowser(this.platformId)) {
      if (remember) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
  }
}
