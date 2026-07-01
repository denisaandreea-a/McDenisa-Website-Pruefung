import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /^[+\d\s\-()]+$/.test(control.value) ? null : { invalidPhone: true };
}
