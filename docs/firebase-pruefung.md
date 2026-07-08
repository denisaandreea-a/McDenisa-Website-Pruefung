# Firebase / Firestore fuer die Pruefung

Status: **aktiv**. Das Projekt laeuft mit dem echten Firebase-Projekt `mcdenisa-f479f`, `environment.firebase.enabled` steht auf `true`. Der Abschnitt "Aktivieren" unten bleibt als Anleitung stehen, falls ein neues/eigenes Firebase-Projekt eingerichtet werden soll.

Dieses Projekt ist so vorbereitet, dass die Produktverwaltung wahlweise mit lokalen Startdaten oder mit Firebase Firestore arbeitet.

## Was im Code umgesetzt ist

- Firebase SDK ist installiert (`firebase` in `package.json`).
- `ProductService` kapselt den kompletten Datenzugriff.
- Components greifen nicht direkt auf Firestore zu.
- Firestore wird dynamisch geladen, damit die Startseite nicht unnoetig gross wird.
- Collection: `products`
- Dokument-ID: Produkt-ID, zum Beispiel `b1`
- Felder pro Produkt:

```text
name: string
price: number
category: string
```

## Aktivieren

Datei: `src/environments/environment.ts`

1. Firebase-Projekt in der Firebase Console erstellen.
2. Web-App im Firebase-Projekt registrieren.
3. Firestore Database erstellen.
4. Firebase-Web-App-Konfiguration eintragen.
5. `enabled` auf `true` setzen.

Beispiel:

```typescript
firebase: {
  enabled: true,
  collectionName: 'products',
  config: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  },
}
```

Beim ersten Start mit leerer Collection schreibt `ProductService` die vorhandenen Startprodukte automatisch in Firestore.

## Firestore-Regeln fuer die Schul-Demo

Fuer eine kurze Schul-Demo kann man testweise lesen und schreiben erlauben. Danach sollten die Regeln wieder eingeschraenkt werden.

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}
```

## Pruefungserklaerung

Der wichtige Architekturpunkt ist: Die Komponenten bleiben einfach. `Admin`, `ProductForm` und `Order` kennen nur den `ProductService`. Ob die Daten lokal aus dem Array oder aus Firestore kommen, entscheidet der Service. Das passt zu Services und Dependency Injection aus dem Buch.

Firebase ist in `environment.ts` bewusst ueber `enabled` schaltbar. Dadurch bleibt das Projekt ohne private Firebase-Zugangsdaten buildbar und vorfuehrbar.
