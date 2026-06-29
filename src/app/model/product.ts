// Das hier ist die Datenklasse für ein einzelnes Produkt.
// Eine Klasse ist wie eine Vorlage – jedes Produkt das wir anlegen, hat genau diese Felder.
export class Product {
  constructor(
    public id: string,       // Eine eindeutige Nummer, z.B. "1" oder "2"
    public name: string,     // Der Name des Produkts, z.B. "Big Mac"
    public price: number,    // Der Preis in Euro, z.B. 5.49
    public category: string  // Die Gruppe, zu der das Produkt gehört, z.B. "Burger"
  ) {}
  // Die Felder stehen direkt im Konstruktor mit "public" – das ist eine Kurzschreibweise in TypeScript.
  // Angular legt die Felder dadurch automatisch an, wir müssen sie nicht zweimal schreiben.
}
