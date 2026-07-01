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
export class ProductList implements OnInit {

  products: Product[] = [];

  constructor(public productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getAll();
  }
}
