import { Inject, Injectable } from '@angular/core';
import type { Firestore } from 'firebase/firestore';
import { Order } from '../model/order';
import { FIREBASE_CONFIG, FirebaseConfig } from './firebase.config';
import { CustomerAuthService } from './customer-auth.service';

export type SavedCustomerOrder = {
  id: string;
  total: number;
  subtotal: number;
  discount: number;
  createdAt: string;
  checkoutType: string;
  pickupTime: string;
  customerName: string;
  items: Array<{ name: string; price: number; quantity: number }>;
};

@Injectable({ providedIn: 'root' })
export class CustomerOrderService {
  private db: Firestore | null = null;

  constructor(
    @Inject(FIREBASE_CONFIG) private firebaseConfig: FirebaseConfig,
    public customerAuth: CustomerAuthService,
  ) {}

  async save(order: Order): Promise<void> {
    await this.customerAuth.ready;
    const customer = this.customerAuth.customer();
    if (!customer) {
      return;
    }

    const savedOrder: SavedCustomerOrder = {
      id: order.id,
      total: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      createdAt: order.createdAt,
      checkoutType: order.checkoutType,
      pickupTime: order.pickupTime,
      customerName: order.customerName,
      items: order.items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };
    this.saveLocally(customer.uid, savedOrder);

    const { db, api } = await this.getFirestore();
    await this.withTimeout(api.addDoc(api.collection(db, 'users', customer.uid, 'orders'), {
      orderNumber: savedOrder.id,
      total: savedOrder.total,
      subtotal: savedOrder.subtotal,
      discount: savedOrder.discount,
      createdAt: savedOrder.createdAt,
      createdAtIso: new Date().toISOString(),
      checkoutType: savedOrder.checkoutType,
      pickupTime: savedOrder.pickupTime,
      customerName: savedOrder.customerName,
      items: savedOrder.items,
    }), 5000);
  }

  async getAll(): Promise<SavedCustomerOrder[]> {
    await this.customerAuth.ready;
    const customer = this.customerAuth.customer();
    if (!customer) {
      return [];
    }

    const localOrders = this.loadLocally(customer.uid);

    try {
      const { db, api } = await this.getFirestore();
      const ordersQuery = api.query(
        api.collection(db, 'users', customer.uid, 'orders'),
        api.orderBy('createdAtIso', 'desc'),
      );
      const snapshot = await this.withTimeout(api.getDocs(ordersQuery), 5000);
      const onlineOrders = snapshot.docs.map(orderDoc => {
        const data = orderDoc.data() as Omit<SavedCustomerOrder, 'id'> & { orderNumber?: string };
        return {
          ...data,
          id: data.orderNumber ?? orderDoc.id,
        };
      });

      return onlineOrders.length > 0 ? onlineOrders : localOrders;
    } catch {
      return localOrders;
    }
  }

  private async getFirestore(): Promise<{
    db: Firestore;
    api: typeof import('firebase/firestore');
  }> {
    if (!this.firebaseConfig.enabled) {
      throw new Error('Firestore ist deaktiviert.');
    }

    const firebaseApp = await import('firebase/app');
    const api = await import('firebase/firestore');
    const app = firebaseApp.getApps().length > 0
      ? firebaseApp.getApp()
      : firebaseApp.initializeApp(this.firebaseConfig.config);

    this.db ??= api.getFirestore(app);
    return { db: this.db, api };
  }

  private getStorageKey(uid: string): string {
    return `mcdenisaCustomerOrders:${uid}`;
  }

  private loadLocally(uid: string): SavedCustomerOrder[] {
    try {
      const saved = localStorage.getItem(this.getStorageKey(uid));
      return saved ? JSON.parse(saved) as SavedCustomerOrder[] : [];
    } catch {
      return [];
    }
  }

  private saveLocally(uid: string, order: SavedCustomerOrder): void {
    const orders = this.loadLocally(uid);
    localStorage.setItem(
      this.getStorageKey(uid),
      JSON.stringify([order, ...orders].slice(0, 50)),
    );
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error('Firestore antwortet nicht.')),
        timeoutMs,
      );
      promise.then(
        value => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        error => {
          clearTimeout(timeoutId);
          reject(error);
        },
      );
    });
  }
}
