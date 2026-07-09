# Projekt-Vorgaben: McDenisa (Angular-Schulprojekt)

Dieses Projekt folgt den Mustern aus dem Kursbuch **Web-Frontends** von Prof. Alexander Stuckenholz.

McDenisa ist eine fiktive Kassen-Webanwendung. Ziel ist nicht ein produktives Restaurant-System, sondern eine nachvollziehbare Angular-Anwendung für die Prüfung.

## Projektziel

| Ziel | Umsetzung |
|---|---|
| Angular-Grundlagen zeigen | Components, Templates, Routing, Services |
| Formulare sicher verwenden | Reactive Forms und Validatoren |
| geschützte Bereiche umsetzen | Route Guards für Admin und Kundenhistorie |
| Daten extern speichern | Firebase Firestore |
| Authentifizierung zeigen | Firebase Authentication für Kunden |
| Projekt professionell abgrenzen | Schulprojekt-Hinweis, Musterdaten, Initialen |

## Stil-Regeln

| Regel | Bedeutung |
|---|---|
| Standalone Components | keine NgModules |
| Services in `src/app/shared/` | Logik und Datenzugriff nicht direkt im Template |
| Models in `src/app/model/` | klare Datenstrukturen |
| Reactive Forms | keine Template-driven Forms |
| `routerLink` | keine normalen `href`-Links für interne Navigation |
| `routerLinkActive` | aktive Navigation sichtbar machen |
| `@for` / `@if` | moderne Angular-Template-Syntax |
| `currency`-Pipe | Preise einheitlich formatieren |
| Guards | geschützte Routen absichern |
| Firebase über Service | Components greifen nicht direkt auf Firestore zu |

## Wichtige Komponenten

| Component | Aufgabe |
|---|---|
| `Navbar` | Hauptnavigation |
| `Order` | Kasse, Warenkorb und Checkout |
| `Account` | Registrierung und Login |
| `MyOrders` | persönliche Bestellhistorie |
| `Admin` | Produktübersicht |
| `ProductForm` | Produkt anlegen und bearbeiten |
| `Contact` | Feedbackformular |
| `Career` | Bewerbungsformular |
| `About` | Projektinfo und Teamkarten |
| `PageNotFound` | 404-Seite |

## Wichtige Services

| Service | Aufgabe |
|---|---|
| `ProductService` | Produktdaten laden und verwalten |
| `OrderService` | Warenkorb, Rabatt, Checkout, Bestellnummer |
| `CustomerAuthService` | Kundenregistrierung und Login |
| `CustomerOrderService` | Kundenbestellungen speichern und laden |
| `AuthService` | Admin-PIN-Login |

## Routing

| Route | Bedeutung |
|---|---|
| leerer Pfad | Weiterleitung auf `/order` |
| `/order` | Kassenseite |
| `/about` | Über uns |
| `/career` | Karriere |
| `/contact` | Kontakt |
| `/konto` | Kundenkonto |
| `/meine-bestellungen` | geschützt durch `customerGuard` |
| `/login` | Admin-Login |
| `/admin...` | geschützt durch `adminGuard` |
| `**` | 404-Seite |

## Kapitel-Referenzen zum Buch

| Kapitel | Thema | Umsetzung |
|---:|---|---|
| 6–7 | Components, Templates, Kontrollstrukturen, Pipes | Standalone Components, `@if`, `@for`, `currency` |
| 8.3 | Datenmodell | `Product`, `OrderItem`, `Order` |
| 8.5–8.6 | Services und Dependency Injection | Services in `shared`, Firebase Injection Token |
| 9 | Routing | `app.routes.ts`, `RouterOutlet`, `routerLink` |
| 9.5 | aktive Navigation | `routerLinkActive` |
| 10.2 | Route Guard | `adminGuard`, `customerGuard` |
| 10.3 | AuthService-Muster | `AuthService`, `CustomerAuthService` |
| 11 | Reactive Forms | Checkout, Kontakt, Karriere, Login, Produktformular |
| 11.4 | Custom Validator | `phoneValidator` |
| 12 | Firebase/Firestore | Produkte und Bestellungen in Firestore |

## Scope

### In Scope

| Funktion | Status |
|---|---|
| Kasse mit Warenkorb | umgesetzt |
| Checkout mit Validierung | umgesetzt |
| Kundenkonto | umgesetzt |
| 10-%-Rabatt | umgesetzt |
| persönliche Bestellhistorie | umgesetzt |
| Admin-Produktverwaltung | umgesetzt |
| Firestore-Anbindung | umgesetzt |
| Schulprojekt-Hinweis | umgesetzt |
| Wiki-Dokumentation | umgesetzt |

### Out of Scope

| Funktion | Grund |
|---|---|
| echte Bestellübermittlung | Projekt ist fiktiv |
| Online-Zahlung | zu sicherheitskritisch und nicht Teil des Kernumfangs |
| Social Login | Zusatzfunktion ohne Mehrwert für die Prüfung |
| Push-Benachrichtigungen | optionales Erweiterungsthema |
| produktive Restaurantseite | nicht Ziel des Moduls |

## Definition of Done

Eine Funktion gilt als fertig, wenn:

1. sie über die Oberfläche erreichbar ist,
2. Eingaben validiert werden,
3. Logik in einem passenden Service liegt,
4. Daten korrekt gespeichert oder gelesen werden,
5. Lade- und Fehlerzustände verständlich sind,
6. geschützte Bereiche einen Guard nutzen,
7. Tests und Build erfolgreich laufen,
8. die Funktion in der Dokumentation erklärt ist.
