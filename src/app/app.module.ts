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
import { AdminLoginComponent } from './components/Admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/Admin/admin-products/admin-products.component';
import { DashboardContentComponent } from './components/Admin/dashboard-content/dashboard-content.component';
import { AdminAddProductsComponent } from './components/Admin/admin-add-products/admin-add-products.component';
import { AdminViewProductComponent } from './components/Admin/admin-view-product/admin-view-product.component';
import { AdminEditProductComponent } from './components/Admin/admin-edit-product/admin-edit-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { ParentCategoryProductsComponent } from './components/parent-category-products/parent-category-products.component';
import { MainCategoryProductsComponent } from './components/main-category-products/main-category-products.component';

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
    AdminDashboardComponent,    
    AdminProductsComponent,
    DashboardContentComponent,
    AdminAddProductsComponent,
    AdminViewProductComponent,
    AdminEditProductComponent,
    ProductDetailsComponent,
    CategoryProductsComponent,
    ParentCategoryProductsComponent,
    MainCategoryProductsComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
