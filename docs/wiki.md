# McDenisa Wiki

Dieses Dokument sammelt, was im Angular/WebFrontends-Projekt umgesetzt wurde, welche Probleme aufgetreten sind und was noch offen ist. Orientierung: Kursbuch `docs/webfrontends-buch.pdf` und Projektregeln `docs/projekt-vorgaben.md`.

---

## Aktueller Prüfungsstand

Stand: 07.07.2026

- Aktuelles Prüfungs-Repository: `https://github.com/denisaandreea-a/McDenisa-Website-Pruefung`
- Das alte Repository `McDenisa-Website` wurde auf privat gestellt.
- Das neue Prüfungs-Repository wurde aus dem bereinigten aktuellen Stand erstellt.
- GitHub zeigt im neuen Prüfungs-Repository nur noch **1 Contributor**: `denisaandreea-a`.
- Alte Claude/Co-Author-Einträge sind im aktuellen Branch nicht mehr enthalten.
- Letzter sauberer Stand vor Firebase: `ad5cb1c Update wiki for exam repository status`.
- Lokaler zusätzlicher Remote:
  - `origin` — altes privates Repository
  - `clean` — neues Prüfungs-Repository

### Git-Bereinigung

Problem:
- Im alten Repository wurde in der GitHub-Seitenleiste noch `claude` als Contributor angezeigt.
- Ursache waren frühere `Co-Authored-By`-Einträge in alten Commits bzw. GitHub-interne Contributor-Daten.

Lösung:
- Aktueller `main` wurde geprüft: keine Treffer für `Claude`, `Anthropic` oder `Co-Authored-By`.
- Lokale Backup-Refs unter `refs/original/...` wurden entfernt.
- Da GitHub die alte Contributor-Seitenleiste trotzdem noch gecacht hatte, wurde ein neues sauberes Prüfungs-Repository angelegt.
- Ergebnis im neuen Repository: Contributors-Anzeige steht auf `1` und enthält nur `denisaandreea-a`.

---

## Schon gemacht

### Grundstruktur

- Angular-Projekt mit Standalone-Components aufgebaut.
- Routing eingerichtet:
  - `/order` — Kassenseite
  - `/about` — Über uns
  - `/career` — Bewerbung
  - `/contact` — Kontakt / Feedback
  - `/login` — Admin-Login
  - `/admin` — Produktverwaltung (geschützt)
  - `/admin/product/new` — Neues Produkt (geschützt)
  - `/admin/product/:id` — Produkt bearbeiten (geschützt)
  - Wildcard-Route für 404-Seite.
- Navbar mit `routerLink` und `routerLinkActive`.
- Navbar ist sticky (`position: sticky; top: 0; z-index: 100`).
- Schriftart: Nunito (Google Fonts), eingebunden in `index.html`.

### Modelle

- `src/app/model/product.ts` — Produktmodell
- `src/app/model/order.ts` — Bestellmodell mit Kundendaten, Lieferart und Uhrzeit
- `src/app/model/order-item.ts` — Bestellposition mit Produkt, Menge, entfernten Zutaten, McCafé-Extras und Milchoption

### Services (Kap. 8.5–8.6)

- `ProductService` (`src/app/shared/product.ts`) — verwaltet alle Produkte, sendet Änderungen über `changed$` als RxJS-Subject.
- `OrderService` (`src/app/shared/order.ts`) — verwaltet Warenkorb und abgeschlossene Bestellungen.
- `AuthService` (`src/app/shared/auth.service.ts`) — kapselt Login-Status (`isLoggedIn()`, `login()`, `logout()`) über `sessionStorage`.

### Firebase / Firestore (Kap. 12)

Dateien:
- `package.json`
- `package-lock.json`
- `src/environments/environment.ts`
- `src/app/shared/product.ts`
- `src/app/admin/admin.ts`

Status: technisch vorbereitet, Aktivierung mit eigenem Firebase-Projekt noch offen.

Umsetzung:
- Das offizielle Firebase SDK (`firebase`) wurde installiert.
- `@angular/fire` wurde nicht installiert, weil die aktuelle Version Peer Dependencies für Angular 20 erwartet, das Projekt aber Angular 22 nutzt. Damit kein instabiler `--force`-Install entsteht, wird Firestore direkt über das Firebase SDK im Angular-Service verwendet.
- Firebase wird im `ProductService` per dynamischem `import()` geladen. Dadurch landet Firestore in einem Lazy Chunk und bläht den initialen Angular-Bundle nicht unnötig auf.
- Die Firebase-Konfiguration liegt in `src/environments/environment.ts`.
- `environment.firebase.enabled` ist aktuell `false`. Dadurch läuft das Projekt weiterhin mit den lokalen Startdaten und bleibt ohne Firebase-Projekt buildbar.
- Wenn `enabled` auf `true` gesetzt wird, verwendet `ProductService` Firestore.
- Collection-Name: `products`.
- CRUD-Methoden im `ProductService`:
  - `getAll()` — liest alle Produkte aus Firestore und sortiert sie nach Kategorie/Name
  - `getById(id)` — liest ein Produkt per Dokument-ID
  - `add(product)` — speichert ein neues Produkt mit `setDoc`
  - `update(product)` — überschreibt ein bestehendes Produkt mit `setDoc`
  - `remove(product)` — löscht ein Produkt mit `deleteDoc`
