import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../model/product';
import { ProductService } from '../shared/product';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule, CurrencyPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  products: Product[] = [];

  constructor(
    public productService: ProductService,
    private auth: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.loadProducts();
    this.productService.changed$.subscribe(() => this.loadProducts());
  }

  async loadProducts(): Promise<void> {
    this.products = await this.productService.getAll();
  }

  deleteProduct(product: Product): void {
    if (confirm(`"${product.name}" wirklich löschen?`)) {
      this.productService.remove(product);
    }
  }
}
