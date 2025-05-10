import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentComponent } from './content/content.component';
import { ProductComponent } from './product/product.component';
import { UsersComponent } from './users/users.component';
import { OrdersComponent } from './orders/orders.component';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,  // Load Dashboard as the parent component
    children: [
      { path: '', redirectTo: 'content', pathMatch: 'full' }, // Redirect to content by default
      { path: 'content', component: ContentComponent },
      {path:'product',component:ProductComponent},
      {path:"users",component:UsersComponent},
      {path:"orders",component:OrdersComponent},
      {path:"view/:id",component:ViewComponent},
      {path:"update/:id",component:UpdateComponent},
      { path: 'add-product', component: AddProductComponent }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
