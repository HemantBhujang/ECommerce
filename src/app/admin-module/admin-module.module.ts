import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './content/content.component';
import { ProductComponent } from './product/product.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';
import { PriceFormatPipe } from "../pipe/price-format.pipe";

console.log("Admin Module Loaded");

@NgModule({
  declarations: [
    AddProductComponent,
    DashboardComponent,
    ContentComponent,
    ProductComponent,
    OrdersComponent,
    UsersComponent,
    UpdateComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PriceFormatPipe
]
})
export class AdminModuleModule { }
