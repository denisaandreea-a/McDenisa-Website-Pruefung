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
import { Account } from './account/account';
import { MyOrders } from './my-orders/my-orders';
import { customerGuard } from './shared/customer.guard';

/* hier steht welche URL welche Komponente anzeigt, Angular geht die liste
   von oben nach unten durch und nimmt den ersten treffer den es findet */
export const routes: Routes = [
  { path: 'order',               component: Order },
  { path: 'about',               component: About },
  { path: 'career',              component: Career },
  { path: 'contact',             component: Contact },
  { path: 'login',               component: Login },
  { path: 'konto',               component: Account },
  /* canActivate ist ein Guard, bevor die seite aufgeht prüft Angular ob man das
     überhaupt darf, wenn nein wird man einfach umgeleitet */
  { path: 'meine-bestellungen',  component: MyOrders, canActivate: [customerGuard] },
  { path: 'admin',               component: Admin,        canActivate: [adminGuard] },
  { path: 'admin/product/new',   component: ProductForm,  canActivate: [adminGuard] },
  { path: 'admin/product/:id',   component: ProductForm,  canActivate: [adminGuard] },
  { path: '',                    redirectTo: 'order', pathMatch: 'full' }, // leere URL -> direkt zur Kasse
  { path: '**',                  component: PageNotFound }                // alles andere = 404-Seite
];
