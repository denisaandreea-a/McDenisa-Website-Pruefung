import { Component } from '@angular/core';
// RouterLink ermöglicht die Verwendung von routerLink im HTML (statt href).
// RouterLinkActive fügt automatisch die CSS-Klasse "active" hinzu, wenn der Link aktiv ist.
import { RouterLink, RouterLinkActive } from '@angular/router';

// Die Navbar wird auf jeder Seite oben angezeigt.
// Sie hat keine eigene Logik – sie zeigt nur Links an.
// RouterLink und RouterLinkActive müssen hier importiert werden, weil wir
// Standalone-Components verwenden (kein NgModule kümmert sich darum).
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
