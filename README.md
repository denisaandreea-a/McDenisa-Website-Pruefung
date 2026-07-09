# McDenisa Kasse

McDenisa ist eine fiktive Angular-Kassenanwendung für das Modul **Web-Frontends mit Angular** im Sommersemester 2026.

Die Anwendung ist kein echtes Restaurant-System. Sie dient als Schulprojekt, um die wichtigsten Angular-Konzepte aus dem Kursbuch praktisch in einer zusammenhängenden Webanwendung zu zeigen.

## Kurzüberblick

| Punkt | Beschreibung |
|---|---|
| Framework | Angular 22 mit Standalone Components |
| UI | Bootstrap, eigene CSS-Komponenten, responsive Grundstruktur |
| Datenhaltung | Firebase Firestore für Produkte und Kundenbestellungen |
| Authentifizierung | Firebase Authentication für Kunden |
| Admin-Zugriff | separater PIN-Login mit Route Guard |
| Formulare | Reactive Forms mit Validierung |
| Projektcharakter | fiktives Schulprojekt mit Musterdaten |

## Hauptfunktionen

| Bereich | Funktion |
|---|---|
| Kasse | Produkte nach Kategorien anzeigen, Menge wählen, Optionen auswählen |
| Warenkorb | Artikel anzeigen, entfernen, Gesamtpreis berechnen |
| Checkout | Abholen/Liefern, Uhrzeit, Name, Telefonnummer, Adresse |
| Kundenkonto | registrieren, einloggen, ausloggen |
| Rabatt | 10 % Rabatt für eingeloggte Kunden |
| Bestellhistorie | persönliche Bestellungen pro Kundenkonto |
| Admin | Produkte anlegen, bearbeiten und löschen |
| Kontakt | Feedbackformular mit sichtbaren Kommentaren |
| Über uns | Teamkarten mit Initialen und Alias |
| Transparenz | Hinweisbanner: fiktives Schulprojekt |

## Routen

| Route | Seite | Schutz |
|---|---|---|
| `/order` | Kasse / Bestellen | öffentlich |
| `/about` | Über uns | öffentlich |
| `/career` | Karriereformular | öffentlich |
| `/contact` | Kontakt / Feedback | öffentlich |
| `/konto` | Kundenkonto | öffentlich |
| `/meine-bestellungen` | persönliche Bestellhistorie | `customerGuard` |
| `/login` | Admin-Login | öffentlich |
| `/admin` | Produktverwaltung | `adminGuard` |
| `/admin/product/new` | Produkt anlegen | `adminGuard` |
| `/admin/product/:id` | Produkt bearbeiten | `adminGuard` |

## Bezug zum Kursbuch

| Kursbuch-Thema | Umsetzung im Projekt |
|---|---|
| Components und Templates | Seiten und UI-Bausteine als Standalone Components |
| Datenmodell | `Product`, `OrderItem`, `Order` |
| Services | `ProductService`, `OrderService`, `CustomerAuthService`, `CustomerOrderService` |
| Dependency Injection | Services und Firebase-Konfiguration per Injection Token |
| Routing | zentrale Routen in `app.routes.ts` |
| Navigation | `routerLink` und `routerLinkActive` |
| Route Guards | `adminGuard`, `customerGuard` |
| Reactive Forms | Checkout, Kontakt, Karriere, Login, Produktformular |
| Custom Validator | Telefonnummer-Validator in `validators.ts` |
| Firebase/Firestore | Produktdaten und Kundenbestellungen |
| Tests | Unit Tests für Components und Services |

## Projektstruktur

```text
src/app
  account/          Kundenkonto
  admin/            Produktverwaltung
  about/            Über-uns-Seite
  career/           Bewerbungsformular
  contact/          Feedback/Kontakt
  model/            Product, OrderItem, Order
  my-orders/        persönliche Bestellhistorie
  order/            Kasse und Checkout
  shared/           Services, Guards, Validatoren, Firebase-Konfiguration
```

## Installation und Start

```bash
npm install
npm start
```

Danach im Browser öffnen:

```text
http://localhost:4200
```

## Tests und Build

Unit Tests:

```bash
npm test
```

Production Build:

```bash
npm run build
```

## Firebase

Das Projekt verwendet Firebase für:

- Produktdaten in der Collection `products`
- Kundenlogin über Firebase Authentication
- persönliche Bestellhistorie unter `users/{uid}/orders`

Die Firebase-Konfiguration liegt in:

```text
src/environments/environment.ts
src/app/shared/firebase.config.ts
```

Wichtig für Tests: Die Firebase-Konfiguration wird per Injection Token injiziert. Dadurch können Tests lokale Daten verwenden und greifen nicht versehentlich auf das echte Firebase-Projekt zu.

## Datenschutz und Projektcharakter

Die Anwendung ist ausdrücklich fiktiv:

- keine echten Bestellungen
- keine echte Restaurantkommunikation
- Musterdaten statt echter Kontaktdaten
- Teamdarstellung mit Initialen und Alias
- sichtbarer Schulprojekt-Hinweis auf der Seite

## Dokumentation

Weitere Dokumentation steht in:

- `docs/wiki.md`
- `docs/firebase-pruefung.md`
- `docs/projekt-vorgaben.md`
- GitHub-Wiki des Prüfungs-Repositories
