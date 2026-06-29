import { Component } from '@angular/core';
// RouterOutlet ist der Platzhalter im HTML, wo Angular die aktive Seite einblendet.
import { RouterOutlet } from '@angular/router';
// Die Navbar-Component, die wir selbst gebaut haben.
import { Navbar } from './navbar/navbar';

// Das ist die Root-Component – also der äußerste Rahmen der ganzen App.
// Hier passiert nicht viel Logik, sie hält nur Navbar und Router-Outlet zusammen.
@Component({
  selector: 'app-root',           // So heißt sie im HTML: <app-root>
  imports: [RouterOutlet, Navbar], // Welche anderen Components hier benutzt werden
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
