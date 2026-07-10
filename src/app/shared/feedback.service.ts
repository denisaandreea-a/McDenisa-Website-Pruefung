import { Inject, Injectable } from '@angular/core';
import type { Firestore } from 'firebase/firestore';
import { FIREBASE_CONFIG, FirebaseConfig } from './firebase.config';

export type Feedback = {
  name: string;
  besuchsdatum?: string;
  besuchszeit: string;
  bestellung: string;
  kommentar: string;
  bewertung: number;
  erstelltAm: string;
};

/* speichert die Kontakt-Bewertungen. genau wie beim CustomerOrderService:
   erst lokal sichern (sofort, geht auch offline), dann zusätzlich in eine
   öffentliche Firestore-Collection schreiben, damit die Kommentare auch auf
   anderen Geräten sichtbar sind. hier ist kein Login nötig, jeder darf
   Feedback abschicken, deshalb gibt's auch keine uid wie bei den Bestellungen */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private db: Firestore | null = null;
  private readonly collectionName = 'feedbacks';
  private readonly storageKey = 'mcdenisaFeedbacks';

  constructor(@Inject(FIREBASE_CONFIG) private firebaseConfig: FirebaseConfig) {}

  async save(feedback: Feedback): Promise<void> {
    this.saveLocally(feedback);

    try {
      const { db, api } = await this.getFirestore();
      await this.withTimeout(
        api.addDoc(api.collection(db, this.collectionName), {
          ...feedback,
          erstelltAmIso: new Date().toISOString(),
        }),
        5000,
      );
    } catch {
      // Feedback bleibt lokal gespeichert, auch wenn Firestore grad nicht erreichbar ist
    }
  }

  async getAll(): Promise<Feedback[]> {
    const localFeedbacks = this.loadLocally();

    try {
      const { db, api } = await this.getFirestore();
      const feedbackQuery = api.query(
        api.collection(db, this.collectionName),
        api.orderBy('erstelltAmIso', 'desc'),
      );
      const snapshot = await this.withTimeout(api.getDocs(feedbackQuery), 5000);
      const onlineFeedbacks = snapshot.docs.map(doc => doc.data() as Feedback);

      return onlineFeedbacks.length > 0 ? onlineFeedbacks : localFeedbacks;
    } catch {
      return localFeedbacks;
    }
  }

  private async getFirestore(): Promise<{
    db: Firestore;
    api: typeof import('firebase/firestore');
  }> {
    if (!this.firebaseConfig.enabled) {
      throw new Error('Firestore ist deaktiviert.');
    }

    const firebaseApp = await import('firebase/app');
    const api = await import('firebase/firestore');
    const app = firebaseApp.getApps().length > 0
      ? firebaseApp.getApp()
      : firebaseApp.initializeApp(this.firebaseConfig.config);

    this.db ??= api.getFirestore(app);
    return { db: this.db, api };
  }

  private loadLocally(): Feedback[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) as Feedback[] : [];
    } catch {
      return [];
    }
  }

  private saveLocally(feedback: Feedback): void {
    const feedbacks = this.loadLocally();
    localStorage.setItem(
      this.storageKey,
      JSON.stringify([feedback, ...feedbacks].slice(0, 100)),
    );
  }

  // Firestore-Aufrufe könnten hängen bleiben, drum brech ich nach timeoutMs selber ab statt ewig zu warten
  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error('Firestore antwortet nicht.')),
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
