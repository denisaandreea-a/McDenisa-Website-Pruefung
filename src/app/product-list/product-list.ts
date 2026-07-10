import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../model/product';
import { ProductService } from '../shared/product';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
/* achtung: diese Komponente wird aktuell von keiner Route und keinem Template
   benutzt (kein Eintrag in app.routes.ts, kein <app-product-list> irgendwo).
   war glaub ich mal ein früher Prototyp für ne einfache Produktliste, den
   ich dann später durch die Kategorie-Ansicht in Order ersetzt hab */
export class ProductList implements OnInit {

  products: Product[] = [];

  constructor(public productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getAll();
  }
}
