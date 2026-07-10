import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// provideRouter aktiviert das Routing-System in der App
import { provideRouter } from '@angular/router';
// die Routen die ich in app.routes.ts definiert hab
import { routes } from './app.routes';

/* hier wird die App konfiguriert, z.b welche Features aktiv sind.
   das ist die moderne Angular-Methode ohne NgModules zu benutzen */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // fängt allgemeine Browser-Fehler ab
    provideRouter(routes)                 // aktiviert das Routing mit meinen Routen von oben
  ]
};
