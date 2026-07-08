// Wir importieren OrderItem, weil eine Bestellung mehrere Positionen enthält.
import { OrderItem } from './order-item';

// Eine Order ist eine komplette, abgeschlossene Bestellung.
// Sie wird erstellt wenn der Kunde auf "Bezahlen" drückt.
export class Order {
  constructor(
    public id: string,           // Die Bestellnummer, z.B. "1", "2", "3"
    public items: OrderItem[],   // Alle bestellten Positionen als Liste (Array)
    public total: number,        // Der Gesamtpreis aller Positionen zusammen
    public createdAt: string,    // Datum und Uhrzeit der Bestellung als Text
    public checkoutType: string, // Abholen oder Liefern
    public pickupTime: string,   // Gewuenschte Uhrzeit
    public customerName: string, // Name des Kunden
    public phone: string,        // Handynummer fuer Rueckfragen
    public address: string,      // Lieferadresse, falls geliefert wird
    public subtotal: number = total,
    public discount: number = 0
  ) {}
}
