import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerOrderService, SavedCustomerOrder } from '../shared/customer-order.service';

@Component({
  selector: 'app-my-orders',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders: SavedCustomerOrder[] = [];
  loading = true;
  errorMessage = '';

  constructor(public customerOrders: CustomerOrderService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.orders = await this.customerOrders.getAll();
    } catch {
      this.errorMessage = 'Die Bestellungen konnten gerade nicht geladen werden.';
    } finally {
      this.loading = false;
    }
  }
}
