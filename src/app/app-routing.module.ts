import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './auth.guard';
import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminLoginComponent } from './components/Admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';

import { MenCategoryComponent } from './components/men-category/men-category.component';
import { WomenCategoryComponent } from './components/women-category/women-category.component';
import { KidsCategoryComponent } from './components/kids-category/kids-category.component';
import { DashboardContentComponent } from './components/Admin/dashboard-content/dashboard-content.component';
import { AdminProductsComponent } from './components/Admin/admin-products/admin-products.component';
import { adminAuthGuard } from '../admin-auth.guard';
import { AdminAddProductsComponent } from './components/Admin/admin-add-products/admin-add-products.component';
import { AdminViewProductComponent } from './components/Admin/admin-view-product/admin-view-product.component';
import { AdminEditProductComponent } from './components/Admin/admin-edit-product/admin-edit-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';



const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"register",
    component:RegisterComponent
  },
  { path: 'userProfile', component: ViewprofileComponent, canActivate: [AuthGuard] },
{path:"orders",component: OrdersComponent,canActivate:[AuthGuard]},
{path : "adminLogin" , component:AdminLoginComponent
},
{
  path:"adminDashboard" , component: AdminDashboardComponent,
    canActivate: [adminAuthGuard],
    children:[
      {path:'',redirectTo:'dashboard',pathMatch:'full'},
      {path:'dashboard',component:DashboardContentComponent},
      {path:'products', component:AdminProductsComponent},
      {path :'addproducts' , component:AdminAddProductsComponent},
      {path:'viewproducts/:id' , component:AdminViewProductComponent},
      {path :'editproducts/:id',component:AdminEditProductComponent}
    ]
  
},
{ path: 'menCategory', component: MenCategoryComponent },
{ path: 'womenCategory', component: WomenCategoryComponent },
{ path: 'kidsCategory', component: KidsCategoryComponent },
{path :"product-details/:id", component:ProductDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
