import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../model/product';
import { OrderItem } from '../model/order-item';
import { Order as OrderModel } from '../model/order';
import { ProductService } from '../shared/product';
import { OrderService } from '../shared/order';
import { phoneValidator } from '../shared/validators';
import { CustomerAuthService } from '../shared/customer-auth.service';
import { CustomerOrderService } from '../shared/customer-order.service';
import { RouterLink } from '@angular/router';

interface AccStep {
  title:    string;
  options:  string[];
  selected: string | null;
}

const SOSSEN = ['Ketchup', 'Mayonnaise', 'BBQ-Sauce', 'Süß-Sauer-Sauce', 'Senf', 'Honig-Senf'];
const HM_DRINKS = ['Cola', 'Fanta', 'Sprite', 'Wasser', 'Apfelsaft'];
const HM_DESSERT = ['Apfeltüte', 'Fruchtquatsch', 'McFreezy Eis'];
const MCCAFE_COUNTED_EXTRAS = ['Zucker', 'Kaffeesahne', 'Süßstoff'];
const MCCAFE_MILK_OPTIONS = ['Hafermilch', 'Laktosefreie Milch'];

const INGREDIENT_MAP: Record<string, string[]> = {
  'm1': ['Salat', 'Zwiebeln', 'Gurken', 'Käse', 'Big-Mac-Sauce'],
  'm2': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Käse', 'Senf', 'Mayo'],
  'm3': ['Salat', 'Mayo'],
  'm4': ['Zwiebeln', 'Gurken', 'BBQ-Sauce'],
  'h1': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Käse', 'Ketchup', 'Senf'],
  'h2': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Ketchup', 'Senf'],
  'b1': ['Salat', 'Zwiebeln', 'Gurken', 'Käse', 'Big-Mac-Sauce'],
  'b2': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Käse', 'Senf', 'Mayo'],
  'b3': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Käse', 'Senf', 'Mayo'],
  'b4': ['Salat', 'Mayo'],
  'b5': ['Zwiebeln', 'Gurken', 'BBQ-Sauce'],
  'b6': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Käse', 'Ketchup', 'Senf'],
  'b7': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Käse', 'Ketchup', 'Senf'],
  'b8': ['Salat', 'Tomaten', 'Zwiebeln', 'Gurken', 'Ketchup', 'Senf'],
  'b9': ['Käse', 'Tatar-Sauce'],
};

