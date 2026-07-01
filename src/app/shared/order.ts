import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from '../model/order';
import { OrderItem } from '../model/order-item';
import { Product } from '../model/product';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private changed = new Subject<void>();
  public changed$ = this.changed.asObservable();

  private currentItems: OrderItem[] = [];
  private orderCounter = 1;

  getItems(): OrderItem[] {
    return this.currentItems.slice();
  }

  getTotal(): number {
    return this.currentItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
  }

  addProduct(product: Product, quantity: number = 1): void {
    const existing = this.currentItems.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.currentItems.push(new OrderItem(product, quantity));
    }
    this.changed.next();
  }

  removeItem(item: OrderItem): void {
    const index = this.currentItems.indexOf(item);
    if (index !== -1) {
      this.currentItems.splice(index, 1);
      this.changed.next();
    }
  }

  checkout(checkoutType: string, pickupTime: string): Order {
    const order = new Order(
      String(this.orderCounter++),
      this.currentItems.slice(),
      this.getTotal(),
      new Date().toLocaleString('de-DE'),
      checkoutType,
      pickupTime
    );
    this.currentItems = [];
    this.changed.next();
    return order;
  }

  clearCart(): void {
    this.currentItems = [];
    this.changed.next();
  }
}
