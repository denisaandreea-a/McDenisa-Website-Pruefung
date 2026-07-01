import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../model/product';
import { OrderItem } from '../model/order-item';
import { Order as OrderModel } from '../model/order';
import { ProductService } from '../shared/product';
import { OrderService } from '../shared/order';

interface AccStep {
  title:    string;
  options:  string[];
  selected: string | null;
}

const SOSSEN = ['Ketchup', 'Mayonnaise', 'BBQ-Sauce', 'Süß-Sauer-Sauce', 'Senf', 'Honig-Senf'];
const HM_DRINKS = ['Cola', 'Fanta', 'Sprite', 'Wasser', 'Apfelsaft'];
const HM_DESSERT = ['Apfeltüte', 'Fruchtquatsch', 'McFreezy Eis'];

@Component({
  selector: 'app-order',
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order implements OnInit {

  products: Product[] = [];
  items: OrderItem[] = [];
  total: number = 0;
  lastOrder: OrderModel | null = null;
  selectedCategory: string | null = null;
  selectedQuantity: number = 1;
  checkoutVisible: boolean = false;
  readonly quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  checkoutForm = new FormGroup({
    checkoutType: new FormControl('', [Validators.required]),
    pickupTime:   new FormControl('', [Validators.required])
  });

  readonly categoryDefs = [
    { name: 'Menüs',             icon: '🍔', css: 'cat-menus'    },
    { name: 'Happy Meal',        icon: '🎉', css: 'cat-happy'    },
    { name: 'Burger',            icon: '🫔', css: 'cat-burger'   },
    { name: 'Chicken & Nuggets', icon: '🍗', css: 'cat-chicken'  },
    { name: 'Beilagen',          icon: '🍟', css: 'cat-beilagen' },
    { name: 'Getränke',          icon: '🥤', css: 'cat-getraenk' },
    { name: 'McCafé',            icon: '☕', css: 'cat-mccafe'   },
    { name: 'Desserts',          icon: '🍦', css: 'cat-desserts' },
  ];

  accSteps: AccStep[] = [];
  pendingProduct: Product | null = null;

  constructor(
    public productService: ProductService,
    public orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.productService.changed$.subscribe(() => this.loadProducts());
    this.orderService.changed$.subscribe(() => {
      this.items = this.orderService.getItems();
      this.total = this.orderService.getTotal();
    });
  }

  async loadProducts(): Promise<void> {
    this.products = await this.productService.getAll();
  }

  getByCategory(cat: string): Product[] {
    return this.products.filter(p => p.category === cat);
  }

  getTileClass(category: string): string {
    const map: Record<string, string> = {
      'Menüs':             'tile-menus',
      'Happy Meal':        'tile-happy',
      'Burger':            'tile-burger',
      'Chicken & Nuggets': 'tile-chicken',
      'Beilagen':          'tile-beilagen',
      'Getränke':          'tile-getraenk',
      'McCafé':            'tile-mccafe',
      'Desserts':          'tile-desserts',
    };
    return map[category] ?? 'tile-burger';
  }

  selectCategory(name: string): void {
    this.selectedCategory = name;
    this.accSteps         = [];
    this.pendingProduct   = null;
  }

  selectQuantity(quantity: number): void {
    this.selectedQuantity = quantity;
  }

  onProductSelected(product: Product): void {
    this.pendingProduct = product;
    this.accSteps       = [];
    const first = this.getNextStep(product, []);
    if (first) {
      this.accSteps = [{ ...first, selected: null }];
    } else {
      this.commitToCart(product, []);
      this.pendingProduct = null; // direkt in Warenkorb → nichts bleibt ausgewählt
    }
  }

  onStepChosen(stepIndex: number, option: string): void {
    this.accSteps[stepIndex].selected = option;
    this.accSteps = this.accSteps.slice(0, stepIndex + 1);
    const selections = this.accSteps.map(s => s.selected!);
    const next = this.getNextStep(this.pendingProduct!, selections);
    if (next) {
      this.accSteps = [...this.accSteps, { ...next, selected: null }];
    } else {
      this.commitToCart(this.pendingProduct!, selections);
      this.accSteps       = [];
      this.pendingProduct = null;
    }
  }

  onCancelDialog(): void {
    this.accSteps       = [];
    this.pendingProduct = null;
  }

  private getNextStep(product: Product, sel: string[]): AccStep | null {
    const step = sel.length;

    if (product.category === 'Menüs') {
      if (step === 0) return { title: 'Welche Beilage?',  options: ['Pommes', 'Kartoffelecken'], selected: null };
      if (step === 1) return { title: 'Welche Soße?',     options: [...SOSSEN, 'Keine Soße'],    selected: null };
      if (step === 2) return { title: 'Welches Getränk?', options: ['Cola', 'Fanta', 'Sprite', 'Iced Tea', 'Wasser'], selected: null };
      return null;
    }

    if (product.name === 'Happy Meal Nuggets') {
      if (step === 0) return { title: 'Welche Soße?',          options: SOSSEN,                           selected: null };
      if (step === 1) return { title: 'Welches Getränk?',      options: HM_DRINKS,                        selected: null };
      if (step === 2) return { title: 'Welcher Nachtisch?',    options: HM_DESSERT,                       selected: null };
      if (step === 3) return { title: 'Spielzeug oder Buch?',  options: ['Spielzeug', 'Buch'],            selected: null };
      return null;
    }

    if (product.category === 'Happy Meal') {
      if (step === 0) return { title: 'Welches Getränk?',     options: HM_DRINKS,             selected: null };
      if (step === 1) return { title: 'Welcher Nachtisch?',   options: HM_DESSERT,            selected: null };
      if (step === 2) return { title: 'Spielzeug oder Buch?', options: ['Spielzeug', 'Buch'], selected: null };
      return null;
    }

    if (product.name === 'McNuggets 6er' && step === 0) {
      return { title: 'Welche Soße?', options: SOSSEN, selected: null };
    }

    if (product.name === 'McNuggets 9er') {
      if (step === 0) return { title: 'Welche Soße (1/2)?', options: SOSSEN, selected: null };
      if (step === 1) return { title: 'Welche Soße (2/2)?', options: SOSSEN, selected: null };
      return null;
    }

    if (product.name === 'McNuggets 20er') {
      if (step === 0) return { title: 'Welche Soße (1/3)?', options: SOSSEN, selected: null };
      if (step === 1) return { title: 'Welche Soße (2/3)?', options: SOSSEN, selected: null };
      if (step === 2) return { title: 'Welche Soße (3/3)?', options: SOSSEN, selected: null };
      return null;
    }

    if (product.name === 'Pommes' && step === 0) {
      return { title: 'Welche Größe?', options: ['Klein (2,29 €)', 'Mittel (2,79 €)', 'Groß (3,29 €)'], selected: null };
    }

    if (product.category === 'Getränke' && step === 0) {
      return { title: 'Welche Größe?', options: ['0,25 l (1,99 €)', '0,4 l (2,49 €)', '0,5 l (2,99 €)'], selected: null };
    }

    if (product.name === 'McFlurry' && step === 0) {
      return { title: 'Welchen Geschmack?', options: ['Oreo', 'Schoko-Linsen'], selected: null };
    }

    if (product.name === 'McSundae' && step === 0) {
      return { title: 'Welche Soße?', options: ['Karamel', 'Schokolade', 'Ohne Soße'], selected: null };
    }

    if (product.name === 'Softeis' && step === 0) {
      return { title: 'Welche Soße?', options: ['Karamel', 'Schokolade', 'Ohne Soße'], selected: null };
    }

    if (product.name === 'Milkshake') {
      if (step === 0) return { title: 'Welchen Geschmack?', options: ['Vanille', 'Erdbeere', 'Schokolade'], selected: null };
      if (step === 1 && sel[0] === 'Vanille') {
        return { title: 'Welche Größe?', options: ['Klein (2,99 €)', 'Groß (3,99 €)'], selected: null };
      }
      return null;
    }

    return null;
  }

  private commitToCart(product: Product, selections: string[]): void {
    const delta = this.getPriceDelta(product, selections);
    const label = selections.length > 0
      ? `${product.name} (${selections.join(', ')})`
      : product.name;
    const varId = selections.length > 0
      ? `${product.id}_${selections.join('_')}`
      : product.id;

    this.orderService.addProduct(new Product(
      varId, label,
      parseFloat((product.price + delta).toFixed(2)),
      product.category
    ), this.selectedQuantity);
    this.selectedQuantity = 1;
    this.lastOrder = null;
  }

  private getPriceDelta(product: Product, sel: string[]): number {
    if (product.name === 'Pommes') {
      if (sel[0]?.includes('Mittel')) return 0.50;
      if (sel[0]?.includes('Groß'))   return 1.00;
    }
    if (product.category === 'Getränke') {
      if (sel[0]?.includes('0,4 l'))  return 0.50;
      if (sel[0]?.includes('0,5 l'))  return 1.00;
    }
    if (product.name === 'Milkshake' && sel.includes('Groß')) return 1.00;
    return 0;
  }

  removeItem(item: OrderItem): void  { this.orderService.removeItem(item); }

  clearCart(): void {
    this.orderService.clearCart();
    this.checkoutVisible = false;
    this.checkoutForm.reset();
    this.lastOrder = null;
  }

  openCheckout(): void {
    this.checkoutVisible = true;
    this.lastOrder = null;
  }

  cancelCheckout(): void {
    this.checkoutVisible = false;
    this.checkoutForm.reset();
  }

  checkout(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    const { checkoutType, pickupTime } = this.checkoutForm.value;
    this.lastOrder = this.orderService.checkout(checkoutType!, pickupTime!) as OrderModel;
    this.checkoutVisible = false;
    this.checkoutForm.reset();
  }
}
