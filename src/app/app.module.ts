import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';


import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { ParentCategoryProductsComponent } from './components/parent-category-products/parent-category-products.component';
import { MainCategoryProductsComponent } from './components/main-category-products/main-category-products.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrderConfirmedComponent } from './components/order-confirmed/order-confirmed.component';
import { OnlinePaymentComponent } from './components/online-payment/online-payment.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ViewMoreComponent } from './components/view-more/view-more.component';
import { ChatComponent } from './components/chat/chat.component';
import { PriceFormatPipe } from './pipe/price-format.pipe';
import { TitleCasePipe } from './pipe/title-case.pipe';
import { TypewriterDirective } from './directives/typewriter.directive';
// import { AllProductsComponent } from './components/all-products/all-products.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ViewprofileComponent,
    OrdersComponent,
    FooterComponent,
    AdminLoginComponent,  
     ProductDetailsComponent,
    CategoryProductsComponent,
    ParentCategoryProductsComponent,
    MainCategoryProductsComponent,
    NotFoundComponent,
    CartComponent,
    WishlistComponent,
    OrderConfirmedComponent,
    OnlinePaymentComponent,
    OrderComponent,
    CheckoutComponent,
    ViewMoreComponent,
    ChatComponent,
    TitleCasePipe,
    TypewriterDirective,

    // AllProductsComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PriceFormatPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
