import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// provideRouter aktiviert das Routing-System in der App.
import { provideRouter } from '@angular/router';
// Die Routen die wir in app.routes.ts definiert haben.
import { routes } from './app.routes';

// Hier wird die App konfiguriert – zum Beispiel welche Features aktiv sind.
// Das ist die moderne Angular-Methode, ohne NgModules zu benutzen.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Fängt allgemeine Browser-Fehler ab
    provideRouter(routes)                 // Aktiviert das Routing mit unseren Routen
  ]
};
