import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerAuthService } from '../shared/customer-auth.service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  readonly registerMode = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  form = new FormGroup({
    displayName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    public customerAuth: CustomerAuthService,
    public router: Router,
  ) {}

  setMode(registerMode: boolean): void {
    this.registerMode.set(registerMode);
    this.errorMessage.set('');
    const nameControl = this.form.controls.displayName;
    if (registerMode) {
      nameControl.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      nameControl.clearValidators();
    }
    nameControl.updateValueAndValidity();
  }

  async submit(): Promise<void> {
    this.setMode(this.registerMode());
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    const { displayName, email, password } = this.form.getRawValue();

    try {
      if (this.registerMode()) {
        await this.customerAuth.register(email!, password!, displayName!);
      } else {
        await this.customerAuth.login(email!, password!);
      }
      await this.router.navigate(['/order']);
    } catch (error) {
      this.errorMessage.set(this.customerAuth.getGermanError(error));
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.customerAuth.logout();
    this.form.reset();
  }
}
