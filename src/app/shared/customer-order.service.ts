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

    const { db, api } = await this.getFirestore();
    await api.addDoc(api.collection(db, 'users', customer.uid, 'orders'), {
      orderNumber: order.id,
      total: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      createdAt: order.createdAt,
      createdAtIso: new Date().toISOString(),
      checkoutType: order.checkoutType,
      pickupTime: order.pickupTime,
      customerName: order.customerName,
      items: order.items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });
  }

  async getAll(): Promise<SavedCustomerOrder[]> {
    await this.customerAuth.ready;
    const customer = this.customerAuth.customer();
    if (!customer) {
      return [];
    }

    const { db, api } = await this.getFirestore();
    const ordersQuery = api.query(
      api.collection(db, 'users', customer.uid, 'orders'),
      api.orderBy('createdAtIso', 'desc'),
    );
    const snapshot = await api.getDocs(ordersQuery);

    return snapshot.docs.map(orderDoc => {
      const data = orderDoc.data() as Omit<SavedCustomerOrder, 'id'> & { orderNumber?: string };
      return {
        ...data,
        id: data.orderNumber ?? orderDoc.id,
      };
    });
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
}