- Wenn Firestore aktiviert ist und die Collection leer ist, schreibt `seedDefaultProducts()` die vorhandenen McDenisa-Startprodukte einmalig in Firestore.
- Components bleiben bewusst schlank: Admin, Produktformular und Bestellseite rufen weiterhin nur den `ProductService` auf. Der Datenbankzugriff ist im Service gekapselt, wie im Buch bei Services/Dependency Injection vorgesehen.

Aktivierungsschritte:
1. Firebase-Projekt in der Firebase Console erstellen.
2. Web-App im Firebase-Projekt registrieren.
3. Firestore Database anlegen.
4. Web-App-Konfiguration in `src/environments/environment.ts` eintragen.
5. `enabled: true` setzen.
6. App starten und im Admin-Bereich prüfen, ob Produkte aus Firestore geladen werden.

Beispielstruktur in Firestore:

```text
products
  b1
    name: "Big Mac"
    price: 5.49
    category: "Burger"
```

### Kassenseite

- Kategorien mit Bildern (Menüs, Happy Meal, Burger, Chicken, Beilagen, Getränke, McCafé, Desserts).
- Mengenauswahl 1 bis 9 vor dem Hinzufügen.
- Akkordeon-Dialog: Produkt wählen → Optionen beantworten (z. B. Soße, Getränk, Größe).
- Warenkorb links: Artikel, Menge, Preis, Entfernen-Button.
- Zutaten-Editor im Warenkorb:
  - Burger/Menü-Produkte können Zutaten entfernen (`Ohne: ...`).
  - McCafé-Produkte haben zählbare Extras (`Zucker`, `Kaffeesahne`, `Süßstoff`) mit Plus/Minus.
  - McCafé-Milchoptionen (`Hafermilch`, `Laktosefreie Milch`) sind entweder/oder und nur einmal auswählbar.
- Checkout-Formular als modales Fenster:
  - Name, Handynummer
  - Lieferart (Abholen / Liefern)
  - Uhrzeit
  - Lieferadresse (nur bei Liefern Pflicht)
  - Lieferung kostet `+2,00 €`; die Gebühr steht im Dropdown und in der Zusammenfassung.
- Checkout-Modal hat eine feste Höhe; Adresse und Button-Bereich verändern die Position von „Bestellung bestätigen" nicht.
- Bon wird nach Bestellabschluss angezeigt.
- Banner (`mcdenisa-banner-wide.png`) ist als `order-hero` oberhalb des POS-Layouts platziert.

### Kontakt / Feedback

- Feedbackformular bewertet eine Bestellung:
  - Name
  - Datum der Bestellung
  - Uhrzeit der Bestellung
  - Bestellung (optional)
  - Sternebewertung
  - Kommentar (optional)
- Abgeschickte Feedbacks werden rechts unter „Öffentliche Feedbacks" angezeigt.
- Feedbacks werden im Browser über `localStorage` gespeichert (`mcdenisaFeedbacks`) und bleiben nach Reload sichtbar.
- Die frühere Frage „Warst du drinnen oder draußen?" wurde entfernt.

### Admin-Bereich

- Produkte anzeigen, anlegen, bearbeiten, löschen.
- Produktformular mit Reactive Forms und Validierung.
- Logout-Button im Admin-Bereich meldet über `AuthService.logout()` ab und navigiert zurück zu `/login`.

### Route Guard (Kap. 10.2)

Datei: `src/app/shared/admin.guard.ts`

```typescript
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
```

- `CanActivateFn` — funktionaler Guard (Angular 14+, Buchstil Kap. 10.2).
- `inject()` für Router und `AuthService` — kein Konstruktor nötig.
- Schützt `/admin`, `/admin/product/new`, `/admin/product/:id`.
- Bei fehlendem Login: Weiterleitung zu `/login` über `router.createUrlTree`.
- Login-Status wird in `sessionStorage` gespeichert (bleibt beim Reload erhalten).

### Login-Seite

Datei: `src/app/login/login.ts`

- Reactive Form mit einem `pin`-Feld.
- PIN: `1234`.
- Bei richtigem PIN: nutzt `AuthService.login()` und navigiert zu `/admin`.
- Bei falschem PIN: zeigt Fehlermeldung, setzt das Formular zurück.

### Custom Validator (Kap. 11.4)

Datei: `src/app/shared/validators.ts`

```typescript
export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /^[+\d\s\-()]+$/.test(control.value) ? null : { invalidPhone: true };
}
```

