import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/user/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SearchComponent } from './pages/user/search/search.component';
import { CategoryComponent } from './pages/user/category/category.component';
import { ServiceComponent } from './pages/user/service/service.component';
import { PaymentComponent } from './pages/user/payment/payment.component';
import { MessagesComponent } from './pages/user/messages/messages.component';
import { OrderConfirmationComponent } from './pages/user/order-confirmation/order-confirmation.component';
import { UserComponent } from './layouts/user/user.component';
import { StatsComponent } from './pages/service-provider/stats/stats.component';
import { ServiceProviderComponent } from './layouts/service-provider/service-provider.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'category/:id', component: CategoryComponent },
      { path: 'search/:location/:category', component: CategoryComponent }
    ]
  },
  {
    path: 'service-provider',
    component: ServiceProviderComponent,
    children: [
      { path: 'stats', component: StatsComponent },
    ]
  },
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "payment", component: PaymentComponent },
  { path: "message", component: MessagesComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "search/:id", component: SearchComponent },
  // { path: "category/:id", component: CategoryComponent },
  { path: "service/:id", component: ServiceComponent },
  { path: "order-confirmation", component: OrderConfirmationComponent },
  { path: "**", component: ErrorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }