import { Inject, Injectable, signal } from '@angular/core';
import type { Auth, User } from 'firebase/auth';
import { FIREBASE_CONFIG, FirebaseConfig } from './firebase.config';

export type Customer = {
  uid: string;
  email: string;
  displayName: string;
};

@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private auth: Auth | null = null;

  readonly customer = signal<Customer | null>(null);
  readonly ready: Promise<void>;

  constructor(@Inject(FIREBASE_CONFIG) private firebaseConfig: FirebaseConfig) {
    this.ready = this.initializeAuth();
  }

  isLoggedIn(): boolean {
    return this.customer() !== null;
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    const { auth, api } = await this.getAuth();
    const credential = await this.withTimeout(
      api.createUserWithEmailAndPassword(auth, email, password),
    );
    await this.withTimeout(api.updateProfile(credential.user, { displayName }));
    this.setCustomer(credential.user);
  }

  async login(email: string, password: string): Promise<void> {
    const { auth, api } = await this.getAuth();
    await this.withTimeout(api.signInWithEmailAndPassword(auth, email, password));
  }

  async logout(): Promise<void> {
    const { auth, api } = await this.getAuth();
    await api.signOut(auth);
  }

  getGermanError(error: unknown): string {
    if (error instanceof Error && error.message === 'Firebase antwortet nicht.') {
      return 'Firebase antwortet nicht. Bitte prüfe deine Internetverbindung und versuche es erneut.';
    }

    const code = typeof error === 'object' && error && 'code' in error
      ? String(error.code)
      : '';

    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Diese E-Mail-Adresse ist bereits registriert.',
      'auth/invalid-credential': 'E-Mail-Adresse oder Passwort ist falsch.',
      'auth/invalid-email': 'Bitte gib eine gültige E-Mail-Adresse ein.',
      'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
      'auth/operation-not-allowed': 'E-Mail/Passwort muss zuerst in Firebase Authentication aktiviert werden.',
      'auth/network-request-failed': 'Firebase ist gerade nicht erreichbar. Bitte versuche es erneut.',
      'auth/too-many-requests': 'Zu viele Versuche. Bitte warte einen Moment.',
    };

    return messages[code] ?? 'Die Anmeldung konnte nicht durchgeführt werden.';
  }

  private async initializeAuth(): Promise<void> {
    if (!this.firebaseConfig.enabled) {
      return;
    }

    const { auth, api } = await this.getAuth();
    await new Promise<void>(resolve => {
      api.onAuthStateChanged(auth, user => {
        this.setCustomer(user);
        resolve();
      });
    });
  }

  private async getAuth(): Promise<{ auth: Auth; api: typeof import('firebase/auth') }> {
    if (!this.firebaseConfig.enabled) {
      throw new Error('Firebase Authentication ist deaktiviert.');
    }

    const firebaseApp = await import('firebase/app');
    const api = await import('firebase/auth');
    const app = firebaseApp.getApps().length > 0
      ? firebaseApp.getApp()
      : firebaseApp.initializeApp(this.firebaseConfig.config);

    this.auth ??= api.getAuth(app);
    return { auth: this.auth, api };
  }

  private setCustomer(user: User | null): void {
    this.customer.set(user
      ? {
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Kunde',
        }
      : null);
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error('Firebase antwortet nicht.')),
        timeoutMs,
      );
      promise.then(
        value => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        error => {
          clearTimeout(timeoutId);
          reject(error);
        },
      );
    });
  }
}
