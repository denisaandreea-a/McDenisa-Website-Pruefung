import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { Firestore } from 'firebase/firestore';
import { Product } from '../model/product';
import { FIREBASE_CONFIG, FirebaseConfig } from './firebase.config';

type ProductData = {
  name: string;
  price: number;
  category: string;
};

type FirestoreApi = typeof import('firebase/firestore');

@Injectable({ providedIn: 'root' })
export class ProductService {

  private changed = new Subject<void>();
  public changed$ = this.changed.asObservable();

  private db: Firestore | null;
  private firestoreApi: FirestoreApi | null = null;
  private readonly firestoreReady: Promise<void> | null;
  private readonly collectionName: string;
  private firestoreError: string | null = null;

  private readonly objects: Product[] = [

    new Product('m1', 'Big Mac Menü',           8.99, 'Menüs'),
    new Product('m2', 'McRoyal Menü',           9.49, 'Menüs'),
    new Product('m3', 'McChicken Menü',         8.49, 'Menüs'),
    new Product('m4', 'McRib Menü',             8.99, 'Menüs'),

    new Product('h1', 'Happy Meal Cheeseburger',5.49, 'Happy Meal'),
    new Product('h2', 'Happy Meal Hamburger',   5.49, 'Happy Meal'),
    new Product('h3', 'Happy Meal Nuggets',     5.49, 'Happy Meal'),

    new Product('b1', 'Big Mac',               5.49, 'Burger'),
    new Product('b2', 'McRoyal',               5.99, 'Burger'),
    new Product('b3', 'McRoyal Käse',          5.99, 'Burger'),
    new Product('b4', 'McChicken',             4.49, 'Burger'),
    new Product('b5', 'McRib',                 4.99, 'Burger'),
    new Product('b6', 'Cheeseburger',          1.99, 'Burger'),
    new Product('b7', 'Double Cheeseburger',   2.99, 'Burger'),
    new Product('b8', 'Hamburger',             1.49, 'Burger'),
    new Product('b9', 'Filet-O-Fish',          4.49, 'Burger'),

    new Product('c1', 'McNuggets 6er',         3.99, 'Chicken & Nuggets'),
    new Product('c2', 'McNuggets 9er',         5.49, 'Chicken & Nuggets'),
    new Product('c3', 'McNuggets 20er',        9.99, 'Chicken & Nuggets'),

    new Product('s1', 'Pommes',                2.29, 'Beilagen'),
    new Product('s2', 'Kartoffelecken',        2.99, 'Beilagen'),

    new Product('g1', 'Cola',                  1.99, 'Getränke'),
    new Product('g2', 'Fanta',                 1.99, 'Getränke'),
    new Product('g3', 'Sprite',                1.99, 'Getränke'),
    new Product('g4', 'Iced Tea',              1.99, 'Getränke'),
    new Product('g5', 'Wasser',                1.49, 'Getränke'),

    new Product('k1', 'Kaffee',                1.49, 'McCafé'),
    new Product('k2', 'Cappuccino',            2.49, 'McCafé'),
    new Product('k3', 'Latte Macchiato',       2.99, 'McCafé'),
    new Product('k4', 'Milchkaffee',           2.49, 'McCafé'),
    new Product('k5', 'Frappé',                3.49, 'McCafé'),

    new Product('d1', 'McFlurry',              2.49, 'Desserts'),
    new Product('d2', 'McSundae',              1.49, 'Desserts'),
    new Product('d3', 'Milkshake',             2.99, 'Desserts'),
    new Product('d4', 'Apfeltasche',           1.49, 'Desserts'),
    new Product('d5', 'Softeis',               1.00, 'Desserts'),
  ];

  constructor(@Inject(FIREBASE_CONFIG) private firebaseConfig: FirebaseConfig) {
    this.collectionName = this.firebaseConfig.collectionName;
    if (this.firebaseConfig.enabled) {
      this.db = null;
      this.firestoreReady = this.initFirestore().catch((error: unknown) => {
        this.firestoreError = error instanceof Error ? error.message : 'Firestore konnte nicht gestartet werden.';
        throw error;
      });
    } else {
      this.db = null;
      this.firestoreReady = null;
    }
  }

  isFirestoreEnabled(): boolean {
    return this.firebaseConfig.enabled;
  }

  getDataSourceName(): string {
    return this.firebaseConfig.enabled ? 'Firebase Firestore' : 'Lokale Startdaten';
  }

