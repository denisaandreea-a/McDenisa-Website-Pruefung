import { Injectable } from '@angular/core';

/* das ist der ganz einfache Admin-Login. kein Firebase, keine echte
   Authentifizierung, nur ein Flag im sessionStorage das der adminGuard
   abfragt. sessionStorage heisst: sobald der Tab/Browser zu ist, ist man
   automatisch wieder ausgeloggt */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'isAdmin';

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.KEY) === 'true';
  }

  // Wird aufgerufen, nachdem der PIN in der Login-Komponente stimmt.
  login(): void {
    sessionStorage.setItem(this.KEY, 'true');
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY);
  }
}
