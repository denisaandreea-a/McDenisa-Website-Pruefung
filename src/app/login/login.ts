import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  wrong = false;

  form = new FormGroup({
    pin: new FormControl('', [Validators.required])
  });

  constructor(private auth: AuthService, public router: Router) {}

  onSubmit(): void {
    if (this.form.value.pin === '1234') {
      this.auth.login();
      this.router.navigate(['/admin']);
    } else {
      this.wrong = true;
      this.form.reset();
    }
  }
}