@Component({
  selector: 'app-order',
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, RouterLink],
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
  thankYouVisible: boolean = false;
  editingItem: OrderItem | null = null;
  readonly quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  checkoutForm = new FormGroup({
    checkoutType: new FormControl('', [Validators.required]),
    pickupTime:   new FormControl('', [Validators.required]),
    customerName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone:        new FormControl('', [Validators.required, phoneValidator]),
    address:      new FormControl('')
  });

  readonly categoryDefs = [
    { name: 'Menüs',             image: '/assets/menu/category-menus.png',      css: 'cat-menus'    },
    { name: 'Happy Meal',        image: '/assets/menu/category-happy-meal.png', css: 'cat-happy'    },
    { name: 'Burger',            image: '/assets/menu/category-burger.png',     css: 'cat-burger'   },
    { name: 'Chicken & Nuggets', image: '/assets/menu/category-chicken.png',    css: 'cat-chicken'  },
    { name: 'Beilagen',          image: '/assets/menu/category-beilagen.png',   css: 'cat-beilagen' },
    { name: 'Getränke',          image: '/assets/menu/category-getraenke.png',  css: 'cat-getraenk' },
    { name: 'McCafé',            image: '/assets/menu/category-mccafe.png',     css: 'cat-mccafe'   },
    { name: 'Desserts',          image: '/assets/menu/category-desserts.png',   css: 'cat-desserts' },
  ];

  accSteps: AccStep[] = [];
  pendingProduct: Product | null = null;

  constructor(
    public productService: ProductService,
    public orderService: OrderService,
    public customerAuth: CustomerAuthService,
    public customerOrders: CustomerOrderService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.productService.changed$.subscribe(() => this.loadProducts());
    this.orderService.changed$.subscribe(() => {
      this.items = this.orderService.getItems();
      this.total = this.orderService.getTotal();
    });
    this.checkoutForm.controls.checkoutType.valueChanges.subscribe(() => {
      this.updateAddressValidators();
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
    this.thankYouVisible = false;
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

  getIngredients(item: OrderItem): string[] {
    const baseId = item.product.id.split('_')[0];
    return INGREDIENT_MAP[baseId] ?? [];
  }

  getMcCafeExtras(item: OrderItem): string[] {
    return item.product.category === 'McCafé' ? MCCAFE_COUNTED_EXTRAS : [];
  }

  getMcCafeMilkOptions(item: OrderItem): string[] {
    return item.product.category === 'McCafé' ? MCCAFE_MILK_OPTIONS : [];
  }

  canEditItem(item: OrderItem): boolean {
    return this.getIngredients(item).length > 0
      || this.getMcCafeExtras(item).length > 0
      || this.getMcCafeMilkOptions(item).length > 0;
  }

  toggleEditor(item: OrderItem): void {
    this.editingItem = this.editingItem === item ? null : item;
  }

  toggleIngredient(item: OrderItem, ingredient: string): void {
    if (item.removedIngredients.includes(ingredient)) {
      item.removedIngredients = item.removedIngredients.filter(i => i !== ingredient);
    } else {
      item.removedIngredients = [...item.removedIngredients, ingredient];
    }
  }

  getExtraCount(item: OrderItem, extra: string): number {
    return item.extraIngredients[extra] ?? 0;
  }

  changeExtra(item: OrderItem, extra: string, delta: number): void {
    const nextCount = Math.max(0, this.getExtraCount(item, extra) + delta);
    if (nextCount === 0) {
      delete item.extraIngredients[extra];
    } else {
      item.extraIngredients[extra] = nextCount;
    }
  }

  selectMilkOption(item: OrderItem, option: string): void {
    item.milkOption = item.milkOption === option ? null : option;
  }

  getExtraSummary(item: OrderItem): string[] {
    const countedExtras = Object.entries(item.extraIngredients)
      .filter(([, count]) => count > 0)
      .map(([extra, count]) => `${count} mal ${extra}`);

    return item.milkOption
      ? [...countedExtras, item.milkOption]
      : countedExtras;
  }

  get deliveryFee(): number {
    return this.orderService.deliveryFee;
  }

  get checkoutTotal(): number {
    return this.orderService.getCheckoutTotal(this.checkoutForm.controls.checkoutType.value);
  }

  get customerDiscount(): number {
    return this.orderService.getDiscount();
  }

  get cartTotal(): number {
    return this.total - this.customerDiscount;
  }

  removeItem(item: OrderItem): void  { this.orderService.removeItem(item); }

  clearCart(): void {
    this.orderService.clearCart();
    this.checkoutVisible = false;
    this.checkoutForm.reset();
    this.updateAddressValidators();
    this.lastOrder = null;
  }

  openCheckout(): void {
    this.checkoutVisible = true;
    this.thankYouVisible = false;
    this.updateAddressValidators();
    this.lastOrder = null;
  }

  cancelCheckout(): void {
    this.checkoutVisible = false;
    this.thankYouVisible = false;
    this.checkoutForm.reset();
    this.updateAddressValidators();
  }

  closeThankYou(): void {
    this.thankYouVisible = false;
  }

  checkout(): void {
    this.updateAddressValidators();
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    const { checkoutType, pickupTime, customerName, phone, address } = this.checkoutForm.value;
    this.lastOrder = this.orderService.checkout(
      checkoutType!,
      pickupTime!,
      customerName!,
      phone!,
      address ?? ''
    ) as OrderModel;
    void this.customerOrders.save(this.lastOrder).catch(() => {
      // Die Bestellung bleibt erfolgreich; nur die Online-Historie war nicht erreichbar.
    });
    this.checkoutVisible = false;
    this.thankYouVisible = true;
    this.checkoutForm.reset();
    this.updateAddressValidators();
  }

  private updateAddressValidators(): void {
    const addressControl = this.checkoutForm.controls.address;
    if (this.checkoutForm.controls.checkoutType.value === 'Liefern') {
      addressControl.setValidators([Validators.required, Validators.minLength(5)]);
    } else {
      addressControl.clearValidators();
    }
    addressControl.updateValueAndValidity({ emitEvent: false });
  }
}
