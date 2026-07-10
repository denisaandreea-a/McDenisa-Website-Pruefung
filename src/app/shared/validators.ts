import { AbstractControl, ValidationErrors } from '@angular/forms';

/* mein einziger eigener (custom) Validator im Projekt. Angular hat von Haus
   aus keinen fertigen Validator für Telefonnummern, drum schreib ich selber
   ne kleine Funktion dafür. Regel: erlaubt sind nur Ziffern, Leerzeichen,
   +, - und Klammern. Rückgabe null = alles ok, Rückgabe { invalidPhone: true }
   = Fehler, das Template kann den Fehler dann per control.errors abfragen */
export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null; // leeres feld prüf ich hier nicht, dafür gibts ja Validators.required
  return /^[+\d\s\-()]+$/.test(control.value) ? null : { invalidPhone: true };
}
