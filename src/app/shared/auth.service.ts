import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'isAdmin';

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.KEY) === 'true';
  }

  login(): void {
    sessionStorage.setItem(this.KEY, 'true');
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY);
  }
}
