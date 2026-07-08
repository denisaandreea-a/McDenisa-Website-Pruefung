import { Product } from '../model/product';
import { CustomerAuthService } from './customer-auth.service';
import { OrderService } from './order';

function createService(loggedIn: boolean): OrderService {
  const customerAuth = {
    isLoggedIn: () => loggedIn,
  } as CustomerAuthService;
  return new OrderService(customerAuth);
}

describe('OrderService Kundenrabatt', () => {
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
});
