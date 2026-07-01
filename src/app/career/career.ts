import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { phoneValidator } from '../shared/validators';

@Component({
  selector: 'app-career',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './career.html',
  styleUrl: './career.css',
})
export class Career {

  submitted = false;

  form = new FormGroup({
    name:    new FormControl('', [Validators.required, Validators.minLength(2)]),
    email:   new FormControl('', [Validators.required, Validators.email]),
    phone:   new FormControl('', [phoneValidator]),
    area:    new FormControl('', [Validators.required]),
    message: new FormControl('')
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted = true;
    }
  }

  reset(): void {
    this.form.reset();
    this.submitted = false;
  }
}
