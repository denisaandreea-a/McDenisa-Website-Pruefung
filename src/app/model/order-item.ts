// Wir importieren die Product-Klasse, weil ein OrderItem ein Produkt enthält.
import { Product } from './product';

// Ein OrderItem ist eine einzelne Zeile im Warenkorb.
// Zum Beispiel: 2x Big Mac – das Produkt ist "Big Mac" und die Menge ist 2.
export class OrderItem {
  constructor(
    public product: Product,  // Das Produkt, das bestellt wurde (z.B. Big Mac)
    public quantity: number   // Wie viele davon bestellt wurden (z.B. 2)
  ) {}
}
