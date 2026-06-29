import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../model/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private changed = new Subject<void>();
  public changed$ = this.changed.asObservable();

  private objects: Product[] = [

    new Product('m1', 'Big Mac Menü',           8.99, 'Menüs'),
    new Product('m2', 'McRoyal Menü',           9.49, 'Menüs'),
    new Product('m3', 'McChicken Menü',         8.49, 'Menüs'),
    new Product('m4', 'McRib Menü',             8.99, 'Menüs'),

    new Product('h1', 'Happy Meal Cheeseburger',5.49, 'Happy Meal'),
    new Product('h2', 'Happy Meal Hamburger',   5.49, 'Happy Meal'),
    new Product('h3', 'Happy Meal Nuggets',     5.49, 'Happy Meal'),

    new Product('b1', 'Big Mac',               5.49, 'Burger'),
    new Product('b2', 'McRoyal',               5.99, 'Burger'),
    new Product('b3', 'McRoyal Käse',          5.99, 'Burger'),
    new Product('b4', 'McChicken',             4.49, 'Burger'),
    new Product('b5', 'McRib',                 4.99, 'Burger'),
    new Product('b6', 'Cheeseburger',          1.99, 'Burger'),
    new Product('b7', 'Double Cheeseburger',   2.99, 'Burger'),
    new Product('b8', 'Hamburger',             1.49, 'Burger'),
    new Product('b9', 'Filet-O-Fish',          4.49, 'Burger'),

    new Product('c1', 'McNuggets 6er',         3.99, 'Chicken & Nuggets'),
    new Product('c2', 'McNuggets 9er',         5.49, 'Chicken & Nuggets'),
    new Product('c3', 'McNuggets 20er',        9.99, 'Chicken & Nuggets'),

    new Product('s1', 'Pommes',                2.29, 'Beilagen'),
    new Product('s2', 'Kartoffelecken',        2.99, 'Beilagen'),

    new Product('g1', 'Cola',                  1.99, 'Getränke'),
    new Product('g2', 'Fanta',                 1.99, 'Getränke'),
    new Product('g3', 'Sprite',                1.99, 'Getränke'),
    new Product('g4', 'Iced Tea',              1.99, 'Getränke'),
    new Product('g5', 'Wasser',                1.49, 'Getränke'),

    new Product('k1', 'Kaffee',                1.49, 'McCafé'),
    new Product('k2', 'Cappuccino',            2.49, 'McCafé'),
    new Product('k3', 'Latte Macchiato',       2.99, 'McCafé'),
    new Product('k4', 'Milchkaffee',           2.49, 'McCafé'),
    new Product('k5', 'Frappé',                3.49, 'McCafé'),

    new Product('d1', 'McFlurry',              2.49, 'Desserts'),
    new Product('d2', 'McSundae',              1.49, 'Desserts'),
    new Product('d3', 'Milkshake',             2.99, 'Desserts'),
    new Product('d4', 'Apfeltasche',           1.49, 'Desserts'),
    new Product('d5', 'Softeis',               1.00, 'Desserts'),
  ];

  async getAll(): Promise<Product[]> { return this.objects.slice(); }
  async getById(id: string): Promise<Product | undefined> { return this.objects.find(x => x.id === id); }

  async add(obj: Product): Promise<void> {
    this.objects.push(obj);
    this.changed.next();
  }

  async update(obj: Product): Promise<void> {
    const i = this.objects.findIndex(x => x.id === obj.id);
    if (i !== -1) { this.objects[i] = obj; this.changed.next(); }
  }

  remove(obj: Product): void {
    const i = this.objects.findIndex(x => x.id === obj.id);
    if (i !== -1) { this.objects.splice(i, 1); this.changed.next(); }
  }
}
