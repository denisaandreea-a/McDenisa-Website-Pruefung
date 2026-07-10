import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

/* das ist die Wurzel-Komponente, wird einmal in main.ts gestartet und bleibt
   die ganze zeit da. Navbar und Footer sieht man deswegen auf jeder seite,
   nur der inhalt in der mitte (router-outlet) wechselt je nach url */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public router: Router) {}

  // auf der Kassen-Seite ist einfach kein platz für das grosse Banner-Bild,
  // darum blend ich es da aus und zeig es auf allen anderen seiten
  get showBanner(): boolean {
    return !this.router.url.startsWith('/order');
  }
}