- Einfache Validator-Funktion (kein Service nötig).
- Wird im Bewerbungsformular auf das `phone`-Feld angewendet.
- Erlaubt: Ziffern, `+`, Leerzeichen, `-`, Klammern.
- Bei Verstoß: `{ invalidPhone: true }` — zeigt Fehlermeldung im Template.

### Reactive Forms (Kap. 11)

Eingesetzt bei:
- Produktformular (Admin)
- Login
- Kontaktformular
- Bewerbungsformular

Bewerbungsformular (`career.ts`) hat folgende Felder:
- `name` — Pflicht, min. 2 Zeichen
- `email` — Pflicht, E-Mail-Format
- `phone` — optional, Custom Validator `phoneValidator`
- `area` — Pflicht, Dropdown: Küche / vorne / egal
- `availableFrom` — Pflicht, Datum
- `message` — optional

### Banner

- Bild: `public/assets/menu/mcdenisa-banner-wide.png` — 2172×240 px (Verhältnis ~9:1), minimalistisches Design.
- Inhalt: „McDenisa | Lecker. Schnell. Einfach." links, Essens-Icons rechts (Burger, Pommes, Cola, Kaffee, Eis), cremefarbener Hintergrund.
- Auf der Kassenseite: Banner als `order-hero` oberhalb des POS-Layouts, Höhe 150 px, volle Breite.
- Auf allen anderen Seiten: Banner global in `app.html` mit `@if (showBanner)`, Höhe 150 px, volle Breite.
- `showBanner`-Getter in `app.ts` gibt `false` zurück wenn die URL mit `/order` beginnt.

**Verlauf der Banner-Datei:**
1. `mcdenisa-banner.png` — Original 2172×724 (3:1), zu hoch für Website-Banner.
2. `mcdenisa-banner-wide.png` (erste Version) — per `sips` auf 2172×360 (6:1) aus dem Original zugeschnitten.
3. `mcdenisa-banner-wide.png` (aktuelle Version) — neues, minimalistisches Design (erstellt mit KI-Bildgenerator), original 2172×724, Inhalt als schmaler Streifen vertikal zentriert. Per `sips` auf 2172×240 zugeschnitten (`--cropOffset 240 0`), sodass nur der Inhaltsstreifen ohne Whitespace sichtbar ist.

### Footer

Datei: `src/app/footer/`

- Globale Fußzeile, eingebunden in `app.html` unter `<router-outlet>` — erscheint auf allen Seiten beim Scrollen.
- Vier Spalten:
  - **McDenisa** — Adresse (Oststraße 12, 59227 Ahlen), Telefon, E-Mail
  - **Öffnungszeiten** — Mo–Fr, Sa–So, Feiertage
  - **Navigation** — Links zu Bestellen, Über uns, Karriere, Kontakt
  - **Rechtliches** — Impressum, Datenschutz, AGB + Schulprojekt-Hinweis
- Untere Zeile: Copyright `© {{ year }} McDenisa Ahlen` (Jahr dynamisch per `new Date().getFullYear()`) + Markenhinweis.
- Design: dunkler Hintergrund (`#2a0a0a`), cremefarbener Text, Gold-Hover auf Links.

### Team-Flip-Card-Section

Dateien:
- `src/app/about/about.ts`
- `src/app/about/about.html`
- `src/app/about/about.css`
- `public/assets/team/othmane.jpeg`

Status: erledigt

- Auf der Seite `/about` wurde eine moderne Team-Section ergänzt.
- Die Team-Mitglieder werden in `about.ts` als Array `teamMembers` gepflegt. Dadurch können später weitere Schichtführer einfach ergänzt werden.
- Die Section ist als Karussell aufgebaut:
  - aktive Karte über `activeTeamIndex`
  - Weiter-/Zurück-Buttons
  - Punkt-Navigation
  - horizontale Slider-Animation über CSS-Transform
- Jede Teamkarte ist eine klickbare 3D-Flip-Card:
  - Vorderseite: nur das Cartoon-Bild der Person
  - Rückseite: moderner Steckbrief mit Name, Alias, Lieblingsstation, Signature Order, Eigenschaften, Superkraft, Ziel und Motto
  - Umdrehen per Klick, nicht nur per Hover
  - zusätzlich per Tastatur nutzbar (`Enter` oder Leertaste)
- Mobile Optimierung:
  - größere Kartenhöhe auf kleinen Bildschirmen
  - Rückseite wird einspaltig, damit Text und Badges nicht gequetscht werden
  - Klick-Bedienung funktioniert auch auf Handy
- Design:
  - dunkelblau/lila Hintergrund
  - gelbe McDonald's-inspirierte Akzente
  - abgerundete Ecken
  - Schatten, Badges und glossy Kartenoptik

