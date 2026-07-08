import { InjectionToken } from '@angular/core';
import type { FirebaseOptions } from 'firebase/app';
import { environment } from '../../environments/environment';

export interface FirebaseConfig {
  enabled: boolean;
  collectionName: string;
  config: FirebaseOptions;
}

export const FIREBASE_CONFIG = new InjectionToken<FirebaseConfig>('FIREBASE_CONFIG', {
  providedIn: 'root',
  factory: () => environment.firebase,
});
