// Wir importieren die Product-Klasse, weil ein OrderItem ein Produkt enthält.
import { Product } from './product';

// Ein OrderItem ist eine einzelne Zeile im Warenkorb.
// Zum Beispiel: 2x Big Mac – das Produkt ist "Big Mac" und die Menge ist 2.
export class OrderItem {
  removedIngredients: string[] = [];
  extraIngredients: Record<string, number> = {};
  milkOption: string | null = null;

  constructor(
    public product: Product,
    public quantity: number
  ) {}
}