Erstes Team-Mitglied:
- Name: Othmane
- Alias: Drive Star
- Lieblingsstation: McDrive
- Signature Order: McCrispy Chicken & Chicken McNuggets
- Eigenschaften: Locker, Positiv, Extrovertiert, Witzig, Ehrgeizig, Modebewusst
- Motto: „Gute Laune, Tempo und Teamwork - so läuft der Drive.“

Zweites Team-Mitglied:
- Name: Maria
- Alias: Küchenherz
- Rolle: Schichtleiterin · Küche · Team Support
- Stärkste Station: Küche
- Lieblingsessen: Greek Style Wrap
- Eigenschaften: Empathisch, Herzlich, Hilfsbereit, Küchenstark, Geduldig, Verantwortungsbewusst
- Motto: „Gemeinsam sind wir stark.“

### Design-Details

- Schriftart: `Nunito` (Google Fonts), Fallback: `Segoe UI`.
- Farbpalette:
  - `--mc-maroon: #800000` (Navbar, Cart-Header, aktive Buttons)
  - `--mc-brown: #8B4513`
  - `--mc-white: #ffffff`
  - Hintergrund: `#FAEBD7` (AntiqueWhite)
- Warenkorb-Sidebar: `background: #fffaf2`, `border-right: 1px solid #ead8bd`.
- Leerer Warenkorb: styled mit `.cart-empty-state` (cremefarbener Hintergrund, Icon, Text).
- Mengen-Buttons: 42×42 px, `border-radius: 10px`, Hover- und `:active`-Effekte.
- Kategorie-Karten: `height: 172px`, Hover (`translateY(-3px)`), Klick-Effekt (`scale(0.96)`).

---

## Prüfungserklärungen

Dieser Abschnitt ist als Lernhilfe für die mündliche Prüfung gedacht. Die Formulierungen erklären die wichtigsten Begriffe so, dass man sie direkt mündlich verwenden kann.

### Firebase und Firestore

**Was ist Firebase?**

Firebase ist ein Online-Backend von Google. Eine Angular-App ist normalerweise nur das Frontend im Browser. Firebase kann den Backend-Teil übernehmen, also zum Beispiel Daten speichern, laden oder Benutzer verwalten.

**Was ist Firestore?**

Firestore ist die Datenbank von Firebase. Sie speichert Daten online in Collections und Dokumenten. Im Projekt wäre die Collection `products` für die Produktdaten zuständig.

Beispiel:

```text
products
  b1
    name: "Big Mac"
    price: 5.49
    category: "Burger"
```

**Was war vorher?**

Vorher lagen die Produkte direkt im TypeScript-Code in `ProductService`, zum Beispiel:

```typescript
new Product('b1', 'Big Mac', 5.49, 'Burger')
```

Das funktioniert lokal, ist aber keine echte Online-Datenbank. Änderungen im Admin-Bereich wären ohne Firebase nicht dauerhaft online für andere Geräte gespeichert.

**Was ist jetzt vorbereitet?**

Das Projekt hat jetzt das Firebase SDK installiert. Der `ProductService` kann Produkte grundsätzlich aus Firestore laden, speichern, bearbeiten und löschen. Firebase ist aber noch nicht aktiv, weil in `src/environments/environment.ts` noch echte Firebase-Projektdaten eingetragen werden müssen.

Aktuell steht dort:

```typescript
enabled: false
```

Deshalb nutzt die App weiter die lokalen Startdaten. Sobald `enabled` auf `true` gesetzt wird und die Firebase-Konfiguration stimmt, arbeitet der `ProductService` mit Firestore.

**Was ist der Vorteil?**

- Produkte können dauerhaft online gespeichert werden.
- Änderungen im Admin-Bereich können später in Firestore landen.
- Mehrere Geräte können dieselben Produktdaten sehen.
- Die Components bleiben sauber, weil sie nicht direkt mit Firebase sprechen.
- Der Datenbankzugriff ist in einem Service gekapselt, passend zu Services und Dependency Injection aus dem Buch.

**Prüfungssatz:**

> Firebase ist das Backend von Google. In meinem Projekt ist Firestore als Produktdatenbank vorbereitet. Der `ProductService` kapselt den Zugriff auf Firestore, sodass die Components nur Methoden wie `getAll()`, `add()`, `update()` und `remove()` aufrufen müssen.

### Angular-Components

Components sind die Bausteine der Oberfläche. Jede Seite oder jeder UI-Teil besteht aus einer Component mit TypeScript, HTML und CSS.

Beispiele:
- `Order` — Kassenseite
- `Admin` — Produktverwaltung
- `ProductForm` — Produkt anlegen/bearbeiten
- `About` — Über-uns-Seite mit Team-Flip-Cards
- `Contact` — Feedbackformular

Eine Component enthält:
- Daten und Methoden in der `.ts`-Datei
- Anzeige in der `.html`-Datei
- Styling in der `.css`-Datei

**Prüfungssatz:**

> Eine Component verbindet Logik, Template und Styling. In meinem Projekt sind die Seiten als Standalone-Components umgesetzt, also ohne NgModules.

