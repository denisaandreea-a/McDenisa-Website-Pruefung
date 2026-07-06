# Projekt-Vorgaben: McDonald's Ahlen (Angular)

Dieses Projekt folgt den Mustern aus dem Kursbuch "Web-Frontends" von Prof. Alexander Stuckenholz (HSHL).

## Stil-Regeln (IMMER einhalten)

1. Eigenschaften im Konstruktor mit `public` deklarieren — keine separaten Felder.
2. Standalone-Components — KEINE NgModules.
3. Services mit `@Injectable({ providedIn: 'root' })`.
4. `Subject` (RxJS) statt `EventEmitter` für Service→Component-Kommunikation.
5. `routerLink` statt `href` für interne Navigation.
6. Bootstrap-Klassen für Layout, Tabellen, Formulare, Navbar.
7. Reactive Forms (`FormGroup`, `FormControl`, `Validators`) — keine Template-driven Forms.
8. `@for`-Syntax (neu) statt `*ngFor`.
9. `currency`-Pipe für Preisformatierung.
10. Modellklassen liegen in `src/app/model/`.
11. Services liegen in `src/app/shared/`.

## Geplante Komponenten

- `navbar` — Navigationsleiste
- `order` — Kassensystem / Bestellen
- `about` — Über uns
- `career` — Bewerbungsformular
- `page-not-found` — 404-Seite

## Routing

- Leerer Pfad → Redirect auf `order`
- Wildcard `**` → `PageNotFoundComponent`
- `provideRouter(routes)` in `app.config.ts`

## Kapitel-Referenzen (Buch)

- Kap. 6–7: Components, Templates, @for, Pipes
- Kap. 8.3: Datenmodell (TypeScript-Klassen)
- Kap. 8.5–8.6: Services + Dependency Injection
- Kap. 9: Routing, RouterLink, RouterOutlet
- Kap. 9.5: Navbar mit routerLinkActive
- Kap. 10.2: Route Guard (CanActivateFn) — umgesetzt in `admin.guard.ts`
- Kap. 10.3: AuthService-Muster — noch offen
- Kap. 11: Reactive Forms
- Kap. 11.4: Custom Validator — umgesetzt in `validators.ts`
- Kap. 12: Firebase/Firestore — technisch vorbereitet; Firebase-Projekt und Konfigurationsdaten müssen noch eingetragen werden
