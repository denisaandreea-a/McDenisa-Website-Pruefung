import { Inject, Injectable, signal } from '@angular/core';
import type { Auth, User } from 'firebase/auth';
import { FIREBASE_CONFIG, FirebaseConfig } from './firebase.config';

export type Customer = {
  uid: string;
  email: string;
  displayName: string;
};

/* kümmert sich um den Kunden-Login über Firebase Authentication
   (Registrieren, Einloggen, Ausloggen, aktueller Nutzer). der Admin-Login
   läuft komplett getrennt davon über AuthService */
@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private auth: Auth | null = null;

  // signal statt normaler variable, damit Templates automatisch neu rendern sobald sich der Kunde ändert (Navbar, Rabatt usw)
  readonly customer = signal<Customer | null>(null);

  /* Firebase braucht kurz bis es weiss ob schon jemand eingeloggt ist. andere
     stellen (z.b der customerGuard) können "await ready" machen um
     sicherzugehen dass die Prüfung wirklich fertig ist */
  readonly ready: Promise<void>;

  constructor(@Inject(FIREBASE_CONFIG) private firebaseConfig: FirebaseConfig) {
    this.ready = this.initializeAuth();
  }

  isLoggedIn(): boolean {
    return this.customer() !== null;
  }

  // Legt einen neuen Kunden-Account bei Firebase an und setzt direkt den Namen.
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

  /* wird einmal beim App-Start aufgerufen. onAuthStateChanged meldet sich
     sobald Firebase weiss ob ein Nutzer eingeloggt ist (auch nach Reload,
     Firebase merkt sich das im Browser). erst dann lös ich "ready" auf */
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

  /* await import(...) lädt Firebase erst dann wenn ichs wirklich brauch
     (dynamischer import), so bleibt das Haupt-Bundle beim App-Start kleiner
     weil Firebase nicht sofort mit runtergeladen werden muss */
  private async getAuth(): Promise<{ auth: Auth; api: typeof import('firebase/auth') }> {
    if (!this.firebaseConfig.enabled) {
      throw new Error('Firebase Authentication ist deaktiviert.');
    }

    const firebaseApp = await import('firebase/app');
    const api = await import('firebase/auth');
    // Firebase darf nur einmal initialisiert werden, falls ein anderer Service (z.b ProductService) das schon gemacht hat nehm ich einfach die App
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

  /* Firebase-Aufrufe könnten theoretisch ewig hängen bleiben (schlechtes netz
     o.ä.), darum brech ich nach timeoutMs selber mit nem Fehler ab statt die
     Leute endlos warten zu lassen */
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
