import { Routes } from '@angular/router';
// Alle Components die über eine URL erreichbar sein sollen, werden hier importiert.
import { Order } from './order/order';
import { About } from './about/about';
import { Career } from './career/career';
import { Contact } from './contact/contact';
import { PageNotFound } from './page-not-found/page-not-found';
import { Admin } from './admin/admin';
import { ProductForm } from './product-form/product-form';

export const routes: Routes = [
  { path: 'order',               component: Order },
  { path: 'about',               component: About },
  { path: 'career',              component: Career },
  { path: 'contact',             component: Contact },
  { path: 'admin',               component: Admin },
  { path: 'admin/product/new',   component: ProductForm },
  { path: 'admin/product/:id',   component: ProductForm },
  { path: '',                    redirectTo: 'order', pathMatch: 'full' },
  { path: '**',                  component: PageNotFound }
];
