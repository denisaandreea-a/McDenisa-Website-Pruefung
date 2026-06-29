import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Kontakt-Seite: Kunden können eine Bewertung über ihren Besuch abgeben.
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  submitted = false;

  // Die Sternebewertung als eigene Variable (1–5), da ein Custom-UI verwendet wird.
  bewertung = 0;

  form = new FormGroup({
    name:       new FormControl('', [Validators.required, Validators.minLength(2)]),
    besuchszeit: new FormControl('', [Validators.required]),
    bestellung: new FormControl(''),
    ort:        new FormControl('', [Validators.required]),  // "drinnen" oder "draußen"
    kommentar:  new FormControl(''),
  });

  // Wird aufgerufen wenn der Nutzer auf einen Stern klickt.
  setSterne(n: number): void {
    this.bewertung = n;
  }

  onSubmit(): void {
    if (this.form.valid && this.bewertung > 0) {
      this.submitted = true;
      console.log('Bewertung:', { ...this.form.value, sterne: this.bewertung });
    }
  }

  reset(): void {
    this.form.reset();
    this.bewertung = 0;
    this.submitted = false;
  }
}
