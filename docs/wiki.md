# McDenisa Projekt-Dokumentation

Diese Datei ist die kurze lokale Kopie zur GitHub-Wiki. Die ausführliche Dokumentation steht in der Wiki des Prüfungs-Repositories.

Repository: `https://github.com/denisaandreea-a/McDenisa-Website-Pruefung`

## Projektüberblick

| Punkt | Beschreibung |
|---|---|
| Projekt | McDenisa |
| Art | fiktive Kassen-Webanwendung |
| Modul | Web-Frontends mit Angular |
| Semester | Sommersemester 2026 |
| Framework | Angular mit Standalone Components |
| Datenhaltung | Firebase Firestore |
| Login | Firebase Authentication für Kunden, separater PIN-Login für Admin |
| Ziel | zentrale Angular-Themen in einer zusammenhängenden Anwendung zeigen |

## Wiki-Struktur

| Wiki-Seite | Inhalt |
|---|---|
| Home | Überblick über Projekt und Seiten |
| Prüfungsstand | aktueller Stand der Abgabe |
| Entwicklungsverlauf | wann welche Funktionen umgesetzt wurden |
| Scope | In Scope, Out of Scope, Definition of Done |
| Schon gemacht | technische Umsetzung nach Themen |
| Diagramme | Mermaid-Skizzen zu Architektur und Abläufen |
| Probleme & Lösungen | Probleme, Ursachen und Lösungen |
| Prüfungserklärungen | Lernhilfe für die mündliche Prüfung |
| Pflichtaufgaben | Kursbuch-Themen und Status |
| Noch zu tun | optionale Erweiterungen |

## Hauptfunktionen

| Bereich | Funktionen |
|---|---|
| Kasse | Kategorien, Produkte, Mengen, Optionen, Warenkorb |
| Checkout | Reactive Form, Abholen/Liefern, Liefergebühr, Danke-Fenster |
| Kundenkonto | Registrieren, Einloggen, Ausloggen |
| Rabatt | 10 % Rabatt für eingeloggte Kunden |
| Bestellhistorie | persönliche Bestellungen pro Firebase-`uid` |
| Admin | Produktliste, Produkt anlegen, bearbeiten und löschen |
| Kontakt | Feedbackformular mit sichtbaren Kommentaren |
| Über uns | Teamkarten mit Initialen und Alias |
| Transparenz | Schulprojekt-Hinweis und Musterdaten |

## Technische Themen

| Thema | Umsetzung |
|---|---|
| Components | eigene Seiten und UI-Bausteine |
| Routing | öffentliche Routen, Admin-Routen, Kundenhistorie |
| Guards | `adminGuard` und `customerGuard` |
| Services | Logik und Datenzugriff ausgelagert |
| Models | `Product`, `OrderItem`, `Order` |
| Reactive Forms | Checkout, Kontakt, Karriere, Login, Produktformular |
| Custom Validator | Telefonnummer-Prüfung |
| Firebase | Firestore-Produkte und Kundenbestellungen |
| Authentication | Kundenregistrierung und Login |
| Resilienz | Timeouts und lokale Fallbacks |

## Architekturüberblick

Wie Seiten, Services und Datenhaltung zusammenhängen: Komponenten rufen nie direkt Firebase auf, sondern immer über einen Service. Jeder Service hat einen lokalen Fallback (Array oder `localStorage`), falls Firebase nicht erreichbar ist.

```mermaid
flowchart LR
  subgraph Seiten["Komponenten (Seiten)"]
    Order["Order (Kasse)"]
    Admin["Admin / ProductForm"]
    Account["Account / Login"]
    MyOrders["MyOrders"]
  end

  subgraph Services["Services (shared/)"]
    ProductSvc["ProductService"]
    OrderSvc["OrderService"]
    CustAuth["CustomerAuthService"]
    CustOrder["CustomerOrderService"]
    Auth["AuthService"]
  end

  subgraph Daten["Datenhaltung"]
    Firestore[("Firebase Firestore")]
    FireAuth[("Firebase Authentication")]
    Local[("localStorage / sessionStorage")]
  end

  Order --> ProductSvc
  Order --> OrderSvc
  Order --> CustOrder
  Admin --> ProductSvc
  Account --> CustAuth
  MyOrders --> CustOrder
  Order -.PIN.-> Auth

  ProductSvc --> Firestore
  ProductSvc -. Fallback .-> Local
  CustOrder --> Firestore
  CustOrder -. Fallback .-> Local
  CustAuth --> FireAuth
  OrderSvc --> CustAuth
  Auth --> Local
```

