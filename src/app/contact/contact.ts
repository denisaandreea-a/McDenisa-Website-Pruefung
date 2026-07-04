import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Feedback {
  name: string;
  besuchsdatum?: string;
  besuchszeit: string;
  bestellung: string;
  kommentar: string;
  bewertung: number;
  erstelltAm: string;
}

// Kontakt-Seite: Kunden können eine Bewertung über ihre Bestellung abgeben.
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly storageKey = 'mcdenisaFeedbacks';

  submitted = false;
  feedbacks: Feedback[] = this.loadFeedbacks();

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

  // Wird aufgerufen wenn der Nutzer auf einen Stern klickt.
  setSterne(n: number): void {
    this.bewertung = n;
  }

  onSubmit(): void {
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
      this.feedbacks = [feedback, ...this.feedbacks];
      this.saveFeedbacks();
      this.submitted = true;
    }
  }

  reset(): void {
    this.form.reset();
    this.bewertung = 0;
    this.submitted = false;
  }

  private loadFeedbacks(): Feedback[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) as Feedback[] : [];
    } catch {
      return [];
    }
  }

  private saveFeedbacks(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.feedbacks));
  }

  formatDate(value: string | undefined): string {
    if (!value) return '';
    return new Date(value).toLocaleDateString('de-DE');
  }
}