### Models / Datenklassen

Models beschreiben, welche Datenform ein Objekt hat. Im Projekt gibt es zum Beispiel:
- `Product` — ein Produkt mit `id`, `name`, `price`, `category`
- `OrderItem` — eine Position im Warenkorb
- `Order` — eine abgeschlossene Bestellung

Der Vorteil ist, dass die Daten im Code klar strukturiert sind.

**Prüfungssatz:**

> Models geben meinen Daten eine feste Struktur. Dadurch weiß TypeScript, welche Eigenschaften ein Produkt oder eine Bestellung haben muss.

### Services und Dependency Injection

Services enthalten Logik, die von mehreren Components genutzt werden kann. Dadurch steht die Logik nicht doppelt in mehreren Components.

Beispiele:
- `ProductService` verwaltet Produkte und später Firestore.
- `OrderService` verwaltet Warenkorb und Bestellungen.
- `AuthService` verwaltet den Login-Status.

Dependency Injection bedeutet, dass Angular den Service automatisch in die Component einfügt.

Beispiel:

```typescript
constructor(public productService: ProductService) {}
```

**Prüfungssatz:**

> Services trennen Geschäftslogik von der Oberfläche. Angular gibt mir die Services über Dependency Injection, dadurch können mehrere Components denselben Service verwenden.

### ProductService

Der `ProductService` ist die zentrale Stelle für Produktdaten.

Wichtige Methoden:
- `getAll()` — gibt alle Produkte zurück
- `getById(id)` — sucht ein Produkt nach ID
- `add(product)` — fügt ein Produkt hinzu
- `update(product)` — bearbeitet ein Produkt
- `remove(product)` — löscht ein Produkt

Mit Firebase:
- Wenn Firebase deaktiviert ist, nimmt der Service lokale Startdaten.
- Wenn Firebase aktiviert ist, arbeitet der Service mit Firestore.
- `seedDefaultProducts()` schreibt die Startprodukte einmalig in Firestore, wenn die Collection leer ist.

**Prüfungssatz:**

> Der `ProductService` ist eine Abstraktion zwischen UI und Datenquelle. Die Components wissen nicht, ob die Produkte lokal oder aus Firebase kommen.

### OrderService

Der `OrderService` verwaltet den Warenkorb.

Wichtige Aufgaben:
- Produkt in den Warenkorb legen
- Menge speichern
- Gesamtpreis berechnen
- Liefergebühr berücksichtigen
- Bestellung abschließen
- Warenkorb leeren

**Prüfungssatz:**

> Der `OrderService` kapselt die Warenkorb-Logik. Die Kassenseite zeigt nur die Daten an und ruft Methoden wie `addProduct()` oder `checkout()` auf.

### RxJS Subject und `changed$`

Ein `Subject` ist wie ein Signal. Ein Service kann damit melden: „Es hat sich etwas geändert.“

Im Projekt gibt es zum Beispiel:

```typescript
private changed = new Subject<void>();
public changed$ = this.changed.asObservable();
```

Wenn ein Produkt hinzugefügt, bearbeitet oder gelöscht wird, ruft der Service auf:

```typescript
this.changed.next();
```

Die Component hört darauf:

```typescript
this.productService.changed$.subscribe(() => this.loadProducts());
```

**Prüfungssatz:**

> Mit `Subject` informiert der Service die Components über Änderungen. Dadurch lädt die Admin-Tabelle automatisch neu, wenn Produkte geändert wurden.

### Routing

Routing bedeutet, dass Angular je nach URL eine andere Component anzeigt.

Beispiele:
- `/order` zeigt die Kassenseite
- `/about` zeigt Über uns
- `/admin` zeigt die Produktverwaltung
- `/login` zeigt die Login-Seite

Interne Links werden mit `routerLink` gebaut, nicht mit normalem `href`.

**Prüfungssatz:**

> Das Routing verbindet URLs mit Components. Dadurch wirkt die App wie eine mehrseitige Webseite, obwohl Angular im Browser läuft.

### Route Guard

Ein Guard schützt bestimmte Routen. Im Projekt schützt `adminGuard` den Admin-Bereich.

Wenn man nicht eingeloggt ist:
- `/admin` wird nicht geöffnet
- Angular leitet zu `/login` weiter

Wenn man eingeloggt ist:
- Admin-Seite wird angezeigt

**Prüfungssatz:**

> Der Guard entscheidet vor dem Öffnen einer Route, ob der Benutzer Zugriff hat. Mein Admin-Bereich ist dadurch nur nach Login erreichbar.

### AuthService und `sessionStorage`

Der `AuthService` speichert, ob der Admin eingeloggt ist.

`sessionStorage` speichert Daten nur für die aktuelle Browser-Sitzung. Wenn der Browser geschlossen wird, ist der Login wieder weg.