### Routing-Tabelle

| Pfad | Komponente | Guard | Öffentlich? |
|---|---|---|---|
| `/order` | Order | – | ja |
| `/about` | About | – | ja |
| `/career` | Career | – | ja |
| `/contact` | Contact | – | ja |
| `/login` | Login | – | ja |
| `/konto` | Account | – | ja |
| `/meine-bestellungen` | MyOrders | `customerGuard` | nur eingeloggte Kunden |
| `/admin` | Admin | `adminGuard` | nur Admin-PIN |
| `/admin/product/new` | ProductForm | `adminGuard` | nur Admin-PIN |
| `/admin/product/:id` | ProductForm | `adminGuard` | nur Admin-PIN |
| `**` | PageNotFound | – | ja |

### Services im Überblick

| Service | Zustand | Aufgabe |
|---|---|---|
| `ProductService` | Array + Firestore | Produktkatalog lesen/anlegen/bearbeiten/löschen |
| `OrderService` | In-Memory (`currentItems`) | aktueller Warenkorb, Rabatt, Bestellnummer |
| `CustomerAuthService` | `signal<Customer\|null>` | Kunden-Registrierung/Login über Firebase Auth |
| `CustomerOrderService` | Firestore + `localStorage` | Bestellhistorie pro Kunde speichern/laden |
| `AuthService` | `sessionStorage`-Flag | einfacher Admin-Login-Status |

## Scope

### In Scope

| Funktion | Status |
|---|---|
| Kasse mit Warenkorb | umgesetzt |
| Produktoptionen | umgesetzt |
| Checkout mit Validierung | umgesetzt |
| Danke-Fenster nach Bestellung | umgesetzt |
| Kundenkonto | umgesetzt |
| 10-%-Rabatt | umgesetzt |
| persönliche Bestellhistorie | umgesetzt |
| Admin-Produktverwaltung | umgesetzt |
| Firestore-Anbindung | umgesetzt |
| Schulprojekt-Hinweis | umgesetzt |
| anonymisierte Team- und Kontaktdaten | umgesetzt |
| Wiki-Dokumentation | umgesetzt |

### Out of Scope

| Nicht enthalten | Grund |
|---|---|
| echte Restaurantbestellung | Projekt ist fiktiv |
| Online-Zahlung | zu groß und sicherheitskritisch für den Semesterumfang |
| echte Rabatte | Rabatt ist nur Demonstration der Logik |
| Social Login | nicht nötig für den Kernumfang |
| Push-Benachrichtigungen | optionales Zusatzthema |
| Produktivbetrieb | Seite ist ausdrücklich ein Schulprojekt |

## Ablaufskizze

```mermaid
flowchart TD
  Start["Angular-Projekt"] --> Routing["Routing und Seiten"]
  Routing --> Kasse["Kasse und Warenkorb"]
  Kasse --> Formulare["Reactive Forms"]
  Formulare --> Admin["Admin + Guard"]
  Admin --> Firebase["Firestore"]
  Firebase --> Konto["Kundenkonto"]
  Konto --> Historie["Rabatt + Bestellhistorie"]
  Historie --> Stabil["Timeouts + Fallbacks"]
  Stabil --> Wiki["Wiki-Dokumentation"]
```

## Wichtigste Probleme und Lösungen

