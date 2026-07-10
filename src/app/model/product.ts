/* das hier ist die Datenklasse für ein einzelnes Produkt. eine Klasse ist wie
   ne Vorlage, jedes Produkt was ich anlege hat genau diese Felder */
export class Product {
  constructor(
    public id: string,       // eine eindeutige Nummer, z.b "1" oder "2"
    public name: string,     // der Name des Produkts, z.b "Big Mac"
    public price: number,    // der Preis in Euro, z.b 5.49
    public category: string  // die Gruppe zu der das Produkt gehört, z.b "Burger"
  ) {}
  /* die Felder stehen direkt im Konstruktor mit "public", das ist ne
     Kurzschreibweise in TypeScript. Angular legt die Felder dadurch
     automatisch an, ich muss sie nicht zweimal schreiben */
}
