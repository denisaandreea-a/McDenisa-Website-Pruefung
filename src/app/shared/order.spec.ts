import { Product } from '../model/product';
import { CustomerAuthService } from './customer-auth.service';
import { OrderService } from './order';

function createService(loggedIn: boolean): OrderService {
  const customerAuth = {
    isLoggedIn: () => loggedIn,
    customer: () => loggedIn
      ? { uid: 'test-user', email: 'test@example.com', displayName: 'Test' }
      : null,
  } as CustomerAuthService;
  return new OrderService(customerAuth);
}

describe('OrderService Kundenrabatt', () => {
  beforeEach(() => localStorage.clear());

  it('berechnet für eingeloggte Kunden 10 Prozent Rabatt', () => {
    const service = createService(true);
    service.addProduct(new Product('test', 'Testmenü', 10, 'Menüs'), 2);

    expect(service.getDiscount()).toBe(2);
    expect(service.getCheckoutTotal('Abholen')).toBe(18);
    expect(service.getCheckoutTotal('Liefern')).toBe(20);
  });

  it('berechnet für Gäste keinen Rabatt', () => {
    const service = createService(false);
    service.addProduct(new Product('test', 'Testmenü', 10, 'Menüs'), 2);

    expect(service.getDiscount()).toBe(0);
    expect(service.getCheckoutTotal('Abholen')).toBe(20);
  });

  it('zählt Bestellnummern auch nach einem Neustart weiter', () => {
    const firstService = createService(true);
    firstService.addProduct(new Product('test', 'Testmenü', 10, 'Menüs'));
    const firstOrder = firstService.checkout('Abholen', '12:00', 'Test', '123', '');

    const restartedService = createService(true);
    restartedService.addProduct(new Product('test', 'Testmenü', 10, 'Menüs'));
    const secondOrder = restartedService.checkout('Abholen', '12:30', 'Test', '123', '');

    expect(firstOrder.id).toBe('1');
    expect(secondOrder.id).toBe('2');
  });

  it('vergibt Gästen keine fortlaufende Kontonummer', () => {
    const service = createService(false);
    service.addProduct(new Product('test', 'Testmenü', 10, 'Menüs'));

    const order = service.checkout('Abholen', '12:00', 'Gast', '123', '');

    expect(order.id).toBe('');
    expect(localStorage.getItem('mcdenisaNextOrderNumber:test-user')).toBeNull();
  });
});
