// Importiere die benötigten Angular-Module
import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

// Importiere die selbst erstellte Product-Klasse
import { Product } from '../model/product';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  // Testdaten: drei Produkte für die Kasse
  products: Product[] = [
    new Product('1', 'Burger', 5.99, 'Essen'),
    new Product('2', 'Cartofi', 2.49, 'Beilagen'),
    new Product('3', 'Cola', 1.99, 'Getränke'),
  ];
}
