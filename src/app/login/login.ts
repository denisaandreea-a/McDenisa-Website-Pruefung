import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.form.value.pin === '1234') {
      sessionStorage.setItem('isAdmin', 'true');
      this.router.navigate(['/admin']);
    } else {
      this.wrong = true;
      this.form.reset();
    }
  }
}
