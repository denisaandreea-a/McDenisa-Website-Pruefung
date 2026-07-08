import { TestBed } from '@angular/core/testing';
import { Product } from '../model/product';
import { ProductService } from './product';
import { FIREBASE_CONFIG } from './firebase.config';

function createLocalService(): ProductService {
  TestBed.configureTestingModule({
    providers: [
      { provide: FIREBASE_CONFIG, useValue: { enabled: false, collectionName: 'products', config: {} } },
    ],
  });
  return TestBed.inject(ProductService);
}

describe('ProductService', () => {
  it('uses the local starter products when Firestore is disabled', async () => {
    const service = createLocalService();

    const products = await service.getAll();

    expect(service.isFirestoreEnabled()).toBe(false);
    expect(service.getDataSourceName()).toBe('Lokale Startdaten');
    expect(products.length).toBeGreaterThan(0);
  });

  it('supports local CRUD and announces changes', async () => {
    const service = createLocalService();
    const product = new Product('test-product', 'Test Burger', 3.99, 'Burger');
    let changeCount = 0;
    const subscription = service.changed$.subscribe(() => changeCount++);

    await service.add(product);
    expect(await service.getById(product.id)).toEqual(product);

    const updated = new Product(product.id, 'Test Burger XL', 4.99, 'Burger');
    await service.update(updated);
    expect(await service.getById(product.id)).toEqual(updated);

    await service.remove(updated);
    expect(await service.getById(product.id)).toBeUndefined();
    expect(changeCount).toBe(3);

    subscription.unsubscribe();
  });
});
