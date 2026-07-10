import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Feedback, FeedbackService } from '../shared/feedback.service';

// Kontakt-Seite: Kunden können eine Bewertung über ihre Bestellung abgeben.
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  submitted = false;

  /* signal() statt normaler Felder, weil die App ohne zone.js läuft: ein
     normales Feld wie "feedbacks: Feedback[] = []" löst nach einem await
     kein Re-Render aus, ein signal().set(...) dagegen schon - genau wie bei
     MyOrders/CustomerAuthService in diesem Projekt */
  readonly loadingFeedbacks = signal(true);
  readonly feedbacks = signal<Feedback[]>([]);

  // Die Sternebewertung als eigene Variable (1–5), da ein Custom-UI verwendet wird.
  bewertung = 0;
  readonly sterne = [1, 2, 3, 4, 5];

  form = new FormGroup({
    name:       new FormControl('', [Validators.required, Validators.minLength(2)]),
    besuchsdatum: new FormControl('', [Validators.required]),
    besuchszeit: new FormControl('', [Validators.required]),
    bestellung: new FormControl(''),
    kommentar:  new FormControl(''),
  });

  constructor(private feedbackService: FeedbackService) {}

  async ngOnInit(): Promise<void> {
    this.feedbacks.set(await this.feedbackService.getAll());
    this.loadingFeedbacks.set(false);
  }

  // Wird aufgerufen wenn der Nutzer auf einen Stern klickt.
  setSterne(n: number): void {
    this.bewertung = n;
  }

  /* speichert das Feedback nur wenn Formular gültig UND mindestens ein Stern
     gewählt ist (bewertung wird separat geprüft weil es kein normales
     FormControl ist sondern ein eigenes kleines UI) */
  async onSubmit(): Promise<void> {
    if (this.form.valid && this.bewertung > 0) {
      const { name, besuchsdatum, besuchszeit, bestellung, kommentar } = this.form.value;
      const feedback: Feedback = {
        name: name!,
        besuchsdatum: besuchsdatum!,
        besuchszeit: besuchszeit!,
        bestellung: bestellung?.trim() ?? '',
        kommentar: kommentar?.trim() ?? '',
        bewertung: this.bewertung,
        erstelltAm: new Date().toLocaleString('de-DE'),
      };
      this.feedbacks.update(current => [feedback, ...current]);
      this.submitted = true;
      // Absenden blockiert die Anzeige nicht: Feedback ist lokal schon sichtbar, Firestore-Schreiben läuft nebenbei
      await this.feedbackService.save(feedback);
    }
  }

  reset(): void {
    this.form.reset();
    this.bewertung = 0;
    this.submitted = false;
  }

  formatDate(value: string | undefined): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('de-DE');
  }
}
