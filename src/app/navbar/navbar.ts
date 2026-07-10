import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerAuthService } from '../shared/customer-auth.service';

/* die Navigationsleiste die auf jeder Seite oben zu sehen ist (kommt aus
   app.html). zeigt je nachdem ob customerAuth.customer() grad einen Kunden
   liefert entweder "Einloggen" oder "Meine Bestellungen"/"Ausloggen" an */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(public customerAuth: CustomerAuthService) {}

  async logoutCustomer(): Promise<void> {
    await this.customerAuth.logout();
  }
}
