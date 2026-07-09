import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from '../model/order';
import { OrderItem } from '../model/order-item';
import { Product } from '../model/product';
import { CustomerAuthService } from './customer-auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly deliveryFee = 2;

  private changed = new Subject<void>();
  public changed$ = this.changed.asObservable();

  private currentItems: OrderItem[] = [];
  private readonly orderCounterKey = 'mcdenisaNextOrderNumber';

  constructor(public customerAuth: CustomerAuthService) {}

  getItems(): OrderItem[] {
    return this.currentItems.slice();
  }

  getTotal(): number {
    return this.currentItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
  }

  getCheckoutTotal(checkoutType: string | null | undefined): number {
    return this.getTotal() - this.getDiscount() + (checkoutType === 'Liefern' ? this.deliveryFee : 0);
  }

  getDiscount(): number {
    return this.customerAuth.isLoggedIn()
      ? Number((this.getTotal() * 0.1).toFixed(2))
      : 0;
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

  checkout(
    checkoutType: string,
    pickupTime: string,
    customerName: string,
    phone: string,
    address: string
  ): Order {
    const subtotal = this.getTotal();
    const discount = this.getDiscount();
    const order = new Order(
      this.createNextOrderId(),
      this.currentItems.slice(),
      this.getCheckoutTotal(checkoutType),
      new Date().toLocaleString('de-DE'),
      checkoutType,
      pickupTime,
      customerName,
      phone,
      address,
      subtotal,
      discount,
    );
    this.currentItems = [];
    this.changed.next();
    return order;
  }

  clearCart(): void {
    this.currentItems = [];
    this.changed.next();
  }

  private createNextOrderId(): string {
    const customer = this.customerAuth.customer();
    if (!customer) {
      return '';
    }

    const counterKey = `${this.orderCounterKey}:${customer.uid}`;
    const historyKey = `mcdenisaCustomerOrders:${customer.uid}`;
    let nextNumber = Number(localStorage.getItem(counterKey)) || 1;

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key !== historyKey) {
        continue;
      }

      try {
        const orders = JSON.parse(localStorage.getItem(key) ?? '[]') as Array<{ id?: string }>;
        const highestSavedNumber = orders.reduce(
          (highest, order) => Math.max(highest, Number(order.id) || 0),
          0,
        );
        nextNumber = Math.max(nextNumber, highestSavedNumber + 1);
      } catch {
        // Ungültige alte Browserdaten werden ignoriert.
      }
    }

    localStorage.setItem(counterKey, String(nextNumber + 1));
    return String(nextNumber);
  }
}
