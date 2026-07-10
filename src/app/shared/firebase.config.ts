import { InjectionToken } from '@angular/core';
import type { FirebaseOptions } from 'firebase/app';
import { environment } from '../../environments/environment';

export interface FirebaseConfig {
  enabled: boolean;
  collectionName: string;
  config: FirebaseOptions;
}

/* ein InjectionToken ist wie ein austauschbarer Wert für Angulars Dependency
   Injection. statt dass jeder Service environment.ts direkt importiert fragen
   alle nach FIREBASE_CONFIG. Vorteil: in nem Test kann man den Token einfach
   mit ner Fake-Config überschreiben (z.b enabled: false) ohne echte Firebase-Aufrufe auszulösen */
export const FIREBASE_CONFIG = new InjectionToken<FirebaseConfig>('FIREBASE_CONFIG', {
  providedIn: 'root',
  factory: () => environment.firebase,
});