| Problem | Lösung |
|---|---|
| Bestellhistorie blieb im Ladezustand | Angular-Signale, Timeout und lokale Sicherung |
| Bestellnummer startete wieder bei 1 | Zähler pro Kundenkonto speichern |
| Registrierung wirkte ohne Reaktion | sichtbare Validierung und Timeout-Meldungen |
| Produkte fehlten bei langsamer Verbindung | lokale Startprodukte als Fallback |
| Feedback-Kommentar war nicht lesbar | CSS-Farbe und Zeilenumbrüche korrigiert |
| Tests sollten nicht gegen echte Firebase laufen | Firebase-Konfiguration über Injection Token |
| Burger-Menü auf dem Handy ließ sich nicht anklicken | Bootstrap-CSS war eingebunden, aber Bootstrap-JS fehlte in `angular.json` → `bootstrap.bundle.min.js` als Script ergänzt |
| Kategorie-Leiste auf dem Handy kaum sichtbar/nutzbar | `.category-slider` und `.cat-card` waren nur für Desktop-Breite gebaut (8 Kacheln mit `flex: 1`) → Media Query ab 700px macht die Leiste horizontal scrollbar und die Kacheln kleiner |
| Warenkorb auf dem Handy nahm fast die ganze Breite weg | `.pos-cart` hatte auf jeder Bildschirmgröße eine feste Breite von 280px → ab 700px wird `.pos-layout` einspaltig, Kategorien/Produkte stehen zuerst, der Warenkorb kommt darunter mit eigener Scroll-Höhe |
| Live-Seite zeigte alten Stand trotz `git push` | `git push` aktualisiert nur GitHub, nicht Firebase Hosting → manuell mit `ng build` + `firebase deploy --only hosting` veröffentlicht |
| Kontakt-Feedback nur auf dem eigenen Gerät sichtbar | lag nur in `localStorage` → neuer `FeedbackService` speichert zusätzlich in Firestore; zusätzlich `feedbacks`/`loadingFeedbacks` von normalen Feldern auf `signal()` umgestellt, weil ohne `zone.js` sonst kein Re-Render nach dem Laden passierte |

### Wichtig: GitHub Push ≠ Live-Deploy

Diese App wird über **Firebase Hosting** bereitgestellt (`firebase.json`, Projekt `mcdenisa-f479f`), nicht direkt über GitHub. `git push` aktualisiert nur das Repository. Damit eine Änderung auf `mcdenisa-f479f.web.app` live sichtbar wird, braucht es zwei zusätzliche, manuelle Schritte, weil es (noch) keine automatische CI/CD-Pipeline gibt:

1. `ng build` – baut das Projekt nach `dist/mcdenisa-kasse/browser`.
2. `firebase deploy --only hosting` – lädt diesen Ordner zu Firebase Hosting hoch.

### Prüfungserklärung: Responsive Layout

Das Kassenlayout (`.pos-layout`, `.pos-cart` mit fester Breite `280px`, `.category-slider`) wurde ursprünglich für Desktop gebaut und nicht mit Media Queries abgesichert. Auf dem Handy führte das zu zwei sichtbaren Fehlern:

1. **Burger-Menü tot:** Der Button nutzt Bootstraps `data-bs-toggle="collapse"`. Das ist reines JavaScript-Verhalten – ohne das Bootstrap-JS-Bundle registriert Bootstrap keinen Klick-Handler, der Button sieht nur so aus, als würde er funktionieren.
2. **Kategorien verschwinden:** `.category-slider` ist eine Flexbox-Zeile, in der jede der 8 `.cat-card`-Kacheln `flex: 1` bekommt. Auf schmalen Bildschirmen bleibt für jede Kachel kaum Platz, Bild/Icon/Text (mit `overflow: hidden`) werden unlesbar klein.

Merksatz für die mündliche Prüfung:

> „Ich habe Media Queries benutzt, weil das ursprüngliche POS-Layout für Desktop gebaut war. Auf mobilen Geräten wird die Kategorieauswahl horizontal scrollbar und die Kacheln werden kleiner, statt sich zusammenzuquetschen.“

Mittlerweile umgesetzt: Ab 700px wechselt `.pos-layout` per `flex-direction: column` auf ein einspaltiges Layout. `.pos-content` bekommt `order: 1` (Kategorien/Produkte zuerst), `.pos-cart` bekommt `order: 2`, volle Breite und `max-height: 45vh` mit eigenem Scrollbereich, statt weiter die feste `280px`-Breite zu behalten.

## Definition of Done

Eine Funktion gilt als fertig, wenn:

1. sie über die Oberfläche erreichbar ist,
2. Eingaben validiert werden,
3. Logik im passenden Service liegt,
4. Daten korrekt gespeichert oder geladen werden,
5. Fehler verständlich angezeigt werden,
6. geschützte Bereiche einen Guard verwenden,
7. TypeScript ohne Fehler kompiliert,
8. relevante Tests erfolgreich laufen,
9. die Funktion in der Wiki erklärt ist.
