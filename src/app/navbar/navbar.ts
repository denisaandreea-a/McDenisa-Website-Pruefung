import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerAuthService } from '../shared/customer-auth.service';

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