Wichtige Methoden:
- `login()` — setzt den Login-Status
- `logout()` — entfernt den Login-Status
- `isLoggedIn()` — prüft, ob man eingeloggt ist

**Prüfungssatz:**

> Der `AuthService` kapselt den Login-Zustand. `sessionStorage` ist passend, weil der Admin-Login nicht dauerhaft gespeichert werden soll.

### Reactive Forms

Reactive Forms sind Formulare, die in TypeScript definiert werden. Dadurch kann man Validierung und Formularzustand sauber kontrollieren.

Beispiele im Projekt:
- Login-Formular
- Produktformular
- Kontaktformular
- Bewerbungsformular
- Checkout-Formular

Beispiel:

```typescript
new FormControl('', [Validators.required])
```

**Prüfungssatz:**

> Reactive Forms definieren Formularfelder und Validierung in TypeScript. Dadurch ist die Formularlogik klar testbar und gut wartbar.

### Custom Validator

Ein Custom Validator ist eine eigene Validierungsfunktion. Im Projekt prüft `phoneValidator`, ob eine Telefonnummer nur erlaubte Zeichen enthält.

Erlaubt sind:
- Zahlen
- `+`
- Leerzeichen
- `-`
- Klammern

Wenn die Eingabe falsch ist, gibt der Validator ein Fehlerobjekt zurück:

```typescript
{ invalidPhone: true }
```

**Prüfungssatz:**

> Ein Custom Validator erweitert die Standardvalidierung von Angular. Ich nutze ihn für Telefonnummern, weil Angular dafür keinen fertigen Validator hat.

### `localStorage`

`localStorage` speichert Daten dauerhaft im Browser. Im Projekt werden Feedbacks dort gespeichert.

Vorteil:
- Feedbacks bleiben nach Reload sichtbar.

Nachteil:
- Die Daten sind nur im jeweiligen Browser gespeichert, nicht online für alle Benutzer.

**Prüfungssatz:**

> `localStorage` ist eine einfache Browser-Speicherung. Für Feedback reicht das im Projekt, aber für echte gemeinsame Daten wäre Firebase besser.

### Admin-Bereich

Der Admin-Bereich ist die Produktverwaltung.

Funktionen:
- Produkte anzeigen
- Neues Produkt anlegen
- Produkt bearbeiten
- Produkt löschen
- Logout

Der Admin-Bereich nutzt:
- `adminGuard`
- `AuthService`
- `ProductService`
- Reactive Forms im Produktformular

**Prüfungssatz:**

> Der Admin-Bereich zeigt, wie CRUD in Angular funktioniert: Create, Read, Update und Delete von Produkten über den `ProductService`.

### Team-Flip-Card

Die Team-Section auf `/about` nutzt ein Array in `about.ts`. Dadurch können weitere Schichtführer einfach ergänzt werden.

Prinzip:
- Vorderseite zeigt nur das Cartoon-Bild.
- Beim Klick wird die Karte per CSS-3D-Transform gedreht.
- Rückseite zeigt den Steckbrief.
- Das funktioniert auch auf Handy, weil es nicht nur Hover verwendet.

**Prüfungssatz:**

> Die Teamkarten sind datengetrieben. Das bedeutet, ich muss für neue Personen nur einen neuen Eintrag im Array hinzufügen, und das Template erzeugt die Karte automatisch.

### Warum Lazy Import bei Firebase?

Firebase ist relativ groß. Wenn man Firebase direkt oben importiert, landet es im Start-Bundle der App. Dadurch kann der Angular-Build wegen der Bundle-Budgets fehlschlagen.

Deshalb wird Firebase im `ProductService` dynamisch geladen:

```typescript
await import('firebase/firestore')
```

Vorteil:
- Firebase wird nur geladen, wenn es wirklich gebraucht wird.
- Der erste App-Start bleibt kleiner.
- Der Production-Build bleibt erfolgreich.

**Prüfungssatz:**

> Ich lade Firebase lazy, damit die Datenbankbibliothek nicht den initialen Bundle unnötig vergrößert.

---

## Probleme und Lösungen

### Banner-Format falsch (3:1 statt 6:1 oder schmaler)

**Problem:** Das ursprüngliche Banner-Bild hatte das Format 2172×724 (Verhältnis ~3:1). Für einen flachen Website-Banner werden 6:1 oder schmaler benötigt. Bei niedriger Displayhöhe war das Bild abgeschnitten, bei vollständiger Anzeige zu hoch.

**Lösung:** Zuerst per `sips` auf 2172×360 zugeschnitten. Danach durch ein neu erstelltes, minimalistisches Banner (KI-generiert) ersetzt, das auf 2172×240 zugeschnitten wurde. Der sichtbare Streifen zeigt nun das gesamte Motiv ohne Crop.

### Banner erschien dreifach

**Problem:** Das Banner `mcdenisa-banner.png` war an drei Stellen gleichzeitig eingebunden:
1. Als Bild in der Navbar-Brand.
2. Global in `app.html` als `<div class="site-banner">`.
3. Als `order-hero`-Div in `order.html`.

