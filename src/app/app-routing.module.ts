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
import { MyOrderComponent } from './pages/user/my-order/my-order.component';

const routes: Routes = [
    {
      path: 'user',
      component: UserComponent,
      children: [
        { path: 'category/:id', component: CategoryComponent },
        { path: 'search/:location/:category', component: CategoryComponent },
        { path: 'saved/service/:userId', component: CategoryComponent },
        { path: "search/:id", component: SearchComponent },
        { path: "payment/:serviceId/:orderId/:totalAmount", component: PaymentComponent },
        { path: 'order-confirmation/:serviceId/:reserveDate', component: OrderConfirmationComponent },
        { path: "service/:id", component: ServiceComponent },
        {path: "orders", component: MyOrderComponent}

      ]
    },
    { path: "", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "payment/:serviceId/:orderId/:totalAmount", component: PaymentComponent },
    { path: "message", component: MessagesComponent },
    { path: "sign-up", component: SignUpComponent },
    { path: "search/:id", component: SearchComponent },
    // { path: "category/:id", component: CategoryComponent },
    { path: "service/:id", component: ServiceComponent },
    { path: 'order-confirmation/:serviceId/:reserveDate', component: OrderConfirmationComponent },
    { path: "**", component: ErrorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }