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
  isLoading = true;
  errorMessage = '';

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
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.products = await this.productService.getAll();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Produkte konnten nicht geladen werden.';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`"${product.name}" wirklich löschen?`)) {
      try {
        await this.productService.remove(product);
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Produkt konnte nicht gelöscht werden.';
      }
    }
  }
}
