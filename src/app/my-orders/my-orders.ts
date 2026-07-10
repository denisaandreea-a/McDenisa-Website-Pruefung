import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerOrderService, SavedCustomerOrder } from '../shared/customer-order.service';

@Component({
  selector: 'app-my-orders',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
// zeigt die Bestellhistorie vom eingeloggten Kunden. nur über den customerGuard erreichbar, drum muss ich hier nicht extra prüfen ob überhaupt wer eingeloggt ist
export class MyOrders implements OnInit {
  readonly orders = signal<SavedCustomerOrder[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor(public customerOrders: CustomerOrderService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.orders.set(await this.customerOrders.getAll());
    } catch {
      this.errorMessage.set('Die Bestellungen konnten gerade nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }
}
