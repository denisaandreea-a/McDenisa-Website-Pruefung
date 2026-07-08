import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../shared/product';
import { Product } from '../model/product';

// Eine Component für zwei Modi: Neu anlegen (/admin/product/new) und Bearbeiten (/admin/product/:id)
@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {

  isEditMode = false;
  productId: string | null = null;
  isSaving = false;
  errorMessage = '';

  form = new FormGroup({
    name:     new FormControl('', [Validators.required, Validators.minLength(2)]),
    price:    new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    category: new FormControl('', [Validators.required]),
  });

  readonly categories = ['Menüs', 'Happy Meal', 'Burger', 'Chicken & Nuggets', 'Beilagen', 'Getränke', 'McCafé', 'Desserts'];

  constructor(
    public productService: ProductService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.productId  = this.route.snapshot.paramMap.get('id');
    this.isEditMode = this.productId !== null;
    if (this.isEditMode) { this.loadProduct(); }
  }

  async loadProduct(): Promise<void> {
    try {
      const product = await this.productService.getById(this.productId!);
      if (product) {
        this.form.setValue({ name: product.name, price: product.price, category: product.category });
      } else {
        this.errorMessage = 'Produkt wurde nicht gefunden.';
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Produkt konnte nicht geladen werden.';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.errorMessage = '';
    const { name, price, category } = this.form.value;
    try {
      if (this.isEditMode) {
        await this.productService.update(new Product(this.productId!, name!, price!, category!));
      } else {
        await this.productService.add(new Product(Date.now().toString(), name!, price!, category!));
      }
      this.router.navigate(['/admin']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Produkt konnte nicht gespeichert werden.';
    } finally {
      this.isSaving = false;
    }
  }
}