Außerdem waren zwei davon sichtbar gleichzeitig auf der Kassenseite, was unruhig und unprofessionell wirkte.

**Lösung:**
- Navbar-Brand: zurück auf reinen Text `McDenisa`.
- `order-hero` in `order.html` bleibt als einzelner Banner oberhalb des POS-Layouts.
- Globaler Banner in `app.html` wird nur angezeigt, wenn die Route **nicht** `/order` ist (`@if (showBanner)`).

### Banner war zu hoch (falsche Proportionen)

**Problem:** Das originale Banner-Bild (`mcdenisa-banner.png`) hatte das Format 2172×724 px (Verhältnis ~3:1). Für ein flaches Website-Banner braucht man ~6:1. Dadurch war das Bild bei niedriger Displayhöhe abgeschnitten, oder bei vollständiger Anzeige zu hoch.

**Lösung:** Das Bild wurde per `sips` (macOS-Bordwerkzeug) zugeschnitten:

```bash
sips -c 360 2172 --cropOffset 90 0 mcdenisa-banner.png --out mcdenisa-banner-wide.png
```

- Neues Format: 2172×360 px (Verhältnis 6:1).
- Startpunkt y=90 — überspringt den dekorativen Blob oben, behält Krone, Text und Essensbilder.
- Gespeichert als separates Bild (`mcdenisa-banner-wide.png`), Original bleibt erhalten.

### „McDenisa" Navbar-Text war schwarz

**Problem:** Bootstrap setzt `.navbar-brand` standardmäßig auf `color: rgba(0,0,0,0.9)`. Unsere `.navbar-mc`-Klasse überschrieb das nicht.

**Lösung:**

```css
.navbar-mc .navbar-brand {
  color: #fff !important;
}
```

### POS-Layout-Höhe nach Banner-Integration

**Problem:** Nach Einfügen des globalen Banners wurde die POS-Höhe falsch berechnet — entweder zu klein oder das Layout ragte über den Viewport hinaus.

**Lösung:** Da der globale Banner auf der Kassenseite ausgeblendet wird (`showBanner = false`) und der `order-hero` dort 150 px hoch ist, wird die POS-Höhe um Navbar und Banner reduziert:

```css
.pos-layout {
  height: calc(100vh - 62px - 150px);
}
```

### GitHub zeigte alten Contributor an

**Problem:** Obwohl der aktuelle `main` keine `Co-Authored-By`-Zeilen mehr enthielt, zeigte die GitHub-Seitenleiste im alten Repository weiterhin `claude` als zweiten Contributor.

**Prüfung:**
- `git log --all` lokal: keine Treffer für `Claude`, `Anthropic` oder `Co-Authored-By`.
- `origin/main`: sauber.
- Remote-Branches/Tags: nur `main`, keine alten Tags oder Nebenbranches.
- GitHub Contributors API: nur `denisaandreea-a`.
- GitHub-Seitenleisten-Fragment im alten Repository: zeigte trotzdem noch `Contributors 2`.

**Lösung:** Neues Prüfungs-Repository `McDenisa-Website-Pruefung` erstellt und den sauberen Stand dorthin gepusht. Im neuen Repository zeigt GitHub `Contributors 1` und nur `denisaandreea-a`.

---

## Noch zu tun

### 1. Firebase-Projekt aktivieren (Kap. 12)

Status: offen

Ziel:
- Firebase-Projekt in der Console anlegen.
- Firebase-Web-App-Konfiguration in `src/environments/environment.ts` eintragen.
- `environment.firebase.enabled` auf `true` setzen.
- Firestore-Regeln für die Prüfung passend konfigurieren.

Voraussetzung: Firebase-Projekt muss vom Entwickler selbst angelegt werden (Console: console.firebase.google.com).

### 2. Weitere Team-Mitglieder ergänzen

Status: optional / offen

Ziel:
- Die 5 weiteren Schichtführer in das `teamMembers`-Array eintragen.
- Pro Person ein Cartoon-Bild unter `public/assets/team/` speichern.
- Steckbrieftexte ergänzen.
- Das bestehende Karussell ist dafür bereits vorbereitet.

### 3. Quiz-Seite

Status: offen

Ziel:
- Neue Route `/quiz`.
- Fragen zu Produkten, Menüs, Preisen.
- Ergebnisseite mit Auswertung.
- Name-Eingabe per Reactive Form vor dem Quiz.

### 4. Produktdaten erweitern

Status: offen

Ziel:
- Pro Produkt: Allergene, Kalorien.
- Anzeige in Produktdetails oder Admin-Bereich.

---

## Diagramme

### UML-Klassendiagramm

