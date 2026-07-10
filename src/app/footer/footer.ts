import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// der Footer ist auf jeder Seite gleich (Adresse, Öffnungszeiten, Links), braucht kaum Logik, nur das aktuelle Jahr fürs Copyright
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  year = new Date().getFullYear();
}
