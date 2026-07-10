import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// die 404-Seite, wird über die Wildcard-Route "**" in app.routes.ts angezeigt, also für jede URL die es sonst nicht gibt
@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound {}
