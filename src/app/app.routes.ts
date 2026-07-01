import { Routes } from '@angular/router';
import { Order } from './order/order';
import { About } from './about/about';
import { Career } from './career/career';
import { Contact } from './contact/contact';
import { PageNotFound } from './page-not-found/page-not-found';
import { Admin } from './admin/admin';
import { ProductForm } from './product-form/product-form';
import { Login } from './login/login';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  { path: 'order',               component: Order },
  { path: 'about',               component: About },
  { path: 'career',              component: Career },
  { path: 'contact',             component: Contact },
  { path: 'login',               component: Login },
  { path: 'admin',               component: Admin,        canActivate: [adminGuard] },
  { path: 'admin/product/new',   component: ProductForm,  canActivate: [adminGuard] },
  { path: 'admin/product/:id',   component: ProductForm,  canActivate: [adminGuard] },
  { path: '',                    redirectTo: 'order', pathMatch: 'full' },
  { path: '**',                  component: PageNotFound }
];