```mermaid
classDiagram
  class Product {
    +string id
    +string name
    +number price
    +string category
  }

  class OrderItem {
    +Product product
    +number quantity
    +string[] removedIngredients
    +Record extraIngredients
    +string milkOption
  }

  class Order {
    +string id
    +OrderItem[] items
    +number total
    +string createdAt
    +string checkoutType
    +string pickupTime
    +string customerName
    +string phone
    +string address
  }

  class ProductService {
    -Product[] objects
    +changed$ Subject
    +getAll() Product[]
    +getById(id) Product
    +add(product) void
    +update(product) void
    +remove(product) void
  }

  class OrderService {
    +number deliveryFee
    -OrderItem[] currentItems
    -number orderCounter
    +changed$ Subject
    +getItems() OrderItem[]
    +getTotal() number
    +getCheckoutTotal(checkoutType) number
    +addProduct(product, quantity) void
    +removeItem(item) void
    +checkout(type, time, name, phone, address) Order
    +clearCart() void
  }

  Order "1" o-- "*" OrderItem
  OrderItem "1" --> "1" Product
  ProductService --> Product
  OrderService --> Order
  OrderService --> OrderItem
```

### Routing-Übersicht

```mermaid
flowchart LR
  Start["/"] --> Order["/order\nKasse"]
  Navbar["Navbar"] --> Order
  Navbar --> About["/about\nÜber uns"]
  Navbar --> Career["/career\nBewerbung"]
  Navbar --> Contact["/contact\nFeedback"]
  Navbar --> Admin["/admin\nProduktverwaltung"]
  Admin --> Guard{"adminGuard\ncanActivate"}
  Guard -->|"nicht angemeldet\nAuthService false"| Login["/login"]
  Guard -->|"angemeldet\nAuthService true"| AdminList["Admin-Liste"]
  Login -->|"PIN 1234 korrekt"| AdminList
  AdminList --> NewProduct["/admin/product/new"]
  AdminList --> EditProduct["/admin/product/:id"]
  Unknown["unbekannte URL"] --> NotFound["404 PageNotFound"]
```

### Bestellablauf

```mermaid
flowchart TD
  A["Menge 1–9 wählen"] --> B["Kategorie wählen"]
  B --> C["Produkt auswählen"]
  C --> D{"Hat Produkt Optionen?"}
  D -->|ja| E["Optionen beantworten\nz. B. Soße, Beilage, Getränk"]
  D -->|nein| F["Produkt in Warenkorb"]
  E --> F
  F --> G{"Weitere Produkte?"}
  G -->|ja| A
  G -->|nein| H["Bestellung abschließen"]
  H --> I["Checkout-Formular\nName, Handy, Lieferart, Uhrzeit"]
  I --> J{"Formular gültig?"}
  J -->|nein| I
  J -->|Liefern| M["Adresse Pflicht\n+2,00 € Liefergebühr"]
  M --> K["OrderService.checkout()"]
  J -->|Abholen| K
  K --> L["Bon anzeigen\nGesamtpreis, Lieferart, Uhrzeit"]
```

### Arbeitsreihenfolge

```mermaid
flowchart TD
  D1["Custom Validator\nerledigt"] --> D2["Route Guard + Login\nerledigt"]
  D2 --> D3["Banner-Integration\nerledigt"]
  D3 --> D4["Design-Verbesserungen\nerledigt"]
  D4 --> D5["AuthService\nerledigt"]
  D5 --> D6["Zutaten-Editor\nerledigt"]
  D6 --> D7["Feedback-Liste\nerledigt"]
  D7 --> D8["Team-Flip-Cards\nerledigt"]
  D8 --> D9["GitHub-Prüfungsrepo sauber\nerledigt"]
  D9 --> D10["Firebase SDK + ProductService CRUD\nvorbereitet"]
  D10 --> N1["Firebase-Projekt aktivieren\noffen"]
  N1 --> N2["Produktdaten erweitern\noffen"]
  N2 --> N3["Quiz-Seite\noffen"]
  N3 --> N4["Weitere Team-Mitglieder\noffen"]
```

---

## Technische Pflichtaufgaben laut Kursbuch

| Aufgabe | Kap. | Status |
|---|---|---|
| Components, Templates, @for, Pipes | 6–7 | erledigt |
| Datenmodell (TypeScript-Klassen) | 8.3 | erledigt |
| Services + Dependency Injection | 8.5–8.6 | erledigt |
| Routing + RouterLink + RouterOutlet | 9 | erledigt |
| Navbar mit routerLinkActive | 9.5 | erledigt |
| Reactive Forms | 11 | erledigt |
| Custom Validator | 11.4 | erledigt |
| Route Guard (CanActivateFn) | 10.2 | erledigt |
| AuthService-Muster | 10.3 | erledigt |
| Firebase / Firestore | 12 | technisch vorbereitet, Aktivierung offen |
| Team-Karussell mit klickbarer 3D-Flip-Card | Zusatzfeature | erledigt |
| Sauberes Prüfungs-Repository ohne alten Claude-Contributor | Projektabgabe | erledigt |