  getCollectionName(): string {
    return this.collectionName;
  }

  getFirestoreError(): string | null {
    return this.firestoreError;
  }

  async getAll(): Promise<Product[]> {
    const firestore = await this.getFirestore();
    if (!firestore) {
      return this.sortedProducts(this.objects);
    }

    const { api, db } = firestore;
    const snapshot = await api.getDocs(api.collection(db, this.collectionName));
    const products = snapshot.docs.map(productDoc => this.fromFirestore(productDoc.id, productDoc.data() as ProductData));

    if (products.length === 0) {
      await this.seedDefaultProducts();
      return this.sortedProducts(this.objects);
    }

    return this.sortedProducts(products);
  }

  async getById(id: string): Promise<Product | undefined> {
    const firestore = await this.getFirestore();
    if (!firestore) {
      return this.objects.find(x => x.id === id);
    }

    const { api, db } = firestore;
    const productDoc = await api.getDoc(api.doc(db, this.collectionName, id));
    if (!productDoc.exists()) {
      return undefined;
    }

    return this.fromFirestore(productDoc.id, productDoc.data() as ProductData);
  }

  async add(obj: Product): Promise<void> {
    const firestore = await this.getFirestore();
    if (firestore) {
      const { api, db } = firestore;
      await api.setDoc(api.doc(db, this.collectionName, obj.id), this.toFirestore(obj));
    } else {
      this.objects.push(obj);
    }
    this.changed.next();
  }

  async update(obj: Product): Promise<void> {
    const firestore = await this.getFirestore();
    if (firestore) {
      const { api, db } = firestore;
      await api.setDoc(api.doc(db, this.collectionName, obj.id), this.toFirestore(obj));
      this.changed.next();
      return;
    }

    const index = this.objects.findIndex(x => x.id === obj.id);
    if (index !== -1) {
      this.objects[index] = obj;
      this.changed.next();
    }
  }

  async remove(obj: Product): Promise<void> {
    const firestore = await this.getFirestore();
    if (firestore) {
      const { api, db } = firestore;
      await api.deleteDoc(api.doc(db, this.collectionName, obj.id));
      this.changed.next();
      return;
    }

    const index = this.objects.findIndex(x => x.id === obj.id);
    if (index !== -1) {
      this.objects.splice(index, 1);
      this.changed.next();
    }
  }

  private async seedDefaultProducts(): Promise<void> {
    const firestore = await this.getFirestore();
    if (!firestore) {
      return;
    }

    const { api, db } = firestore;
    const batch = api.writeBatch(db);
    for (const product of this.objects) {
      batch.set(api.doc(db, this.collectionName, product.id), this.toFirestore(product));
    }
    await batch.commit();
  }

  private async initFirestore(): Promise<void> {
    this.validateFirebaseConfig();
    const firebaseApp = await import('firebase/app');
    const firestore = await import('firebase/firestore');
    const app = firebaseApp.initializeApp(this.firebaseConfig.config);

    this.firestoreApi = firestore;
    this.db = firestore.getFirestore(app);
  }

  private async getFirestore(): Promise<{ api: FirestoreApi; db: Firestore } | null> {
    if (!this.firebaseConfig.enabled || !this.firestoreReady) {
      return null;
    }

    try {
      await this.firestoreReady;
    } catch (error) {
      this.firestoreError = error instanceof Error ? error.message : 'Firestore konnte nicht gestartet werden.';
      throw error;
    }
    if (!this.firestoreApi || !this.db) {
      throw new Error('Firestore konnte nicht initialisiert werden.');
    }

    return { api: this.firestoreApi, db: this.db };
  }

  private validateFirebaseConfig(): void {
    const config = this.firebaseConfig.config;
    const requiredValues = [
      config.apiKey,
      config.authDomain,
      config.projectId,
      config.storageBucket,
      config.messagingSenderId,
      config.appId,
    ];

    if (requiredValues.some(value => !value || value.includes('DEIN') || value.includes('DEINE'))) {
      throw new Error('Firebase ist aktiviert, aber die Firebase-Konfiguration enthält noch Platzhalter.');
    }
  }

  private toFirestore(product: Product): ProductData {
    return {
      name: product.name,
      price: product.price,
      category: product.category,
    };
  }

  private fromFirestore(id: string, data: ProductData): Product {
    return new Product(id, data.name, data.price, data.category);
  }

  private sortedProducts(products: Product[]): Product[] {
    return products.slice().sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
    });
  }
}
